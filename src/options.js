async function reset() {
	// awaits may not be necessary in the future, but they were in testing
	await chrome.contentSettings.cookies.clear({});	
	await chrome.storage.local.clear();
}
/*async function test() {
	chrome.storage.local.set({set: ["a","b","c"]});
}*/
async function listSets() {
	let urls = document.getElementById("urls");
	let setlist = await getStored();
	setlist.map(url => urls.innerHTML += url + "<br>");
	let resetB = document.getElementById("reset");
	resetB.addEventListener("mouseup", reset);
}
listSets();
