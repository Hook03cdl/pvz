let girasol = null;
let lanzaguisantes = null;
let zombie = null;
let sol = null;
class Plant {
	constructor(x, y, width_ = 60, height_ = 70) {
		this.x = x - width_ / 2;
		this.y = y - height_ / 2;
		this.velocidad = 5;
		this.proyectiles = [];
		this.rango = width;
		this.width_ = width_;
		this.height_ = height_;
	}

	mostrar() {
		fill('green');
		rect(this.x, this.y, this.width_, this.height_);
		image(lanzaguisantes, this.x, this.y, this.width_, this.height_);
		this.proyectiles.forEach((proyectil) => {
			fill('#91ce2d');
			circle(proyectil.x, proyectil.y + 25, 20);
		});
	}

	shot() {
		this.proyectiles.push({ x: this.x + this.width_, y: this.y });
	}

	actualizarProyectiles(zombies) {
		for (let i = 0; i < this.proyectiles.length; i++) {
			this.proyectiles[i].x += this.velocidad;
		}

		this.proyectiles = this.proyectiles.filter(
			(proyectil) => proyectil.x < width
		);
		for (let j = 0; j < zombies.length; j++) {
			for (let i = 0; i < this.proyectiles.length; i++) {
				if (
					dist(
						this.proyectiles[i].x,
						this.proyectiles[i].y,
						zombies[j].x,
						zombies[j].y
					) < 60
				) {
					zombies[j].vida--;
					this.proyectiles.splice(i, 1);
					break;
				}
			}
		}
	}

	detectarZombies(zombies) {
		for (let z of zombies) {
			let distanciaX = Math.abs(this.x - z.x);
			let distanciaY = Math.abs(this.y - z.y);
			if (distanciaX < this.rango && distanciaY < 50) {
				if (frameCount % 90 === 0) {
					this.shot();
				}
				break;
			}
		}
	}
}

class Girasol extends Plant {
	constructor(x, y) {
		super(x, y);
		this.velocidad = 0;
		this.ultimoSol = millis(); // Mover esto al constructor
	}

	mostrar() {
		fill('yellow');
		rect(this.x, this.y, this.width_, this.height_);
		image(girasol, this.x, this.y, this.width_, this.height_);
		if (millis() - this.ultimoSol >= 1000 * 15) {
			this.generarSol();
			this.ultimoSol = millis();
		}
		this.proyectiles.forEach((s) => {
			// fill('red');
			// rect(s.x, s.y, 40, 40); // Dibuja un s cuadrado
			image(sol, s.x, s.y, 40, 40); // Dibuja un sol cuadrado
		});
	}

	generarSol() {
		let x = this.x + random(this.width_);
		let y = this.y + random(this.height_);
		this.proyectiles.push({ x: x - 20, y: y - 20, tiempoVida: 900 });
	}
	detectarZombies(zombies) {}
	actualizarProyectiles(zombies) {}
}

class Zombie {
	constructor(x, y, vida = 5) {
		this.x = x;
		this.y = y;
		this.velocidad = 0.4;
		this.vida = vida;
	}

	mostrar() {
		fill('purple');
		rect(this.x, this.y, 40, 90);
		image(zombie, this.x, this.y, 40, 90);
	}

	mover() {
		this.x -= this.velocidad;
	}
	colision(plantas) {
		for (let p of plantas) {
			if (
				this.x < p.x + p.width_ &&
				this.x + 50 > p.x &&
				this.y < p.y + p.height_ &&
				this.y + 100 > p.y
			) {
				return true;
			}
		}
		return false;
	}
}

class Maps {
	constructor() {
		this.mapa = Array(5)
			.fill(false)
			.map(() => Array(10).fill(false));
	}
	draw() {
		this.mapa.map((col, i) => {
			col.map((row, j) => {
				fill(200);
				rect(100 + width_ * j, height_ * i, width_, height_);
			});
		});
	}
}

let plants = [];
let zombies = [];
let map = new Maps();
var height_;
var width_;
let seleccionado = null;
let tiempoRecarga = 0;
let contadorSoles = 50;
let marcadorSoles;

