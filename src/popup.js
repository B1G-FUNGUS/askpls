// TODO some other way to keep the list always loaded
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
