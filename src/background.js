importScripts("shared.js");
async function checkSite() {
	let list = await getList();
	// TODO technically the active window might not be the same as the
	// content-script's tab's url by the time we get the message!!
	// But this is just a proof-of-concept, so we'll deal with it for now
	let host = await getHost();
	let root = "*." + host.match(list)[0];
	url = "https://" + root + "/*";
	setlist = await getStored();
	if (setlist.indexOf(url) == -1) {
		function promptUser(info) {
			// TODO in theory only info.removed & info.cookie should strictly
			// matter, although I can see cases where you get weird (but not
			// broken) behavior from setting a cookie outside the site
			// TODO I could just match against root instead of the entire list,
			// but I'm super tired so I'll bodge it for now
			cookieRoot = "*." + info.cookie.domain.match(list)[0];
			if (info.removed == false && cookieRoot == root) {
				console.log(cookieRoot);
				chrome.action.openPopup();
				// TODO message popup.html so it skips test? I know there's no
				// speed orlag issue, but something to consider
				/*chrome.notifications.create({iconUrl: "", message: "a", 
					title: "b", type: "basic"});*/
			}
		}
		chrome.cookies.onChanged.addListener(promptUser);
	}
}
// route isn't needed at this time, but may be useful in the future
function route(request, sender) {
	// lazyness
	console.log("BIG CHUNGUS!!!!!!");
	checkSite();
}
chrome.runtime.onMessage.addListener(route);
