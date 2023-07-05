function refresh() {
	let allows = document.getElementById("allow");
	let deletes = document.getElementById("session_only");
	let blocks = document.getElementById("block");
	policies = await chrome.storage.local.get(["allow", "session_only", 
		"block"]);
	policies.allow.map(domain => allows.innerHTML += domain + "<br>");
	policies.session_only.map(domain => deletes.innerHTML += domain + "<br>");
	policies.block.map(domain => blocks.innerHTML += domain + "<br>");
}

document.getElementById("reset").addEventListener(async () => {
	chrome.contentSettings.cookies.clear({});
	await initStorage();
	refresh();
}

async function listSets() {
	let urls = document.getElementById("urls");
	let setlist = await getStored();
	setlist.map(url => urls.innerHTML += url + "<br>");
	let resetB = document.getElementById("reset");
	resetB.addEventListener("mouseup", reset);
}
listSets();
