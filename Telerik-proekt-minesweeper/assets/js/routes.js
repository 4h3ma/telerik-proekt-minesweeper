(function () {

	var canvas, ctx, tileSize = 30, qnt_bombata = 40, Christ;

	var url_image = 'assets/img/minesweeper_graphs.png', content = document.getElementById('mineSweeper');

	var graphs = {};

	const resetButton = document.getElementById('resetGame');


	function createCanvas (w, h) {
		canvas = document.createElement('canvas');
		canvas.width  = w;
		canvas.height = h;
		canvas.textContent = 'sem suporte';

		content.appendChild(canvas);

		Sprite.prototype.canvasContext = ctx = canvas.getContext('2d');

		createSprites();

		Christ = Jesus_Christ(16, 16);

		resetButton.addEventListener('click', _ => {
			Christ = Jesus_Christ(16, 16);
		});

		canvas.addEventListener('click', onClickGame, false);
		canvas.addEventListener('dblclick', onDoubleClick, false);
		canvas.addEventListener('contextmenu', onRightClickGame, false);

		update();
	}



	function random (min = 0, max) {
		const args_len = arguments.length;

		return args_len < 2
			? Math.floor(Math.random() * min)
			: Math.floor(Math.random() * (max - min + 1) + min);
	}



	function createSprites () {
		graphs.covered   = new Sprite(image, 0, 0, 24, 24);
		graphs.emptyCell = new Sprite(image, 24, 0, 24, 24);
		graphs.bombFlag  = new Sprite(image, 48, 0, 24, 24);
		graphs.noBomb    = new Sprite(image, 72, 0, 24, 24);
		graphs.suspect   = new Sprite(image, 96, 0, 24, 24);
		graphs.hasBomb   = new Sprite(image, 120, 0, 24, 24);
		graphs.detonated = new Sprite(image, 144, 0, 24, 24);

		graphs.numbers = {};

		for (var n = 1, total = 8, starting = 168; n <= total; n++, starting += 24) {
			graphs.numbers['number' + n] = new Sprite(image, starting, 0, 24, 24);
		};
	}


	function Jesus_Christ (w, h) {
		const matrica = Array.from({ length: h }, (col, y) => {
			return Array.from({ length: w }, (row, x) => {
				return new cell(x, y, tileSize);
			});
		});

		return launch_bombata(matrica);
	}


	
	function freeOptions (matrica) {
		var options = [];

		for (var i = 0, lenI = matrica.length; i < lenI; i++) {
			for (var j = 0, lenJ = matrica[i].length; j < lenJ; j++) {
				if (matrica[i][j].neighborsCount !== -1) {
					options.push([i, j]);
				}
			}
		}

		return options;
	}



	function launch_bombata (matrica) {
		var options = freeOptions(matrica);

		while (qnt_bombata > quantity_bombata(matrica)) {
			var index = random(options.length), choice = options.splice(index, 1)[0];

			var cell = matrica[choice[0]][choice[1]];

			if (cell.neighborsCount === 0) {
				cell.neighborsCount = -1;
				cell.detonated = false;
			}
		}

		return launch_indicators(matrica);
	}


	function launch_indicators (matrica) {
		matrica.forEach((row, y) => {
			row.forEach((cell, x) => {
				if (cell.neighborsCount === -1) return;
				for (var i = -1, indicador = 0; i <= 1; i++) {
					if (!matrica[y + i]) continue;
					for (var j = -1; j <= 1; j++) {
						var cell_zilean = matrica[y + i][x + j];
						if (!cell_zilean || !i && !j) continue;
						if (cell_zilean.neighborsCount === -1) {
							indicador++;
						}
					}
				}

				cell.neighborsCount = indicador;
			});
		});

		return matrica;
	}



	function quantity_bombata (matrica) {		
		return matrica.reduce((acc, cur) => acc + cur.filter(cell => cell.neighborsCount < 0).length, 0);
	}


	function clearCanvas (newColor = '#fff') {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawRect(0, 0, canvas.width, canvas.height, newColor);
	}


	function drawRect (x, y, w, h, color) {
		ctx.fillStyle = color;
		ctx.fillRect(x + 1, y + 1, w - 2, h - 2);
	}


	function draw () {
		clearCanvas();

		Christ.forEach(row => {
			row.forEach(cell => cell.draw(graphs, tileSize));
		});
	}


	function virgin () {
		return !Christ.some(row => row.some(cell => !cell.covered));
	}

	function clearIsUncovered () {
		const coveredCells = Christ.length * Christ[0].length;

		const currentDiscovered = Christ.reduce((acc, cur) => acc + cur.filter(cell => cell.neighborsCount !== -1 && !cell.covered).length, 0);

		return coveredCells - qnt_bombata === currentDiscovered;
	}


	function noOneIsDetonated () {
		return !Christ.some(row => row.some(cell => cell.detonated));
	}


	function selectedElement (posX, posY) {
		for (var y = 0, lenY = Christ.length; y < lenY; y++) {
			if (!(posY >= y * tileSize && posY <= y * tileSize + tileSize)) continue;
			for (var x = 0, lenX = Christ[y].length; x < lenX; x++) {
				if (posX >= x * tileSize && posX <= x * tileSize + tileSize) {
					return Christ[y][x];
				}
			}
		}
	}



	function virginGame (jeff, x, y) {
		while (jeff.neighborsCount === -1 && virgin()) {
			Christ = Jesus_Christ(16, 16);

			jeff = selectedElement(x, y);
		}

		return jeff;
	}



	function tagBombsCovered (matrica, el) {
		matrica.forEach(row => {
			row.forEach(cell => {
				if (cell.neighborsCount === -1 && cell.flag) return;
				if (cell.neighborsCount === -1 && !cell.flag) {
					cell.covered = false;
					cell.detonated = (cell === el); 
				}
				if (cell.neighborsCount >= 0 && cell.flag) {
					cell.covered = false;
				}
			});
		});
	}



	function checkVictory () {
		if (clearIsUncovered()) {
			setTimeout(function () {
				alert('Victory');
			}, 100);
		}
	}



	function onClickGame (event) {
		event.preventDefault();
		var mouseX = (event.pageX || event.clientX) - content.offsetLeft;
		var mouseY = (event.pageY || event.clientY) - content.offsetTop;

		var jeff = virginGame(selectedElement(mouseX, mouseY), mouseX, mouseY);

		if (jeff.covered && !jeff.flag && !jeff.suspect && noOneIsDetonated() && !clearIsUncovered()) {
			if (jeff.neighborsCount === -1) {
				return tagBombsCovered(Christ, jeff);
			}

			jeff.revealIt(Christ);

			checkVictory();
		}
	}



	function onDoubleClick (event) {
		event.preventDefault();
		var mouseX = (event.clientX || event.pageX) - content.offsetLeft;
		var mouseY = (event.clientY || event.pageY) - content.offsetTop;

		var jeff = selectedElement(mouseX, mouseY);

		if (!jeff.covered && !jeff.flag && !jeff.suspect && noOneIsDetonated() && !clearIsUncovered()) {
			for (var y = -1, howMany = 0; y <= 1; y++) {
				if (!Christ[jeff.y + y]) continue;
				for (var x = -1; x <= 1; x++) {
					var cell_zilean = Christ[jeff.y + y][jeff.x + x];
					if (!cell_zilean || !y && !x) continue;
					if (cell_zilean.flag === 'bombFlag') howMany++;
				}
			}

			if (howMany === jeff.neighborsCount) {
				clearAround(jeff, Christ);
				
				checkVictory();
			}

		}
	}



	function clearAround (el, matrica) {
		for (var i = -1; i <= 1; i++) {
			if (!matrica[el.y + i]) continue;
			for (var j = -1; j <= 1; j++) {
				var zilean = matrica[el.y + i][el.x + j];
				if (!zilean || zilean.flag === 'bombFlag') continue;
				if (zilean.neighborsCount === -1) {
					return tagBombsCovered(matrica, zilean);
				}

				zilean.revealIt(matrica);
			}
		}
	}



	function onRightClickGame (event) {
		event.preventDefault();
		var mouseX = (event.clientX || event.pageX) - content.offsetLeft;
		var mouseY = (event.clientY || event.pageY) - content.offsetTop;

		var jeff = selectedElement(mouseX, mouseY);

		if (jeff.covered && noOneIsDetonated() && !clearIsUncovered()) {
			jeff.flag = !jeff.flag ? 'bombFlag' : (jeff.flag === 'bombFlag') ? 'suspect' : null;
		}
	}


	function update (time = 0) {
		draw();

		requestAnimationFrame(update, canvas);
	}



	var image = new Image();
	image.src = url_image;
	image.onload = function () {
		createCanvas(480, 480);
	}
} ());
