async function initStorage() {
	// Need to await so we don't do anything before storage is initialized (?)
	// TODO I don't think adding a string to each array is necessary, but I get
	// errors in getPolicy about the arrays being undefined otherwise
	await chrome.storage.local.set({allow: ["empty"], session_only: ["empty"], 
		block: ["empty"]});
}

async function getPolicy(domain) {
	let policies = await chrome.storage.local.get(["allow", "session_only",
		"block"]);
	if (policies.allow.indexOf(domain) != -1) return "allow";
	if (policies.session_only.indexOf(domain) != -1) return "session_only";
	if (policies.block.indexOf(domain) != -1) return "block";
	return null;
}

async function applyPolicy(domain, policy) {
	console.log("Adding policy");
	httpsURL = "https://" + domain + "/*";
	httpURL = "http://" + domain + "/*";
	chrome.contentSettings.cookies.set({primaryPattern: httpsURL, 
		setting: policy});
	chrome.contentSettings.cookies.set({primaryPattern: httpURL,
		setting: policy});
	if (policy == "block") {
		let cookies_https = await chrome.cookies.getAll({url: httpsURL});
		let cookies_http = await chrome.cookies.getAll({url: httpURL});
		let cookies = cookies_https.concat(cookies_http);
		cookies.map((cookie) => {
			chrome.cookies.remove({storeId: cookie.storeId});
			// url:, cookie.name
		});
	}
}
