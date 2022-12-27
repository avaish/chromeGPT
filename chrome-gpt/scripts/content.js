console.log("We are running!");

const input = document.getElementsByName("q")[0].value;
const topStuff = document.getElementById("topstuff");

let port = chrome.runtime.connect();
port.onMessage.addListener(function (msg) {
    const para = document.createElement("p");
    para.textContent = msg.response;
    topStuff.appendChild(para);
});
port.postMessage({ query: input });