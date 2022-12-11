console.log("We are running!");

const query = document.getElementsByName("q")[0];
const topStuff = document.getElementById("topstuff");

var port = chrome.runtime.connect();
port.onMessage.addListener(function (msg) {
    const para = document.createElement("p");
    para.textContent = msg.response;
    topStuff.appendChild(para);
});
port.postMessage({ question: query.value });