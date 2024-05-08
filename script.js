// Definición de las clases de Plants y Zombies
class Plant {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.velocidad = 5;
		this.proyectiles = [];
		this.rango = width;
	}

	mostrar() {
		fill('green');
		rect(this.x, this.y, 50, 50);
		this.proyectiles.forEach((proyectil) => {
			fill('green');
			rect(proyectil.x, proyectil.y, 20, 20);
		});
	}

	shot() {
		this.proyectiles.push({ x: this.x + 50, y: this.y });
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
	}

	mostrar() {
		fill('yellow');
		ellipse(this.x, this.y, 50, 50);
		if (frameCount % (60 * 5) === 0) {
			this.generarSol();
		}
		this.proyectiles.forEach((sol, index) => {
			fill('red');
			ellipse(sol.x, sol.y, 30, 30);
			if (sol.y >= this.y - 50) {
				sol.y -= 1; // Mover el sol hacia arriba
			}
			sol.tiempoVida--; // Disminuir el tiempo de vida del sol
			if (sol.tiempoVida <= 0) {
				this.proyectiles.splice(index, 1); // Eliminar el sol si su tiempo de vida ha terminado
			}
		});
	}

	generarSol() {
		let angulo = random(0, 2 * PI); // Un ángulo aleatorio
		let radio = random(20, 50); // Una distancia aleatoria desde el centro del girasol
		let x = this.x + radio * cos(angulo);
		let y = this.y + radio * sin(angulo);
		this.proyectiles.push({ x: x, y: y, tiempoVida: 900 });
	}
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
		rect(this.x, this.y, 50, 100);
	}

	mover() {
		this.x -= this.velocidad;
	}
}

class Maps {
	constructor() {}
	draw() {
		for (let i = 0; i <= 5; i++) {
			for (let j = 0; j <= 9; j++) {
				fill(200);
				rect(width_ * j, height_ * i, width_, height_);
			}
		}
	}
	isBusy(plant) {}
}

let plants = [];
let zombies = [];
let map = new Maps();
var height_;
var width_;
let seleccionado = null;
let tiempoRecarga = 0;
let contadorSoles = 0;

function setup() {
	createCanvas(800, 600);
	height_ = height / 5;
	width_ = width / 9;
	console.log(width);
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
		z.mover();
		if (z.vida <= 0) {
			let index = zombies.indexOf(z);
			zombies.splice(index, 1);
		}
	}

	for (let p of plants) {
		p.mostrar();
		p.actualizarProyectiles(zombies);
		p.detectarZombies(zombies);
	}
}

function mouseClicked() {
	// Verificar si se ha hecho clic en un sol
	for (let p of plants) {
		if (p instanceof Girasol) {
			for (let i = 0; i < p.proyectiles.length; i++) {
				let sol = p.proyectiles[i];
				let distancia = dist(mouseX, mouseY, sol.x, sol.y);
				if (distancia < 15) {
					contadorSoles++;
					p.proyectiles.splice(i, 1);
					break;
				}
			}
		}
	}

	if (seleccionado && tiempoRecarga <= 0) {
		let fila = Math.floor(mouseY / height_); // Redondea a la fila más cercana
		let columna = Math.floor(mouseX / width_); // Redondea a la columna más cercana
		let x = columna * width_ + width_ / 2;
		let y = fila * height_ + height_ / 2;

		// Verificar si ya hay una planta en esta casilla
		let casillaOcupada = plants.some((p) => p.x === x && p.y === y);
		if (casillaOcupada) {
			return; // No agregar una nueva planta si la casilla ya está ocupada
		}

		let planta;
		if (seleccionado === 'girasol') {
			planta = new Girasol(x, y);
			tiempoRecarga = 90; // Tiempo de recarga para el girasol
		} else if (seleccionado === 'lanzaguisantes') {
			planta = new Plant(x - 25, y - 25);
			tiempoRecarga = 60; // Tiempo de recarga para la planta lanzaguisantes
		}
		plants.push(planta);
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
