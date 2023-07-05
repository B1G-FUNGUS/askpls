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
	let activeDomain = null;

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
		if (tab.url == "") return null;
		let host = new URL(tab.url).hostname
		return getRoot(host);
	}

	// check the waitlist for the active tab's root domain; if it's there then
	// open the popup
	async function checkWaiting() {
		console.log("Checking waitlist");
		activeDomain = await getActiveRoot();
		if(activeDomain == null) return;
		domainIndex = waiting.indexOf(activeDomain);
		if (domainIndex != -1) {
			console.log("Prompting user");
			waiting.splice(domainIndex, 1);
			chrome.action.openPopup();
		}
	}

	// following 2 listeners: check waiting list when active tab is changed or
	// active tab is updated
	let activeTab = null;
	chrome.tabs.onActivated.addListener((info) => {
		console.log("Active tab changed");
		activeTab = info.tabId;
		checkWaiting();
	});

	chrome.tabs.onUpdated.addListener((tabId) => {
		// TODO we might want to pass the url we can get from this listener
		// directly to the lambda, but I don't foresee any problems currently
		if (activeTab == tabId) {
			console.log("Active tab updated");
			checkWaiting();
		}
	});

	// add cookies to waiting list
	chrome.cookies.onChanged.addListener(async (changes) => {
		let cdomain = getRoot(changes.cookie.domain);
		if (!changes.removed && await getPolicy(cdomain) == null && 
			waiting.indexOf(cdomain) == -1) { 
			console.log("New cookie set");
			waiting.push(cdomain);
			checkWaiting();
		}
	});

	// tell the popup what the active root is
	chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
		console.log("Responding to popup");
		if (activeDomain == null) {
			sendResponse({domain: await getActiveRoot()});
		} else {
			sendResponse({domain: activeDomain});
			activeDomain = null;
		}
	});
})();
