// inits/resets the storage
async function initStorage() {
	await chrome.storage.local.set({allow: [], session_only: [], block: []});
}

// get's the current policy of a domain
async function getPolicy(domain) {
	let policies = await chrome.storage.local.get(["allow", "session_only",
		"block"]);
	if (policies.allow.indexOf(domain) != -1) return "allow";
	if (policies.session_only.indexOf(domain) != -1) return "session_only";
	if (policies.block.indexOf(domain) != -1) return "block";
	return null;
}

// apply's a policy by setting it in the chrome settings
async function applyPolicy(domain, policy) {
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
			chrome.cookies.remove({storeId: cookie.storeId, name: cookie.name,
				url: "https://" + cookie.domain + cookie.path});
			chrome.cookies.remove({storeId: cookie.storeId, name: cookie.name,
				url: "http://" + cookie.domain + cookie.path});
		});
	}
}
