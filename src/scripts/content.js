console.log("We are running!");

const input = document.getElementsByName("q")[0].value;
const topStuff = document.getElementById("topstuff");

const responsePara = document.createElement("p");
topStuff.appendChild(responsePara);

let port = chrome.runtime.connect();
port.onMessage.addListener(function (msg) {
    responsePara.textContent = msg.response;
});
port.postMessage({ query: input });