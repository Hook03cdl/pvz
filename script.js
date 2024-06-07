let girasol = [];
let lanzaguisantes = [];
let repetidora = [];
let nuez = [];
let patatapum = [];
let zombie = { eat: null, walk: null };
let zombieFlag = { eat: null, walk: null };
let zombieBucket = { eat: [], walk: [] };
let zombieCone = { eat: [], walk: [] };
let floor = null;
let grass1 = null,
	grass2 = null;
let lawnmower = null;

let sol = null;
let nivel = [
	[10, 15, 20],
	[25, 30, 35],
	[25, 30, 35],
];

class Sol {
	constructor(x, y) {
		this.finish = y + 50;
		this.x = x;
		this.y = y;
	}
	mostrar() {
		image(sol, this.x, this.y, 40, 40);
		if (this.y <= this.finish) {
			this.y++;
		}
	}
}

class Podadora {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.isColision = false;
		this.velocidad = 5;
	}
	mostrar() {
		if (this.isColision) {
			this.x += this.velocidad;
		}
		image(lawnmower, this.x, this.y, width_, height_ - 50);
	}
	colision(zombie) {
		for (let z of zombie) {
			if (dist(this.x, this.y, z.x, z.y) < width_ - 50) {
				z.vida = 0;
				this.isColision = true;
			}
		}
	}
}

class Plantas {
	constructor(x, y, columna, fila, img, width_ = 50, height_ = 60, vida = 5) {
		this.x = x - width_ / 2;
		this.y = y - height_ / 2;
		this.velocidad = 7;
		this.proyectiles = [];
		this.rango = width;
		this.width_ = width_;
		this.height_ = height_;
		this.vida = vida;
		this.currentImg = 0;
		this.img = img;
		this.columna = columna;
		this.fila = fila;
	}

	mostrar() {
		if (frameCount % 12 == 0) {
			this.currentImg++;
		}
		if (this.currentImg >= this.img.length - 1) {
			this.currentImg = 0;
		}
		this.proyectiles.forEach((proyectil) => {
			fill('#91ce2d');
			circle(proyectil.x, proyectil.y + 25, 25);
		});
		image(this.img[this.currentImg], this.x, this.y, this.width_, this.height_);
	}

