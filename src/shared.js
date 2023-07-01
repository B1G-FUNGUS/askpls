async function getList() {
	let list_path = chrome.runtime.getURL("suffix_list");
	let response = await fetch(list_path);
	let text = await response.text();
	return new RegExp(text.substring(0,text.length-1));
}
async function getHost() {
	// TODO lol chrome treats the console as a tab. This will not be a problem
	// in the future, but for now avoid focusing on it when developing!
	let [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
	let host = new URL(tab.url).hostname;
	return host;
}
async function getStored() {
	let setlist = await chrome.storage.local.get("set");
	return setlist.set;
}
async function getSetting(url) {
	let setlist = await getStored();
	if(setlist == undefined || setlist.indexOf(url) == -1) {
		return "default";
	} else {
		let details = await chrome.contentSettings.cookies.get({primaryUrl: url});
		return details.setting;
	}
}
async function setSetting(url, setting) {
	let current = await getStored();
	console.log(current);
	// wacky code TODO cleanup or comment
	let toWrite = [url];
	if (current != undefined) { 
		if (current.indexOf(url) == -1) current.push(url);
		toWrite = current;
	}
	await chrome.storage.local.set({set: toWrite});
	chrome.contentSettings.cookies.set({primaryPattern: url,
		setting: setting});
	if (setting == "block") {
		let cookies = await chrome.cookies.getAll({url: url});
		cookies.map((cookie) => {
			// TODO extension doesn't support http yet, so will fix later
			specificUrl = "https://" + cookie.domain + cookie.path;
			chrome.cookies.remove({url: specificUrl, name: cookie.name, 
				storeId: cookie.storeId});

		});
	}
}
