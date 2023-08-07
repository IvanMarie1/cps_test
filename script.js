let box = document.getElementById("game_box");
let text = document.getElementById("game_text");
let timer = document.getElementById("timer");
let score = document.getElementById("score");
let fond_noir = document.getElementById("darkscreen");
let resultat = document.getElementById("resultat");
let resultat_txt = document.getElementById("resultat_txt");
let record_txt = document.getElementById("record");

let liste_record = [0, 0, 0, 0];
let temps, chrono, temps_diff;
let count = 0;
let i_temps = 1;
let temps_max = 5;
let dico_temps = {1: 0, 5: 1, 10: 2, 30: 3};

box.addEventListener("click", start);
box.addEventListener("click", click)

function start(e) {
	box.removeEventListener("click", start)
	temps = Date.now();
	chrono = window.setInterval(afficher_temps, 10)
}

function click(e) {
	let left = e.clientX - box.getBoundingClientRect().left;
	let top = e.clientY - box.getBoundingClientRect().top;

	count += 1;
	text.innerHTML = count;
	let effect = document.createElement("span");
	effect.style.cssText = `
	position: absolute;
	top: ${top}px;
	left: ${left}px;
	width: 80%;
	aspect-ratio: 1 / 1;
	transform: translate(-50%, -50%) scale(0);
	border-radius: 50%;
	background: var(--color2);
	opacity: 0;
	animation: animation_click .5s ease-out;
	animation-iteration-count: 1;
	`
	effect.addEventListener("animationend", (e) => {
		e.target.remove();
	})
	box.appendChild(effect)

}

function afficher_temps() {
	temps_diff = ((Date.now() - temps)/1000).toFixed(2)
	timer.innerHTML = temps_diff + "s";
	score.innerHTML = (count/temps_diff).toFixed(2) + " CPS"
	if (temps_diff >= temps_max) {
		stop_game();
	}
}

function stop_game() {
		window.clearTimeout(chrono);
		fond_noir.style.display = "block";
		resultat.style.display = "flex";
		resultat_txt.innerHTML = "Score: " + (count/temps_diff).toFixed(2) + " clic/seconde"
		if (Number((count/temps_diff).toFixed(2)) > liste_record[i_temps]) {
			record_txt.innerHTML  = "Nouveau record !"
			liste_record[i_temps] = Number((count/temps_diff).toFixed(2))
		} else {
			record_txt.innerHTML = "Ancien record: " + liste_record[i_temps] + " clic/seconde"
		}
}

function stop_game2() {
	// Arrête le jeu sans afficher le résultat
	window.clearTimeout(chrono);
	box.addEventListener("click", start)
	count = 0;
	text.innerHTML = "Clique ici pour commencer";
	timer.innerHTML = "0.00s";
	score.innerHTML = "0.00 CPS";
}

document.getElementById("cross").addEventListener("click", close_result)

function close_result() {
	fond_noir.style.display = "none";
	resultat.style.display = "none";
	box.addEventListener("click", start)
	count = 0;
	text.innerHTML = "Clique ici pour commencer";
	timer.innerHTML = "0.00s";
	score.innerHTML = "0.00 CPS";
}


function change_time(t, name) {
	stop_game2();
	document.querySelector("li.active").classList.remove("active");
	document.querySelector(`li.${name}`).classList.add("active");
	temps_max = t;
	i_temps = dico_temps[t];
}




let currentThemeSetting = "light";

const theme_btn = document.querySelector("[data-theme-toggle]");

theme_btn.addEventListener("click", () => {
	const newTheme = currentThemeSetting === "dark" ? "light" : "dark";
	document.querySelector("html").setAttribute("data-theme", newTheme);
	currentThemeSetting = newTheme;

	const newCta = newTheme === "dark" ? "Change to light theme" : "Change to dark theme";
	theme_btn.setAttribute("aria-label", newCta);

	if (newTheme === "light") {
		theme_btn.classList.remove("active");
		document.querySelector(".slider img").setAttribute("src", "img/icon_sun.png")
	} else {
		theme_btn.classList.add("active");
		document.querySelector(".slider img").setAttribute("src", "img/icon_moon.png")
	}
});

const gear_icon = document.querySelector(".gear img");
const gear = document.querySelector(".settings .gear");
let gear_txt = "closed"

gear_icon.addEventListener("click", () => {
	if (gear_txt === "closed") {
		gear.classList.add("open")
		gear_icon.classList.add("open");
		gear_txt = "open";
	} else {
		gear.classList.remove("open");
		gear_icon.classList.remove("open");
		gear_txt = "closed";
	}
});


const color_themes = {
	"red": 		["#e66868", "#eb8686"],
	"orange": 	["#e26042", "#e77f67"],
	"yellow": 	["#f5cd7a", "#f7d794"],
	"pink": 	["#f78fb3", "#f8a5c2"],
	"cyan": 	["#3ec1d3", "#64cddb"],
	"blue": 	["#556ee6", "#778beb"]
};
const color_boxes = document.querySelectorAll(".color-themes > div");

for (let i = 0; i < color_boxes.length; i++) {
	let color_box = color_boxes[i];
	color_box.addEventListener("click", () => {
		let color = color_box.classList[0];
		document.documentElement.style.setProperty("--color1", color_themes[color][0]);
		document.documentElement.style.setProperty("--color2", color_themes[color][1]);
	});
}
