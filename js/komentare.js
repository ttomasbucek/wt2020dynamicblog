import { render } from "mustache";

function opinion2html(opinion) {
  const opinionView = {
    name: opinion.name,
    email: opinion.email,
    img_url: opinion.img_url,
    commentary: opinion.commentary,
    favourite_team: opinion.favourite_team,
    createdDate: new Date(opinion.created).toDateString(),
    is_good_source: opinion.is_good_source
      ? "TÃ¡to strÃ¡nka je dobrÃ½m zdrojom informÃ¡ciÃ­."
      : "TÃ¡to strÃ¡nka neobsahuje dostatok informÃ¡ciÃ­."
  };

  const template = document.getElementById("TemplateShow").innerHTML;
  return render(template, opinionView);
}

function opinionArray2html(sourceData) {
  let htmlWithOpinions = "";
  for (const opn of sourceData) {
    htmlWithOpinions += opinion2html(opn);
  }
  return htmlWithOpinions;
}

let opinions = [];

const opinionsElm = document.getElementById("opinionsContainer");

if (localStorage.MyPageComments) {
  opinions = JSON.parse(localStorage.MyPageComments);
}

opinionsElm.innerHTML = opinionArray2html(opinions);

//--------------------------------------------------------
//Nacitanie komentarov------------------------------------

if (localStorage.MyPageComments) {
  opinions = JSON.parse(localStorage.MyPageComments);
}

console.log(opinions);
let myFrmElm = document.getElementById("formular");

myFrmElm.addEventListener("submit", processOpnFrmData);
myFrmElm.addEventListener("zmazanie_komentarov", remove_old);
let selected;
myFrmElm.addEventListener("click", () => {
  selected = document.querySelector('input[name="radio_opinion"]:checked');
});

function remove_old(event) {
  event.preventDefault();
  for (const opn of opinions) {
    if (Date.now() - new Date(opn.created) > 86400000) opinions -= opn;
  }
  localStorage.MyPageComments = JSON.stringify(opinions);
  opinionsElm.innerHTML = opinionArray2html(opinions);
}

const email = document.getElementById("email");
email.addEventListener("input", function(event) {
  if (email.validity.typeMismatch) {
    email.setCustomValidity(
      "EmailovÃ¡ adresa mÃ¡ obsahovaÅ¥ znak '@' a domÃ©nu!"
    );
  } else {
    email.setCustomValidity("");
  }
});

function processOpnFrmData(event) {
  //1.prevent normal event (form sending) processing
  event.preventDefault();

  //2. Read and adjust data from the form (here we remove white spaces before and after the strings)
  let elements = document.getElementsByTagName("input");
  const name = elements.namedItem("login").value.trim();
  const email = elements.namedItem("email").value.trim();
  const img_url = elements.namedItem("obrazok").value.trim();
  const commentary = document.getElementById("textarea").value;
  const is_good_source = elements.namedItem("check").checked;
  const favourite_team = elements.namedItem("datalist_input").value.trim();
  if (selected === null) {
    selected = { value: "none" };
  }
  const radio_option = selected.value;
  /*
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const img_url = document.getElementById("image").value.trim();
    const commentary = document.getElementById("textarea").value;
    const is_good_source = document.getElementById("check").checked;
    const favourite_team = document.getElementById("datalist_input").value.trim();
    const radio_option = selected.value;
*/

  //3. Verify the data
  if (name === "" || email === "" || commentary === "") {
    window.alert("Please, your name, opinion and email address");
    return;
  }

  //3. Add the data to the array opinions and local storage
  const newOpinion = {
    name: name,
    email: email,
    img_url: img_url,
    radio_option: radio_option,
    commentary: commentary,
    is_good_source: is_good_source,
    favourite_team: favourite_team,
    created: new Date()
  };

  console.log("New opinion:\n " + JSON.stringify(newOpinion));

  opinions.push(newOpinion);

  localStorage.MyPageComments = JSON.stringify(opinions);

  //4. Notify the user
  window.alert("Your opinion has been stored. Look to the console");
  console.log("New opinion added");
  console.log(opinions);
  opinionsElm.innerHTML += opinion2html(newOpinion);

  //5. Reset the form
  myFrmElm.reset(); //resets the form
}
