// appends/removes a policy from the list
async function setPolicy(domain, policy) {
	let current = await getPolicy(domain);
	if (current != null) {
		let removeList = await chrome.storage.local.get(current);
		let index = removeList[current].indexOf(domain);
		removeList[current].splice(index, 1);
		chrome.storage.local.set(removeList);
	}
	let addList = await chrome.storage.local.get(policy);
	addList[policy].push(domain);
	chrome.storage.local.set(addList);
	applyPolicy(domain, policy);
}


(async () => {
	await chrome.runtime.connect({name: "popup-background"});
	let response = await chrome.runtime.sendMessage({request: "getActive"});
	let rootDomain = response.domain;
	document.getElementById("root domain").innerHTML = rootDomain;
	let policy = await getPolicy(rootDomain);
	if (policy != null) document.getElementById(policy).disabled = true;
	function bupdate() {
		if (policy != null) document.getElementById(policy).disabled = false;
		this.disabled = true;
		policy = this.id;
		setPolicy(rootDomain, policy);
		// TODO might need to await this
		chrome.runtime.sendMessage({request: rootDomain});
	}
	document.getElementById("allow").addEventListener("mouseup", bupdate);
	document.getElementById("session_only").addEventListener("mouseup", bupdate);
	document.getElementById("block").addEventListener("mouseup", bupdate);
})();
