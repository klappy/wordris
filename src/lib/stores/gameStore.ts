import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type GameMode = 'standard' | 'wordSearch';

export interface Letter {
	id: string;
	char: string;
	x: number;
	y: number;
	color: string;
	isActive: boolean;
	isPartOfWord?: boolean;
}

export interface WordPath {
	letters: { x: number; y: number }[];
	word: string;
	isHighlighted: boolean;
}

export interface GameState {
	grid: (Letter | null)[][];
	activeLetter: Letter | null;
	score: number;
	level: number;
	linesCleared: number;
	highScore: number;
	foundWords: string[];
	gameMode: GameMode;
	isGamePaused: boolean;
	isGameOver: boolean;
	fallSpeed: number;
	lastFallTime: number;
	foundWordPath: WordPath | null;
	gridWidth: number;
	gridHeight: number;
	currentWordBank: string[];
}

const GRID_WIDTH = 12;
const GRID_HEIGHT = 20;
const FALL_SPEEDS = [800, 600, 400, 300, 200, 150, 100, 80, 60, 50]; // milliseconds per fall

// Letter colors for visual variety
const LETTER_COLORS = [
	'#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
	'#DDA0DD', '#F4A261', '#E76F51', '#2A9D8F', '#E63946'
];

function createInitialState(): GameState {
	return {
		grid: Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill(null)),
		activeLetter: null,
		score: 0,
		level: 1,
		linesCleared: 0,
		highScore: browser ? parseInt(localStorage.getItem('wordris-high-score') || '0') : 0,
		foundWords: [],
		gameMode: 'standard',
		isGamePaused: false,
		isGameOver: false,
		fallSpeed: FALL_SPEEDS[0],
		lastFallTime: 0,
		foundWordPath: null,
		gridWidth: GRID_WIDTH,
		gridHeight: GRID_HEIGHT,
		currentWordBank: []
	};
}