document.addEventListener('DOMContentLoaded', () => {
	marcadorSoles = document.querySelector('.soles');
});
function preload() {
	girasol = loadImage('img/girasol.png');
	lanzaguisantes = loadImage('img/lanzaguisantes.png');
	zombie = loadImage('img/zombie.png');
	sol = loadImage('img/sol.png');
}

function setup() {
	createCanvas(900, 500);
	height_ = height / 5;
	width_ = width / 10;
	console.log(width_);
}

function draw() {
	background(0);
	map.draw();

	if (tiempoRecarga > 0) {
		tiempoRecarga--;
	}

	// Mostrar y mover los zombies
	for (let z of zombies) {
		z.mostrar();
		if (!z.colision(plants)) {
			z.mover();
		}
		if (z.vida <= 0) {
			let index = zombies.indexOf(z);
			zombies.splice(index, 1);
		}
	}

	// Mostrar las plantas y actualizar los proyectiles
	for (let p of plants) {
		p.mostrar();
		p.actualizarProyectiles(zombies);
		p.detectarZombies(zombies);
	}
	marcadorSoles.innerText = contadorSoles;
}

function mouseClicked() {
	if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
		return;
	}
	for (let p of plants) {
		if (p instanceof Girasol) {
			for (let i = 0; i < p.proyectiles.length; i++) {
				let sol = p.proyectiles[i];
				let distancia = dist(mouseX, mouseY, sol.x + 20, sol.y + 20);
				if (distancia < 20) {
					contadorSoles += 25;
					p.proyectiles.splice(i, 1);
					return;
				}
			}
		}
	}

	// Colocar una planta solo si no se recogió un sol
	if (seleccionado && tiempoRecarga <= 0) {
		let fila = Math.floor(mouseY / height_); // Redondea a la fila más cercana
		let columna = Math.floor(mouseX / width_); // Redondea a la columna más cercana

		// Verificar si ya hay una planta en esta casilla
		if (map.mapa[fila][columna]) {
			return; // No agregar una nueva planta si la casilla ya está ocupada
		}

		let x = columna * width_ + width_ / 2;
		let y = fila * height_ + height_ / 2;
		let planta;
		if (seleccionado === 'girasol') {
			planta = new Girasol(x, y);
			tiempoRecarga = 90; // Tiempo de recarga para el girasol
		} else if (seleccionado === 'lanzaguisantes') {
			planta = new Plant(x, y);
			tiempoRecarga = 60; // Tiempo de recarga para la planta lanzaguisantes
		}
		plants.push(planta);
		map.mapa[fila][columna] = true; // Marcar la casilla como ocupada
		document
			.querySelector('input[name="plantas"]:checked')
			.closest('div')
			.classList.remove('selected');
		document.querySelector('input[name="plantas"]:checked').checked = false;
		seleccionado = null;
	}
}

document.addEventListener('change', (e) => {
	seleccionado = e.target.value;
});

let contadorZombies = 0;
let limiteZombies = 10;
setInterval(() => {
	if (contadorZombies < limiteZombies) {
		let fila = Math.floor(random(5)); // Elige una fila aleatoria entre 0 y 4
		let zombie = new Zombie(width, fila * height_ + 10);
		zombies.push(zombie);
		contadorZombies++;
	}
}, 5000);

document.addEventListener('DOMContentLoaded', () => {
	// Obtén todos los inputs de tipo radio
	let radios = document.querySelectorAll('input[type="radio"]');

	// Itera sobre cada input
	radios.forEach((radio) => {
		// Agrega un event listener para el evento 'change'
		radio.addEventListener('change', function () {
			// Elimina la clase 'selected' de todos los elementos li
			document.querySelectorAll('.plantsContainer div').forEach((card) => {
				card.classList.remove('selected');
			});

			// Si el input está seleccionado, agrega la clase 'selected' al elemento li padre
			if (this.checked) {
				this.closest('div').classList.add('selected');
			}
		});
	});
});
