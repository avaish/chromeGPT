console.log("We are running!");

const query = document.getElementsByName("q")[0];
const topStuff = document.getElementById("topstuff");

var port = chrome.runtime.connect({ name: "gpt" });
port.onMessage.addListener(function (response) {
    const para = document.createElement("p");
    para.textContent = response;
    topStuff.appendChild(para);
});
port.postMessage({ query: query.value });