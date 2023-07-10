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
	let startTab = await chrome.tabs.query({active: true,
		lastFocusedWindow: true});
	let activeTab = startTab[0].tabId;
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
		// TODO not using try-catch for these expections b/c then a) the
		// exceptions we *want* to handle are not clear, and b) neither are the
		// errors that we don't
		if (tab == null || tab.url == "") return null;
		let host = new URL(tab.url).hostname
		return getRoot(host);
	}

	// initializng activeDomain so it doesn't equal null on a valid website
	let activeDomain = await getActiveRoot();
	if (activeDomain == null) chrome.action.disable(activeTab);

	// check the waitlist for the active tab's root domain; if it's there then
	// open the popup
	async function checkWaiting() {
		activeDomain = await getActiveRoot();
		if (activeDomain == null) { 
			console.log(activeDomain + " disabled");
			chrome.action.disable(activeTab);
			return;
		}
		console.log(activeDomain + " enabled");
		chrome.action.enable(activeTab);
		domainIndex = waiting.indexOf(activeDomain);
		if (domainIndex != -1 && !popupOpen) {
			popupOpen = true;
			chrome.action.openPopup();
		}
	}

	// following 2 listeners: check waiting list when active tab is changed or
	// active tab is updated
	chrome.tabs.onActivated.addListener((info) => {
		activeTab = info.tabId;
		checkWaiting();
	});

	chrome.tabs.onUpdated.addListener((tabId) => {
		// TODO we could pass the url from this listener, but I don't see a
		// reason to
		if (activeTab == tabId) {
			checkWaiting();
		}
	});

	// add cookies to waiting list
	chrome.cookies.onChanged.addListener(async (changes) => {
		let cdomain = getRoot(changes.cookie.domain);
		if (!changes.removed && await getPolicy(cdomain) == null && 
			waiting.indexOf(cdomain) == -1) { 
			waiting.push(cdomain);
			checkWaiting();
		}
	});

	// tell the popup what the active root is
	// TODO this function is vestigial because now we have a continuous
	// connection w/ the popup
	chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
		if (msg.request == "getActive") {
			// if (activeDomain == null) activeDomain = await getActiveRoot();
			sendResponse({domain: activeDomain});
		} else {
			waiting.splice(waiting.indexOf(msg.request), 1);
		}
	});

	// tell application when popup is closed
	chrome.runtime.onConnect.addListener((port) => {
		console.log("connected");
		port.onDisconnect.addListener(() => {
			console.log("disconnected");
			popupOpen = false;
		});
	});
})();
