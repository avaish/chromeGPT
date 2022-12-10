console.log("We are running!");

const query = document.getElementsByName("q")[0];

const topStuff = document.getElementById("topstuff");

const para = document.createElement("p");
para.textContent = query.value;

topStuff.appendChild(para);