<script lang="ts">
	import type { Letter, GameMode, WordPath } from '$lib/stores/gameStore';

	export let grid: (Letter | null)[][];
	export let activeLetter: Letter | null;
	export let gameMode: GameMode;
	export let isGameOver: boolean;
	export let foundWordPath: WordPath | null;

	const CELL_SIZE = 28;

	function getCellClass(cell: Letter | null, x: number, y: number): string {
		let classes = 'cell';
		
		if (cell) {
			classes += ' filled';
			if (cell.isPartOfWord) {
				classes += ' found-word';
			}
		}
		
		if (activeLetter && activeLetter.x === x && activeLetter.y === y) {
			classes += ' active';
		}
		
		return classes;
	}

	function getCellStyle(cell: Letter | null): string {
		if (!cell) return '';
		
		let style = `background-color: ${cell.color};`;
		
		if (cell.isPartOfWord) {
			style += ' border: 2px solid #ffd700; box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);';
		}
		
		return style;
	}
</script>

<div class="game-board-wrapper">
	<div class="game-board" style="width: {grid[0]?.length * CELL_SIZE}px; height: {grid.length * CELL_SIZE}px;">
		{#if isGameOver}
			<div class="game-over-overlay">
				<div class="game-over-text">
					<h2>🙏 Blessed are those who...</h2>
					<p>seek the Word!</p>
				</div>
			</div>
		{/if}

		<!-- Grid cells -->
		{#each grid as row, y}
			{#each row as cell, x}
				<div 
					class={getCellClass(cell, x, y)}
					style="
						left: {x * CELL_SIZE}px; 
						top: {y * CELL_SIZE}px; 
						width: {CELL_SIZE}px; 
						height: {CELL_SIZE}px;
						{getCellStyle(cell)}
					"
				>
					{#if cell}
						<span class="letter">{cell.char}</span>
					{/if}
				</div>
			{/each}
		{/each}

		<!-- Active falling letter -->
		{#if activeLetter}
			<div 
				class="cell active falling"
				style="
					left: {activeLetter.x * CELL_SIZE}px; 
					top: {activeLetter.y * CELL_SIZE}px; 
					width: {CELL_SIZE}px; 
					height: {CELL_SIZE}px;
					background-color: {activeLetter.color};
					animation: glow 1s ease-in-out infinite alternate;
				"
			>
				<span class="letter">{activeLetter.char}</span>
			</div>
		{/if}

		<!-- Word path highlighting (for word search mode) -->
		{#if foundWordPath && foundWordPath.isHighlighted}
			{#each foundWordPath.letters as pos, i}
				<div 
					class="word-path-highlight"
					style="
						left: {pos.x * CELL_SIZE}px; 
						top: {pos.y * CELL_SIZE}px; 
						width: {CELL_SIZE}px; 
						height: {CELL_SIZE}px;
						animation-delay: {i * 0.1}s;
					"
				/>
			{/each}
		{/if}
	</div>

	<!-- Game mode indicator -->
	<div class="mode-indicator">
		<div class="mode-badge {gameMode}">
			{#if gameMode === 'standard'}
				🧩 Tetris Mode
			{:else}
				🔍 Word Search Mode
			{/if}
		</div>
	</div>
</div>

<style>
	.game-board-wrapper {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.game-board {
		position: relative;
		background: rgba(0, 0, 0, 0.3);
		border: 3px solid rgba(255, 255, 255, 0.3);
		border-radius: 10px;
		box-shadow: 
			0 0 20px rgba(0, 0, 0, 0.5),
			inset 0 0 20px rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(5px);
		overflow: hidden;
	}

	.cell {
		position: absolute;
		border: 1px solid rgba(255, 255, 255, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		font-size: 14px;
		font-family: 'Arial', sans-serif;
		transition: all 0.2s ease;
		box-sizing: border-box;
	}

	.cell.filled {
		border: 1px solid rgba(255, 255, 255, 0.3);
		box-shadow: 
			inset 0 1px 3px rgba(255, 255, 255, 0.3),
			0 1px 3px rgba(0, 0, 0, 0.3);
	}

	.cell.active {
		border: 2px solid #fff;
		box-shadow: 
			0 0 15px rgba(255, 255, 255, 0.8),
			inset 0 1px 3px rgba(255, 255, 255, 0.3);
		z-index: 10;
	}

	.cell.falling {
		transform: scale(1.05);
	}

	.cell.found-word {
		border: 2px solid #ffd700 !important;
		box-shadow: 
			0 0 15px rgba(255, 215, 0, 0.8),
			inset 0 1px 3px rgba(255, 215, 0, 0.3) !important;
		animation: foundWord 0.6s ease-in-out;
	}

	.letter {
		color: white;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
		font-size: 12px;
		font-weight: bold;
		user-select: none;
	}

	.word-path-highlight {
		position: absolute;
		border: 3px solid #ffd700;
		border-radius: 4px;
		background: rgba(255, 215, 0, 0.2);
		animation: pathHighlight 0.8s ease-in-out;
		pointer-events: none;
		z-index: 5;
	}

	.game-over-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.8);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
		border-radius: 7px;
	}

	.game-over-text {
		text-align: center;
		color: white;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
	}

	.game-over-text h2 {
		margin: 0;
		font-size: 1.5rem;
		color: #ffd700;
	}

	.game-over-text p {
		margin: 0.5rem 0 0 0;
		font-size: 1.1rem;
		opacity: 0.9;
	}

	.mode-indicator {
		display: flex;
		justify-content: center;
	}

	.mode-badge {
		padding: 0.5rem 1rem;
		border-radius: 20px;
		font-size: 0.9rem;
		font-weight: bold;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
		border: 2px solid rgba(255, 255, 255, 0.3);
		backdrop-filter: blur(5px);
	}

	.mode-badge.standard {
		background: linear-gradient(45deg, #667eea, #764ba2);
		color: white;
	}

	.mode-badge.wordSearch {
		background: linear-gradient(45deg, #f093fb, #f5576c);
		color: white;
	}

	@keyframes glow {
		from {
			box-shadow: 
				0 0 10px rgba(255, 255, 255, 0.5),
				inset 0 1px 3px rgba(255, 255, 255, 0.3);
		}
		to {
			box-shadow: 
				0 0 20px rgba(255, 255, 255, 0.8),
				inset 0 1px 3px rgba(255, 255, 255, 0.5);
		}
	}

	@keyframes foundWord {
		0% { transform: scale(1); }
		50% { transform: scale(1.1); }
		100% { transform: scale(1); }
	}

	@keyframes pathHighlight {
		0% {
			opacity: 0;
			transform: scale(0.8);
		}
		50% {
			opacity: 1;
			transform: scale(1.1);
		}
		100% {
			opacity: 0.7;
			transform: scale(1);
		}
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.game-board {
			transform: scale(0.8);
			transform-origin: center;
		}
		
		.mode-badge {
			font-size: 0.8rem;
			padding: 0.4rem 0.8rem;
		}
	}
</style>