importScripts("shared.js");

(async () => {
	// init storage if uninitialized
	if (await chrome.storage.local.get("installed") == undefined) {
		// awaits to make sure we don't go to the next steps w/out an
		// initialized storage
		await initStorage();
		await chrome.storage.local.set({installed: true});
	}

	// load domain-suffixes regex into memory
	let list_path = chrome.runtime.getURL("suffix_list");
	let response = await fetch(list_path);
	let text = await response.text();
	let suffix_match = new RegExp(text.substring(0,text.length-1));

	let waiting = [];
	let activeTab = null;
	let activeDomain = null;
	let popupOpen = false;

	// get the root domain of a domain
	function getRoot(domain) {
		let root = domain.match(suffix_match);
		if (root == null) return null;
		return "*." + root[0];
	}

	// get the active root domain
	async function getActiveRoot() {
		let [tab] = await chrome.tabs.query({active: true,
				lastFocusedWindow: true});
		// TODO from my testing this works when your homepage is a website, but
		// it might not
		// TODO not using try-catch for these expections b/c then a) the
		// exceptions we *want* to handle are not clear, and b) neither are the
		// errors that we don't
		if (tab == null || tab.url == "") return null;
		let host = new URL(tab.url).hostname
		return getRoot(host);
	}

	// check the waitlist for the active tab's root domain; if it's there then
	// open the popup
	async function checkWaiting() {
		// console.log("Checking waitlist");
		activeDomain = await getActiveRoot();
		if(activeDomain == null) return;
		domainIndex = waiting.indexOf(activeDomain);
		if (domainIndex != -1) {
			if (!popupOpen) {
				// console.log("Prompting user");
				popupOpen = true;
				chrome.action.openPopup();
			} else {
				// console.log("Popup is already open");	
			}
		}
	}

	// following 2 listeners: check waiting list when active tab is changed or
	// active tab is updated
	chrome.tabs.onActivated.addListener((info) => {
		// console.log("Active tab changed");
		activeTab = info.tabId;
		checkWaiting();
	});

	chrome.tabs.onUpdated.addListener((tabId) => {
		// TODO we might want to pass the url we can get from this listener
		// directly to the lambda, but I don't foresee any problems currently
		if (activeTab == tabId) {
			// console.log("Active tab updated");
			checkWaiting();
		}
	});

	// add cookies to waiting list
	chrome.cookies.onChanged.addListener(async (changes) => {
		let cdomain = getRoot(changes.cookie.domain);
		if (!changes.removed && await getPolicy(cdomain) == null && 
			waiting.indexOf(cdomain) == -1) { 
			// console.log("New cookie set");
			waiting.push(cdomain);
			checkWaiting();
		}
	});

	// tell the popup what the active root is
	// TODO this function is vestigial because now we have a continuous
	// connection w/ the popup
	chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
		if (msg.request == "getActive") {
			// TODO technically active domain should never be null since
			// everything that can lead to openPopup() being called (and thus
			// this hook being called) should set the active domain
			if (activeDomain == null) {
				sendResponse({domain: await getActiveRoot()});
			} else {
				sendResponse({domain: activeDomain});
				// activeDomain = null; TODO why did i ever do this?
			}
		} else {
			waiting.splice(waiting.indexOf(msg.request), 1);
		}
	});

	chrome.runtime.onConnect.addListener((port) => {
		port.onDisconnect.addListener(() => {
			popupOpen = false;
		});
	});
})();