	shot() {
		this.proyectiles.push({ x: this.x + 30, y: this.y });
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
					this.proyectiles[i].x >= zombies[j].x &&
					this.proyectiles[i].x <= zombies[j].x + 50 &&
					this.proyectiles[i].y >= zombies[j].y &&
					this.proyectiles[i].y <= zombies[j].y + 100
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

class Girasol extends Plantas {
	constructor(x, y, columna, fila, img, width_, height_) {
		super(x, y, columna, fila, img, width_, height_);
		this.velocidad = 0;
		this.ultimoSol = millis();
		this.currentImg = 0;
	}

	mostrar() {
		if (this.img[this.currentImg] !== undefined) {
			image(
				this.img[this.currentImg],
				this.x,
				this.y,
				this.width_,
				this.height_
			);
		}
		if (this.currentImg >= this.img.length - 1) {
			this.currentImg = 0;
		}

		if (frameCount % 12 == 0) {
			this.currentImg++;
		}
		if (millis() - this.ultimoSol >= 1000 * 20) {
			this.generarSol();
			this.ultimoSol = millis();
		}
		this.proyectiles.forEach((s) => {
			image(sol, s.x, s.y, 40, 40); // Dibuja un sol cuadrado
		});
	}

	generarSol() {
		let x = this.x + random(this.width_);
		let y = this.y + random(this.height_);
		this.proyectiles.push({ x: x - 20, y: y - 20, tiempoVida: millis() });
	}
	detectarZombies(zombies) {}
	actualizarProyectiles(zombies) {}
}
class Nuez extends Plantas {
	constructor(x, y, columna, fila, img, width_, height_) {
		super(x, y, columna, fila, img, width_, height_);
		this.vida = 40;
		this.currentImg = 0;
	}
	mostrar() {
		if (this.img[this.currentImg] !== undefined) {
			image(
				this.img[this.currentImg],
				this.x,
				this.y,
				this.width_,
				this.height_
			);
		}
		if (this.vida == Math.floor(this.vida * 0.8)) {
			this.currentImg = 1;
		} else if (this.vida == Math.floor(this.vida * 0.5)) {
			this.currentImg = 2;
		}
	}
	detectarZombies(zombies) {}
	actualizarProyectiles(zombies) {}
}
class Patatapum extends Plantas {
	constructor(x, y, columna, fila, img, width_, height_) {
		super(x, y, columna, fila, img, width_, height_);
		this.isActive = false;
		this.activationTime = millis() + 13000;
		this.currentImg = 0;
	}
	mostrar() {
		image(this.img[this.currentImg], this.x, this.y, this.width_, this.height_);
	}
	detectarZombies(zombies) {
		if (millis() >= this.activationTime) {
			this.isActive = true;
			this.currentImg = 1;
		}
		if (this.isActive) {
			for (const z of zombies) {
				if (dist(this.x, this.y, z.x, z.y) < 40) {
					z.vida = 0;
					map.mapa[this.fila][this.columna] = false;
					let index = plantas.indexOf(this);
					plantas.splice(index, 1);
				}
			}
		}
	}
	actualizarProyectiles(zombies) {}
}
class Repetidora extends Plantas {
	constructor(x, y, columna, fila, img, width_, height_) {
		super(x, y, columna, fila, img, width_, height_);
		this.vida = 10;
		this.lastShotTime = 0;
		this.shotCounter = 0;
	}
	shot() {
		this.proyectiles.push({ x: this.x + 30, y: this.y });
		setTimeout(() => {
			this.proyectiles.push({ x: this.x + 30, y: this.y });
		}, 100);
	}
}
class Zombie {
	constructor(x, y, imgWalk, imgEat) {
		this.x = x;
		this.y = y;
		this.velocidad = 0.5;
		this.vida = 10;
		this.currentImg = 0;
		this.imgWalk = imgWalk;
		this.imgEat = imgEat;
		this.img = imgWalk;
	}

	mostrar() {
		image(this.img, this.x, this.y, width_ - 20, height_ - 20);
	}

	mover() {
		this.x -= this.velocidad;
	}
	colision(plantas) {
		for (let p of plantas) {
			if (dist(this.x, this.y, p.x, p.y) < 30) {
				this.img = this.imgEat;
				if (frameCount % 60 == 0) {
					p.blinking = true; // Activa el parpadeo
					p.vida--;
					setTimeout(() => {
						p.blinking = false;
					}, 1000);
				}
				return true;
			}
		}
		this.img = this.imgWalk;
		return false;
	}
}
class ZombieBucket extends Zombie {
	constructor(x, y, imgWalk, imgEat) {
		super(x, y, imgWalk, imgEat);
		this.vida = 40;
		this.currentImg = 0;
	}
	mostrar() {
		if (this.img[this.currentImg] !== undefined) {
			image(
				this.img[this.currentImg],
				this.x,
				this.y,
				width_ - 20,
				height_ - 20
			);
		}
		if (this.vida == 30) {
			this.currentImg = 1;
		} else if (this.vida == 20) {
			this.currentImg = 2;
		} else if (this.vida == 10) {
			this.currentImg = 3;
		}
	}
}
class ZombieCone extends Zombie {
	constructor(x, y, imgWalk, imgEat) {
		super(x, y, imgWalk, imgEat);
		this.vida = 30;
		this.currentImg = 0;
	}
	mostrar() {
		if (this.img[this.currentImg] !== undefined) {
			image(
				this.img[this.currentImg],
				this.x,
				this.y,
				width_ - 20,
				height_ - 20
			);
		}

		if (this.vida == 23) {
			this.currentImg = 1;
		} else if (this.vida == 15) {
			this.currentImg = 2;
		} else if (this.vida == 10) {
			this.currentImg = 3;
		}
	}
}

class Maps {
	constructor() {
		this.mapa = Array(5)
			.fill(false)
			.map(() => Array(9).fill(false));
	}
	draw() {
		fill(150);
		for (let i = 0; i < 5; i++) {
			image(floor, 0, height_ * i, width_, height_);
		}
		this.mapa.map((col, i) => {
			col.map((row, j) => {
				let grass = null;
				if (i % 2 == 0) {
					grass = j % 2 == 0 ? grass1 : grass2;
					// fill(100);
				} else {
					grass = j % 2 == 0 ? grass2 : grass1;
				}
				image(grass, width_ + width_ * j, height_ * i, width_, height_);
			});
		});
	}
}

let plantas = [];
let zombies = [];
let podadoras = [];
let soles = [];
let map = new Maps();
var height_;
var width_;
let seleccionado = null;
let tiempoRecarga = 0;
let contadorSoles = 3000;
let marcadorSoles;
let perdiste = false;
let zombieP = null;
let finish = false;
document.addEventListener('DOMContentLoaded', () => {
	marcadorSoles = document.querySelector('.soles');
});
function preload() {
	for (let i = 1; i <= 6; i++) {
		girasol.push(loadImage(`img/plants/girasol/${i}.png`));
	}
	for (let i = 1; i <= 8; i++) {
		lanzaguisantes.push(loadImage(`img/plants/lanzaguisantes/${i}.png`));
	}
	for (let i = 1; i <= 5; i++) {
		repetidora.push(loadImage(`img/plants/repetidora/${i}.png`));
	}
	for (let i = 1; i <= 3; i++) {
		nuez.push(loadImage(`img/plants/nuez/${i}.png`));
	}
	for (let i = 1; i <= 2; i++) {
		patatapum.push(loadImage(`img/plants/patatapum/${i}.png`));
	}

	// zombies
	zombie.walk = loadImage('img/zombies/zombie/walk/1.png');
	zombie.eat = loadImage('img/zombies/zombie/eat/1.png');
	zombieFlag.eat = loadImage('img/zombies/zombieFlag/eat/1.png');
	zombieFlag.walk = loadImage('img/zombies/zombieFlag/walk/1.png');

	for (let i = 1; i <= 3; i++) {
		zombieBucket.walk.push(loadImage(`img/zombies/zombieBucket/walk/${i}.png`));
		zombieBucket.eat.push(loadImage(`img/zombies/zombieBucket/eat/${i}.png`));

		zombieCone.walk.push(loadImage(`img/zombies/zombieCone/walk/${i}.png`));
		zombieCone.eat.push(loadImage(`img/zombies/zombieCone/eat/${i}.png`));
	}

	zombieBucket.walk.push(loadImage(`img/zombies/zombie/walk/1.png`));
	zombieBucket.eat.push(loadImage(`img/zombies/zombie/eat/1.png`));

	zombieCone.walk.push(loadImage(`img/zombies/zombie/walk/1.png`));
	zombieCone.eat.push(loadImage(`img/zombies/zombie/eat/1.png`));

	sol = loadImage('img/sol.png');
	grass1 = loadImage('img/grass1.jpg');
	grass2 = loadImage('img/grass2.jpg');
	floor = loadImage('img/floor.jpg');
	lawnmower = loadImage('img/lawnmower.png');
}

function setup() {
	createCanvas(window.innerWidth - 100, window.innerHeight);
	height_ = height / 5;
	width_ = width / 10;
	for (let i = 0; i < 5; i++) {
		podadoras.push(new Podadora(0, height_ * i + 30));
	}

	generarZombies();
}

function draw() {
	if (finish) {
		fill(0);
		textSize(100);
		text('Haz Ganado', width_ * 4, height_ * 3 - 30);
	} else if (!perdiste) {
		background(0);
		map.draw();

		if (tiempoRecarga > 0) {
			tiempoRecarga--;
		}

		if (frameCount % (60 * 7) == 0) {
			let x = Math.floor(random(width_, width - width_ * 3));
			let y = Math.floor(random(height_ * 2));
			soles.push(new Sol(x, y));
		}

		// Mostrar las plantas y actualizar los proyectiles
		for (let p of plantas) {
			p.detectarZombies(zombies);
			p.actualizarProyectiles(zombies);
			p.mostrar();

			if (p instanceof Girasol) {
				for (let i = p.proyectiles.length - 1; i >= 0; i--) {
					let s = p.proyectiles[i];
					if (millis() - s.tiempoVida >= 15000) {
						p.proyectiles.splice(i, 1);
					}
				}
			}
			if (p.vida <= 0) {
				let index = plantas.indexOf(p);
				map.mapa[p.fila][p.columna] = false;
				plantas.splice(index, 1);
			}
		}
		for (let z of zombies) {
			if (z.x <= 0) {
				perdiste = true;
				z.imgEat = zombie.eat;
				zombieP = z;
			}
			z.mostrar();
			if (!z.colision(plantas)) {
				z.mover();
			}

			if (z.vida <= 0) {
				let index = zombies.indexOf(z);
				zombies.splice(index, 1);
			}
		}

		if (podadoras) {
			for (let po of podadoras) {
				po.mostrar();
				po.colision(zombies);
				if (po.x > width) {
					let index = podadoras.indexOf(po);
					podadoras.splice(index, 1);
				}
			}
		}
		for (let s of soles) {
			s.mostrar();
		}
		marcadorSoles.innerText = contadorSoles;
		actualizarRonda();
		fill(0); // Establece el color del texto a blanco
		textSize(20); // Establece el tamaño del texto a 24
		text('Ronda: ' + nivelActual, width - 200, 100); // Dibuja el texto en la posición (10, 30)
	} else {
		fill(0);
		textSize(100);
		text('Perdiste', width_ * 4, height_ * 3 - 30);
		circle(zombieP.x + width_ / 2, zombieP.y + height_ / 2, width_ * 1.5);
		zombieP.img = zombie.eat;
		zombieP.mostrar();
	}
}

function mouseClicked() {
	if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
		return;
	}
	for (let s of soles) {
		if (s instanceof Sol) {
			if (dist(mouseX, mouseY, s.x, s.y) < 40) {
				let index = soles.indexOf(s);
				contadorSoles += 50;
				soles.splice(index, 1);
				return;
			}
		}
	}
	for (let p of plantas) {
		if (p instanceof Girasol) {
			for (let i = 0; i < p.proyectiles.length; i++) {
				let sol = p.proyectiles[i];
				let distancia = dist(mouseX, mouseY, sol.x + 20, sol.y + 20);
				if (distancia < 20) {
					contadorSoles += 50;
					p.proyectiles.splice(i, 1);
					return;
				}
			}
		}
	}

	if (seleccionado && tiempoRecarga <= 0 && mouseX > width_) {
		let fila = Math.floor(mouseY / height_); // Redondea a la fila más cercana
		let columna = Math.floor(mouseX / width_); // Redondea a la columna más cercana

		// Verificar si ya hay una planta en esta casilla
		if (map.mapa[fila][columna]) {
			return; // No agregar una nueva planta si la casilla ya está ocupada
		}

		let x = columna * width_ + width_ / 2;
		let y = fila * height_ + height_ / 2;
		let planta;
		switch (seleccionado) {
			case 'girasol':
				if (contadorSoles >= 50) {
					planta = new Girasol(
						x,
						y,
						columna,
						fila,
						girasol,
						width_ - 50,
						height_ - 50
					);
					tiempoRecarga = 90;
					contadorSoles -= 50;
					deseleccionar();
				} else {
					deseleccionar();
					return;
				}
				break;
			case 'lanzaguisantes':
				if (contadorSoles >= 100) {
					planta = new Plantas(
						x,
						y,
						columna,
						fila,
						lanzaguisantes,
						width_ - 50,
						height_ - 50
					);
					tiempoRecarga = 60;
					contadorSoles -= 100;
					deseleccionar();
				} else {
					deseleccionar();
					return;
				}
				break;
			case 'repetidora':
				if (contadorSoles >= 200) {
					planta = new Repetidora(
						x,
						y,
						columna,
						fila,
						repetidora,
						width_ - 50,
						height_ - 50
					);
					tiempoRecarga = 90;
					contadorSoles -= 200;
					deseleccionar();
				} else {
					deseleccionar();
					return;
				}
				break;
			case 'patatapum':
				if (contadorSoles >= 25) {
					planta = new Patatapum(
						x,
						y,
						columna,
						fila,
						patatapum,
						width_ - 50,
						height_ - 50
					);
					tiempoRecarga = 90;
					contadorSoles -= 25;
					deseleccionar();
				} else {
					deseleccionar();
					return;
				}
				break;
			case 'nuez':
				if (contadorSoles >= 50) {
					planta = new Nuez(
						x,
						y,
						columna,
						fila,
						nuez,
						width_ - 50,
						height_ - 50
					);
					tiempoRecarga = 90;
					contadorSoles -= 50;
					deseleccionar();
				} else {
					deseleccionar();
					return;
				}
				break;
		}
		plantas.push(planta);
		map.mapa[fila][columna] = true;
	}
}

document.addEventListener('change', (e) => {
	seleccionado = e.target.value;
});

let rondaActual = 0;
let nivelActual = 0;
let contadorZombies = 0;
function generarZombies() {
	// Obtiene el número de zombies para la ronda actual
	let numZombies = nivel[nivelActual][rondaActual];

	function generarZombie() {
		let z = null;
		let fila = Math.floor(random(5)); // Elige una fila aleatoria entre 0 y 4
		if (contadorZombies == 0) {
			z = new Zombie(width, fila * height_, zombieFlag.walk, zombieFlag.eat);
		} else {
			let zRandom = Math.floor(random(10));
			console.log(zRandom);
			if ((zRandom == 1 || zRandom == 2) && nivelActual > 1) {
				z = new ZombieBucket(
					width,
					fila * height_,
					zombieBucket.walk,
					zombieBucket.eat
				);
			} else if (
				(zRandom == 3 || zRandom == 4 || zRandom == 5) &&
				nivelActual > 0
			) {
				z = new ZombieCone(
					width,
					fila * height_,
					zombieCone.walk,
					zombieCone.eat
				);
			} else {
				z = new Zombie(width, fila * height_, zombie.walk, zombie.eat);
			}
		}
		zombies.push(z);
		contadorZombies++;

		if (contadorZombies < numZombies) {
			// Genera un retraso aleatorio
			let retraso = random(3000, 10000); // Cambia este valor para ajustar el rango de retraso
			setTimeout(generarZombie, retraso);
		}
	}

	generarZombie();
}

function actualizarRonda() {
	if (zombies.length === 0) {
		rondaActual++;
		contadorZombies = 0;

		if (rondaActual >= nivel[nivelActual].length) {
			rondaActual = 0;
			nivelActual++;
			let card = document.querySelector(`.hidden${nivelActual}`);
			if (card) {
				card.classList.remove(`hidden${nivelActual}`);
			}
		}

		if (nivelActual >= nivel.length) {
			finish = true;
		} else {
			setTimeout(generarZombies(), 4000);
		}
	}
}

document.addEventListener('DOMContentLoaded', () => {
	let radios = document.querySelectorAll('input[type="radio"]');
	radios.forEach((radio) => {
		radio.addEventListener('change', function () {
			document.querySelectorAll('.plantsContainer div').forEach((card) => {
				card.classList.remove('selected');
			});

			if (this.checked) {
				this.closest('div').classList.add('selected');
			}
		});
	});
});

function deseleccionar() {
	let checkedInput = document.querySelector('input[name="plantas"]:checked');

	checkedInput.closest('div').classList.remove('selected');
	checkedInput.checked = false;
	seleccionado = null;
}