function createGameStore() {
	const { subscribe, set, update } = writable<GameState>(createInitialState());

	// Available letters with biblical emphasis on meaningful words
	const getRandomLetter = (): string => {
		const commonBiblicalLetters = 'AEIOULNRTSDGMHBCFPYWKVJQXZ';
		const weights = [12,10,8,6,8,6,6,6,6,4,6,4,4,4,3,3,3,2,2,2,1,1,1,1,1,1]; // Higher weight for vowels and common consonants
		
		let totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
		let random = Math.random() * totalWeight;
		
		for (let i = 0; i < commonBiblicalLetters.length; i++) {
			random -= weights[i];
			if (random <= 0) {
				return commonBiblicalLetters[i];
			}
		}
		return 'A'; // fallback
	};

	const generateNewLetter = (currentTime: number): Letter => {
		const x = Math.floor(Math.random() * GRID_WIDTH);
		return {
			id: `letter-${currentTime}-${Math.random()}`,
			char: getRandomLetter(),
			x,
			y: 0,
			color: LETTER_COLORS[Math.floor(Math.random() * LETTER_COLORS.length)],
			isActive: true
		};
	};

	const canMoveTo = (grid: (Letter | null)[][], letter: Letter, newX: number, newY: number): boolean => {
		if (newX < 0 || newX >= GRID_WIDTH || newY >= GRID_HEIGHT) {
			return false;
		}
		if (newY < 0) {
			return true; // Allow moving up temporarily
		}
		return grid[newY][newX] === null;
	};

	const placeLetter = (grid: (Letter | null)[][], letter: Letter) => {
		if (letter.y >= 0 && letter.y < GRID_HEIGHT && letter.x >= 0 && letter.x < GRID_WIDTH) {
			grid[letter.y][letter.x] = { ...letter, isActive: false };
		}
	};

	const checkForWords = (grid: (Letter | null)[][], wordBank: string[]): { foundWords: string[], clearedPositions: {x: number, y: number}[] } => {
		const foundWords: string[] = [];
		const clearedPositions: {x: number, y: number}[] = [];
		
		// Check all directions: horizontal, vertical, and diagonal
		const directions = [
			{dx: 1, dy: 0}, {dx: -1, dy: 0}, // horizontal
			{dx: 0, dy: 1}, {dx: 0, dy: -1}, // vertical
			{dx: 1, dy: 1}, {dx: -1, dy: -1}, // diagonal
			{dx: 1, dy: -1}, {dx: -1, dy: 1}  // anti-diagonal
		];

		for (const word of wordBank) {
			if (foundWords.includes(word)) continue;

			for (let startY = 0; startY < GRID_HEIGHT; startY++) {
				for (let startX = 0; startX < GRID_WIDTH; startX++) {
					for (const {dx, dy} of directions) {
						if (checkWordAtPosition(grid, word, startX, startY, dx, dy)) {
							foundWords.push(word);
							
							// Mark positions for clearing (only in standard mode)
							for (let i = 0; i < word.length; i++) {
								const x = startX + i * dx;
								const y = startY + i * dy;
								clearedPositions.push({x, y});
							}
							break;
						}
					}
					if (foundWords.includes(word)) break;
				}
				if (foundWords.includes(word)) break;
			}
		}

		return { foundWords, clearedPositions };
	};

	const checkWordAtPosition = (grid: (Letter | null)[][], word: string, startX: number, startY: number, dx: number, dy: number): boolean => {
		for (let i = 0; i < word.length; i++) {
			const x = startX + i * dx;
			const y = startY + i * dy;
			
			if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT) {
				return false;
			}
			
			const cell = grid[y][x];
			if (!cell || cell.char !== word[i]) {
				return false;
			}
		}
		return true;
	};

	const clearLines = (grid: (Letter | null)[][]): number => {
		let linesCleared = 0;
		
		for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
			if (grid[y].every(cell => cell !== null)) {
				// Remove the line
				grid.splice(y, 1);
				// Add empty line at top
				grid.unshift(Array(GRID_WIDTH).fill(null));
				linesCleared++;
				y++; // Check the same line again
			}
		}
		
		return linesCleared;
	};

	const applyGravity = (grid: (Letter | null)[][]) => {
		// Make letters fall down to fill empty spaces
		for (let x = 0; x < GRID_WIDTH; x++) {
			const column = [];
			for (let y = 0; y < GRID_HEIGHT; y++) {
				if (grid[y][x] !== null) {
					column.push(grid[y][x]);
					grid[y][x] = null;
				}
			}
			
			// Place letters at bottom
			for (let i = column.length - 1; i >= 0; i--) {
				grid[GRID_HEIGHT - (column.length - i)][x] = column[i];
			}
		}
	};

	return {
		subscribe,
		
		initializeGame: () => {
			set(createInitialState());
		},

		update: () => {
			update(state => {
				if (state.isGamePaused || state.isGameOver) return state;

				const currentTime = Date.now();
				
				if (!state.activeLetter) {
					// Generate new letter
					state.activeLetter = generateNewLetter(currentTime);
					state.lastFallTime = currentTime;
				} else if (currentTime - state.lastFallTime > state.fallSpeed) {
					// Move active letter down
					const newY = state.activeLetter.y + 1;
					
					if (canMoveTo(state.grid, state.activeLetter, state.activeLetter.x, newY)) {
						state.activeLetter.y = newY;
					} else {
						// Letter has landed
						if (state.activeLetter.y <= 0) {
							// Game over - letter couldn't be placed
							state.isGameOver = true;
							return state;
						}
						
						placeLetter(state.grid, state.activeLetter);
						state.activeLetter = null;
						
						// Check for words (this will be passed from the component)
						// For now using placeholder, will be updated by component
						const wordBank = state.currentWordBank || ['GOD', 'LOVE', 'FAITH', 'HOPE', 'PEACE'];
						const { foundWords, clearedPositions } = checkForWords(state.grid, wordBank);
						
						if (foundWords.length > 0) {
							state.foundWords = [...state.foundWords, ...foundWords];
							state.score += foundWords.reduce((sum, word) => sum + word.length * 100, 0);
							
							// Clear letters based on game mode
							if (state.gameMode === 'standard') {
								// Remove found word letters and apply gravity
								clearedPositions.forEach(pos => {
									state.grid[pos.y][pos.x] = null;
								});
								applyGravity(state.grid);
							} else {
								// Word search mode - just highlight
								clearedPositions.forEach(pos => {
									if (state.grid[pos.y][pos.x]) {
										state.grid[pos.y][pos.x]!.isPartOfWord = true;
									}
								});
							}
						}
						
						// Clear full lines (Tetris-style)
						const linesCleared = clearLines(state.grid);
						if (linesCleared > 0) {
							state.linesCleared += linesCleared;
							state.score += linesCleared * 1000;
							
							// Level up every 10 lines
							state.level = Math.floor(state.linesCleared / 10) + 1;
							state.fallSpeed = FALL_SPEEDS[Math.min(state.level - 1, FALL_SPEEDS.length - 1)];
						}
					}
					
					state.lastFallTime = currentTime;
				}

				// Update high score
				if (state.score > state.highScore) {
					state.highScore = state.score;
					if (browser) {
						localStorage.setItem('wordris-high-score', state.highScore.toString());
					}
				}

				return state;
			});
		},

		moveActiveLetter: (direction: 'left' | 'right' | 'down') => {
			update(state => {
				if (!state.activeLetter || state.isGamePaused || state.isGameOver) return state;

				console.log('Moving active letter:', direction, 'from position:', state.activeLetter.x, state.activeLetter.y);

				let newX = state.activeLetter.x;
				let newY = state.activeLetter.y;

				switch (direction) {
					case 'left':
						newX -= 1;
						break;
					case 'right':
						newX += 1;
						break;
					case 'down':
						newY += 1;
						break;
				}

				if (canMoveTo(state.grid, state.activeLetter, newX, newY)) {
					state.activeLetter.x = newX;
					state.activeLetter.y = newY;
					console.log('Moved to:', newX, newY);
				} else {
					console.log('Cannot move to:', newX, newY);
				}

				return state;
			});
		},

		dropActiveLetter: () => {
			update(state => {
				if (!state.activeLetter || state.isGamePaused || state.isGameOver) return state;

				console.log('Dropping active letter from:', state.activeLetter.x, state.activeLetter.y);

				// Drop the letter to the lowest possible position
				let newY = state.activeLetter.y;
				while (canMoveTo(state.grid, state.activeLetter, state.activeLetter.x, newY + 1)) {
					newY++;
				}
				state.activeLetter.y = newY;
				state.lastFallTime = 0; // Force immediate placement

				console.log('Dropped to:', state.activeLetter.x, newY);

				return state;
			});
		},

		setGameMode: (mode: GameMode) => {
			update(state => {
				state.gameMode = mode;
				// Reset found words when changing modes
				state.foundWords = [];
				// Clear any highlighting
				state.grid.forEach(row => {
					row.forEach(cell => {
						if (cell) {
							cell.isPartOfWord = false;
						}
					});
				});
				return state;
			});
		},

		togglePause: () => {
			update(state => {
				state.isGamePaused = !state.isGamePaused;
				return state;
			});
		},

		restartGame: () => {
			set(createInitialState());
		},

		updateWordBank: (wordBank: string[]) => {
			update(state => {
				state.currentWordBank = wordBank;
				return state;
			});
		}
	};
}

export const gameStore = createGameStore();