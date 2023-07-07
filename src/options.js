function appendList(domain, policy) {
	let list = document.getElementById(policy);
	let domainPolicy = document.createElement("div");
	domainPolicy.classList.add("domainPolicy");
	domainPolicy.innerHTML = domain;
	list.append(domainPolicy);
	let dropdown = document.createElement("select");
	dropdown.id = domain;
	dropdown.innerHTML = "<option value='allow'>Allow</option>" +
		"<option value='session_only'>Session Only</option>" +
		"<option value='block'>Block</option>" +
		"<option value='default'>Default</option>";
	dropdown.value = policy;
	domainPolicy.append(dropdown);
}

async function redraw() {
	policies = await chrome.storage.local.get(["allow", "session_only", 
		"block"]);
	policies.allow.map(domain => appendList(domain, "allow"));
	policies.session_only.map(domain => appendList(domain, "session_only"));
	policies.block.map(domain => appendList(domain, "block"));
}

document.getElementById("reset").addEventListener("mouseup", async () => {
	chrome.contentSettings.cookies.clear({});
	await initStorage();
	document.querySelectorAll(".list").forEach(element => 
		element.innerHTML = "");
});

document.getElementById("apply").addEventListener("mouseup", async () => {
	let toWrites = {};
	toWrites["allow"] = [];
	toWrites["session_only"] = [];
	toWrites["block"] = [];
	document.querySelectorAll("select").forEach((domainPolicy) => {
		let domain = domainPolicy.id;
		let policy = domainPolicy.value;
		if (policy != "default") toWrites[policy].push(domain);
	});
	await chrome.storage.local.set(toWrites);
	document.querySelectorAll(".list").forEach(element => 
		element.innerHTML = "");
	redraw();
});

redraw();
