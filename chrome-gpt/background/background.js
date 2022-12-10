var port = chrome.runtime.connect({ name: "gpt" });
port.onMessage.addListener(function (query) {
    console.log(`received query: ${query}`)
    port.postMessage({ response: `response: ${query}` });
});