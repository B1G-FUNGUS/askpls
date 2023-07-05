function makeObject(policy, list) {
	// TODO there must be some better way to do this
	switch(policy) {
		case "allow":
			return {allow: list};
			break;
		case "session_only":
			return {session_only: list};
			break;
		case "block":
			return {block: list};
			break;
	}
}

async function setPolicy(domain, policy) {
	current = await getPolicy(domain);
	let removeList = await chrome.storage.local.get(current);
	removeList.splice(domain, 1);
	chrome.storage.local.set(makeObject(current, removeList));
	let addList = await chrome.storage.local.get(policy);
	addList.push(domain);
	chrome.storage.local.set(makeObject(policy, addList));
	applyPolicy(domain, policy);
}

(async () => {
	let response = await chrome.runtime.sendMessage({request: "getActive"});
	let rootDomain = response.domain;
	console.log(rootDomain);
	document.getElementById("root domain").innerHTML = rootDomain;
	let policy = await getPolicy(rootDomain);
	console.log(policy);
	if (policy != null) document.getElementById(policy).disabled = true;
	function bupdate() {
		if (policy != null) document.getElementById(policy).disabled = false;
		this.disabled = true;
		policy = this.id;
		setPolicy(rootDomain, policy);
	}
	document.getElementById("allow").addEventListener("mouseup", bupdate);
	document.getElementById("session_only").addEventListener("mouseup", bupdate);
	document.getElementById("block").addEventListener("mouseup", bupdate);
})();
