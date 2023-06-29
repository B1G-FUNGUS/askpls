// TODO some other way to keep the list always loaded
async function getList() {
	let list_path = chrome.runtime.getURL("suffix_list");
	let response = await fetch(list_path);
	let text = await response.text();
	return new RegExp(text.substring(0,text.length-1));
}
async function getHost() {
	let [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
	let host = new URL(tab.url).hostname;
	return host;
}
async function getSetting(url) {
	let details = await chrome.contentSettings.cookies.get({primaryUrl: url});
	return details.setting
}
async function setSetting(url, setting) {
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
async function popup() {
	// getting info
	let list = await getList();
	let host = await getHost();
	let root = "*." + host.match(list)[0];
	url = "https://" + root + "/*";
	document.getElementById("root domain").innerHTML = root;
	let setting = await getSetting(url);
	document.getElementById(setting).disabled = true;

	// setting info
	function bupdate() {
		document.getElementById(setting).disabled = false;
		this.disabled = true;
		setting = this.id;
		setSetting(url, setting);
	}
	let allowB = document.getElementById("allow");
	let blockB = document.getElementById("block");
	let deleteB = document.getElementById("session_only");
	allowB.addEventListener("mouseup", bupdate);
	blockB.addEventListener("mouseup", bupdate);
	deleteB.addEventListener("mouseup", bupdate);
}
popup();
