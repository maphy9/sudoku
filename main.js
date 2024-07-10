'use strict';

const validateMatrix = (matrix) => {
	if (matrix.length != 9) {
		return false;
	}
	for (const row of matrix) {
		if (row.length != 9) {
			return false;
		}
		for (const el of row) {
			if (el < 0 || el > 9) {
				return false;
			}
		}
	}
	return true;
}

const getNextIndex = (x, y) => {
	if (x == 8) {
		if (y == 8) {
			return [-1, -1];
		}
		return [0, y + 1];
	}
	return [x + 1, y];
}

const checkRow = (matrix, row) => {
	const arr = Array(9).fill(0);
	for (const el of matrix[row]) {
		if (el == 0) {
			continue;
		}
		const index = el - 1;
		if (arr[index] == 1) {
			return false;
		}
		arr[index] = 1;
	}
	return true;
}

const checkCol = (matrix, col) => {
	const arr = Array(9).fill(0);
	for (let row = 0; row < 9; row++) {
		const index = matrix[row][col] - 1;
		if (index < 0) {
			continue;
		}
		if (arr[index] == 1) {
			return false;
		}
		arr[index] = 1;
	}
	return true;
}

const checkGrid = (matrix, x, y) => {
	const arr = Array(9).fill(0);
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			const index = matrix[i + y][j + x] - 1;
			if (index < 0) {
				continue;
			}
			if (arr[index] == 1) {
				return false;
			}
			arr[index] = 1;
		}
	}
	return true;
}

const isValidSudoku = (matrix, x, y) => {
	if (!checkRow(matrix, y) || !checkCol(matrix, x)) {
		return false;
	}
	const new_x = x - (x % 3);
	const new_y = y - (y % 3);
	return checkGrid(matrix, new_x, new_y);
}

const pickNumber = (matrix, x, y) => {
	for (let i = matrix[y][x] + 1; i <= 9; i++) {
		matrix[y][x] = i;
		if (isValidSudoku(matrix, x, y)) {
			let [a, b] = getNextIndex(x, y);
			while (a != -1 && matrix[b][a] != 0) {
				[a, b] = getNextIndex(a, b);
			}
			if (a == -1) {
				return true;
			}
			const res = pickNumber(matrix, a, b);
			if (res) {
				return true;
			}
		}
	}
	matrix[y][x] = 0;
	return false;
}


const solveSudoku = (matrix) => {
	let [x, y] = [0, 0];
	while (x != -1 && matrix[y][x] != 0) {
		[x, y] = getNextIndex(x, y);
	}
	if (x == -1) {
		return;
	}
	return pickNumber(matrix, x, y);
}


const table = document.getElementById('table');
for (let i = 0; i < 81; i++) {
	table.innerHTML += `<input type="text" placeholder="0" class="field"></input>`;
}
const fields = Array.from(document.getElementsByClassName('field'));
const submit = document.getElementById('submit');
const clear = document.getElementById('clear');
const err = document.getElementById('error');

const fillTable = (matrix) => {
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			const field = fields[i * 9 + j];
			field.value = matrix[i][j];
		}
	}
}

const clearTable = () => {
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			const field = fields[i * 9 + j];
			field.value = '';
		}
	}
}

const handleClick = (e) => {
	e.preventDefault();
	const matrix = [];
	for (let i = 0; i < 9; i++) {
		const row = [];
		for (let j = 0; j < 9; j++) {
			const field = fields[i * 9 + j];
			if (field.value.length == 0) {
				row.push(0);
			} else {
				if (isNaN(field.value)) {
					error.innerText = 'Invalid SUDOKU matrix';
					return;
				}
				row.push(parseInt(field.value));
			}
		}
		matrix.push(row);
	}
	console.dir({ matrix });
	if (!validateMatrix(matrix)) {
		error.innerText = 'Invalid SUDOKU matrix';
		return;
	}
	if (!solveSudoku(matrix)) {
		error.innerText = 'Couldn\'t solve the matrix';
		return;
	}
	fillTable(matrix);
}

submit.addEventListener('click', handleClick);
clear.addEventListener('click', clearTable);
