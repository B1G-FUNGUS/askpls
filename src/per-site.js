// basically just tell background.js to do everything
// TODO security issue? 99.99% sure it's not but will double check in the
// morning (bash logic has broken my brain)
chrome.runtime.sendMessage({check: true});
