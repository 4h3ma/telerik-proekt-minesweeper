


	class cell {
		constructor (x, y, w) {
			this.x = x;
			this.y = y;
			this.w = w;

			this.flag    = null;
			this.covered = true;

			this.neighborsList  = [];
			this.neighborsCount = 0;
		}

		selectionArea (x, y) {
			var jeff = this;

			return (
				y >= jeff.y * jeff.w && y <= jeff.y * jeff.w + jeff.w && x >= jeff.x * jeff.w && x <= jeff.x * jeff.w + jeff.w
			);
		}

		draw (Sprites, tileSize) {
			let jeff         = this,
			    coordinates = [jeff.x * tileSize, jeff.y * tileSize, tileSize, tileSize];

			if (jeff.covered) {
				let flag = jeff.flag	? Sprites[jeff.flag]	: Sprites.covered;

				return flag.toDraw(...coordinates);
			}

			switch (jeff.neighborsCount) {
				case -1:
					if (jeff.detonated) { /* jeff.detonated ма той гръма ма!!!! */
						return Sprites.detonated.toDraw(...coordinates);
					}

					Sprites.hasBomb.toDraw(...coordinates);
					break;
				case 0:
					if (jeff.flag === 'bombFlag') {
						return Sprites.noBomb.toDraw(...coordinates);
					}

					Sprites.emptyCell.toDraw(...coordinates);
					break;
				case 1:
				case 2:
				case 3:
				case 4:
				case 5:
				case 6:
				case 7:
				case 8:
					if (jeff.flag === 'bombFlag') {
						return Sprites.noBomb.toDraw(...coordinates);
					}

					Sprites.numbers['number' + jeff.neighborsCount].toDraw(...coordinates);
					break;
			}
		}

		revealIt (matrica) {
			this.covered = false;

			if (this.neighborsCount === 0) {
				this.floodFill(matrica);
			}
		}

		floodFill (matrica) {
			var jeff = this;

			for (var i = -1; i <= 1; i++) {
				if (!matrica[jeff.y + i]) continue;
				for (var j = -1; j <= 1; j++) {
					var cell = matrica[jeff.y + i][jeff.x + j];
					if (!cell || !i && !j) continue;
					if (cell.neighborsCount >= 0 && cell.covered) {
						cell.revealIt(matrica);
					}
				}
			}
		}
	}


