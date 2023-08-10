let box = document.querySelector("#game_box");
let text = document.querySelector("#game_text");
let timer = document.querySelector("#timer");
let score = document.querySelector("#score");
let fond_noir = document.querySelector("#darkscreen");
let resultat = document.querySelector("#resultat");
let resultat_txt = document.querySelector("#resultat_txt");
let record_txt = document.querySelector("#record");

let liste_record = [0, 0, 0, 0];
let liste_scores = [
	[0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0]
];
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


function nouveau_score(score) {
	let i = 0;
	let changement = false;
	do {
		if (score > liste_scores[i_temps][i]) {
			for (let j = i; j < 4; j++) {
				liste_scores[i_temps][4-j+i] = liste_scores[i_temps][3-j+i];
			}
			liste_scores[i_temps][i] = score;
			changement = true;
		}
		i++;
	} while (i < 5 && !changement)
}


function stop_game() {
	let score = (count/temps_max).toFixed(2)
	window.clearTimeout(chrono);
	fond_noir.style.display = "block";
	resultat.style.display = "flex";
	resultat_txt.innerHTML = "Score: " + score + " clic/seconde"
	nouveau_score(Number(score));
	if (Number(score) > liste_record[i_temps]) {
		record_txt.innerHTML  = "Nouveau record !"
		liste_record[i_temps] = Number(score)
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

resultat.querySelector(".cross").addEventListener("click", close_result)

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

const color_icon = document.querySelector(".settings .gear");
const color_themes = document.querySelector(".color-themes");
let color_txt = "closed"

color_icon.addEventListener("click", () => {
	stop_game2();
	color_themes.style.display = "block";
	fond_noir.style.display = "block";
});

color_themes.querySelector(".cross").addEventListener("click", () => {
	color_themes.style.display = "none";
	fond_noir.style.display = "none";
})


const color_palette = {
	"red": 		["#e66868", "#eb8686"],
	"orange": 	["#e26042", "#e77f67"],
	"yellow": 	["#f5cd7a", "#f7d794"],
	"pink": 	["#f78fb3", "#f8a5c2"],
	"cyan": 	["#3ec1d3", "#64cddb"],
	"blue": 	["#556ee6", "#778beb"]
};
const color_boxes = document.querySelectorAll(".color-container > div");

for (let i = 0; i < color_boxes.length; i++) {
	let color_box = color_boxes[i];
	let color = color_box.classList[0];
	let color_list = color_palette[color];

	color_box.querySelector(".color1").style.backgroundColor = color_list[0];
	color_box.querySelector(".color2").style.backgroundColor = color_list[1];
	color_box.querySelector(".white-strip").style.color = color_list[0];

	color_box.addEventListener("click", () => {
		document.documentElement.style.setProperty("--color1", color_list[0]);
		document.documentElement.style.setProperty("--color2", color_list[1]);
	});
}


const leaderboard = document.querySelector(".leaderboard");
const crown_icon = leaderboard.querySelector(".icon");
const leaderboard_popup  = leaderboard.querySelector(".popup");

crown_icon.addEventListener("click", () => {
	stop_game2();
	leaderboard_popup.style.display = "block";
	fond_noir.style.display = "block";
	let liste_cases = leaderboard_popup.querySelectorAll("li.to-fill");
	for (let i = 0; i < liste_cases.length; i++) {
		liste_cases[i].innerHTML = liste_scores[Math.floor(i/5)][i%5];
	}
});

leaderboard.querySelector(".cross").addEventListener("click", () => {
	leaderboard_popup.style.display = "none";
	fond_noir.style.display = "none";
});

