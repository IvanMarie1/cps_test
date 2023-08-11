let game_box = document.querySelector("#game-box");
let game_text = document.querySelector(".game-text");
let game_result = document.querySelector(".game-result");
let timer = document.querySelector(".timer");
let score = document.querySelector(".score");
let dark_screen = document.querySelector("#darkscreen");

let record_list = [0, 0, 0, 0];
let score_list = [
	[0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0]
];
let time, chrono, time_diff;
let count = 0;
let time_max = 5;
let time_index = 1;
let time_dict = {1: 0, 5: 1, 10: 2, 30: 3};

game_box.addEventListener("click", start);
game_box.addEventListener("click", click)

function start(e) {
	game_box.removeEventListener("click", start)
	time = Date.now();
	chrono = window.setInterval(afficher_temps, 10)
}

function click(e) {
	let left = e.clientX - game_box.getBoundingClientRect().left;
	let top = e.clientY - game_box.getBoundingClientRect().top;

	count += 1;
	game_text.innerHTML = count;
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
	game_box.appendChild(effect)

}

function afficher_temps() {
	time_diff = ((Date.now() - time)/1000).toFixed(2)
	timer.innerHTML = time_diff + "s";
	score.innerHTML = (count/time_diff).toFixed(2) + " CPS"
	if (time_diff >= time_max) {
		stop_game();
	}
}


function nouveau_score(score) {
	let i = 0;
	let changement = false;
	do {
		if (score > score_list[time_index][i]) {
			for (let j = i; j < 4; j++) {
				score_list[time_index][4-j+i] = score_list[time_index][3-j+i];
			}
			score_list[time_index][i] = score;
			changement = true;
		}
		i++;
	} while (i < 5 && !changement)
}


function stop_game() {
	let score = (count/time_max).toFixed(2)
	window.clearTimeout(chrono);
	dark_screen.style.display = "block";
	game_result.style.display = "flex";
	document.querySelector(".result-txt").innerHTML = "Score: " + score + " clic/seconde"
	nouveau_score(Number(score));
	if (Number(score) > record_list[time_index]) {
		document.querySelector(".record-txt").innerHTML  = "Nouveau record !"
		record_list[time_index] = Number(score)
	} else {
		document.querySelector(".record-txt").innerHTML = "Ancien record: " + record_list[time_index] + " clic/seconde"
	}
}

function stop_game2() {
	// Arrête le jeu sans afficher le résultat
	window.clearTimeout(chrono);
	game_box.addEventListener("click", start)
	count = 0;
	game_text.innerHTML = "Clique ici pour commencer";
	timer.innerHTML = "0.00s";
	score.innerHTML = "0.00 CPS";
}

game_result.querySelector(".cross").addEventListener("click", close_result)

function close_result() {
	dark_screen.style.display = "none";
	game_result.style.display = "none";
	game_box.addEventListener("click", start)
	count = 0;
	game_text.innerHTML = "Clique ici pour commencer";
	timer.innerHTML = "0.00s";
	score.innerHTML = "0.00 CPS";
}


function change_time(t, name) {
	stop_game2();
	document.querySelector("li.active").classList.remove("active");
	document.querySelector(`li.${name}`).classList.add("active");
	time_max = t;
	time_index = time_dict[t];
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


const color_themes = document.querySelector(".color-themes");

document.querySelector(".color-icon").addEventListener("click", () => {
	stop_game2();
	color_themes.style.display = "block";
	dark_screen.style.display = "block";
});

color_themes.querySelector(".cross").addEventListener("click", () => {
	color_themes.style.display = "none";
	dark_screen.style.display = "none";
})


const color_palette = {
	"red": 		["#e66868", "#eb8686"],
	"orange": 	["#e26042", "#e77f67"],
	"yellow": 	["#f5cd7a", "#f7d794"],
	"pink": 	["#f78fb3", "#f8a5c2"],
	"cyan": 	["#3ec1d3", "#64cddb"],
	"blue": 	["#556ee6", "#778beb"]
};
const color_boxes = document.querySelectorAll(".color-box");

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
const crown_icon = leaderboard.querySelector(".lead-icon");
const lead_container  = leaderboard.querySelector(".lead-container");

crown_icon.addEventListener("click", () => {
	stop_game2();
	lead_container.style.display = "block";
	dark_screen.style.display = "block";
	let liste_cases = lead_container.querySelectorAll("li.to-fill");
	for (let i = 0; i < liste_cases.length; i++) {
		liste_cases[i].innerHTML = score_list[Math.floor(i/5)][i%5];
	}
});

leaderboard.querySelector(".cross").addEventListener("click", () => {
	lead_container.style.display = "none";
	dark_screen.style.display = "none";
});
