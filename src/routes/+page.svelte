<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import GameBoard from '$lib/components/GameBoard.svelte';
	import WordBank from '$lib/components/WordBank.svelte';
	import ScoreDisplay from '$lib/components/ScoreDisplay.svelte';
	import VerseDisplay from '$lib/components/VerseDisplay.svelte';
	import GameControls from '$lib/components/GameControls.svelte';
	import { gameStore, type GameMode } from '$lib/stores/gameStore';
	import { bibleVerseStore } from '$lib/stores/bibleVerseStore';

	let gameLoop: number;
	let gameState = gameStore;
	let verseState = bibleVerseStore;

	onMount(() => {
		// Initialize the game
		gameStore.initializeGame();
		bibleVerseStore.fetchNewVerse();
		
		// Start the game loop
		startGameLoop();
	});

	// Update game word bank when verse changes
	$: if ($verseState.wordBank.length > 0) {
		gameStore.updateWordBank($verseState.wordBank);
	}

	onDestroy(() => {
		if (gameLoop) {
			cancelAnimationFrame(gameLoop);
		}
	});

	function startGameLoop() {
		const loop = () => {
			gameStore.update();
			gameLoop = requestAnimationFrame(loop);
		};
		gameLoop = requestAnimationFrame(loop);
	}

	function handleGameModeChange(mode: GameMode) {
		gameStore.setGameMode(mode);
	}

	function handleKeyPress(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowLeft':
				event.preventDefault();
				gameStore.moveActiveLetter('left');
				break;
			case 'ArrowRight':
				event.preventDefault();
				gameStore.moveActiveLetter('right');
				break;
			case 'ArrowDown':
				event.preventDefault();
				gameStore.moveActiveLetter('down');
				break;
			case ' ':
				event.preventDefault();
				gameStore.dropActiveLetter();
				break;
			case 'r':
			case 'R':
				event.preventDefault();
				gameStore.restartGame();
				bibleVerseStore.fetchNewVerse();
				break;
			case 'p':
			case 'P':
				event.preventDefault();
				gameStore.togglePause();
				break;
		}
	}
</script>

<svelte:window on:keydown={handleKeyPress} />

<main class="game-container">
	<header class="game-header">
		<h1>📖 Biblical Word Tetris</h1>
		<p>Form words from Bible verses as letters fall from heaven!</p>
	</header>

	<div class="game-layout">
		<!-- Left Panel: Verse & Word Bank -->
		<aside class="left-panel">
			<VerseDisplay verse={$verseState} />
			<WordBank 
				words={$verseState.wordBank} 
				foundWords={$gameState.foundWords}
				difficulty={$verseState.currentDifficulty}
			/>
		</aside>

		<!-- Center: Game Board -->
		<section class="game-board-container">
			<GameBoard 
				grid={$gameState.grid}
				activeLetter={$gameState.activeLetter}
				gameMode={$gameState.gameMode}
				isGameOver={$gameState.isGameOver}
				foundWordPath={$gameState.foundWordPath}
			/>
		</section>

		<!-- Right Panel: Score & Controls -->
		<aside class="right-panel">
			<ScoreDisplay 
				score={$gameState.score}
				level={$gameState.level}
				linesCleared={$gameState.linesCleared}
				highScore={$gameState.highScore}
			/>
			
			<GameControls 
				gameMode={$gameState.gameMode}
				isGamePaused={$gameState.isGamePaused}
				isGameOver={$gameState.isGameOver}
				on:modeChange={(e) => handleGameModeChange(e.detail)}
				on:pause={() => gameStore.togglePause()}
				on:restart={() => {
					gameStore.restartGame();
					bibleVerseStore.fetchNewVerse();
				}}
				on:newVerse={() => bibleVerseStore.fetchNewVerse()}
				on:move={(e) => gameStore.moveActiveLetter(e.detail)}
				on:drop={() => gameStore.dropActiveLetter()}
			/>

			<!-- Game Instructions -->
			<div class="instructions">
				<h3>🎮 How to Play</h3>
				<ul>
					<li><strong>Arrow Keys:</strong> Move letters</li>
					<li><strong>Spacebar:</strong> Drop letter instantly</li>
					<li><strong>R:</strong> Restart game</li>
				</ul>
				<p><strong>Goal:</strong> Form words from the Bible verse as letters fall!</p>
			</div>
		</aside>
	</div>

	{#if $gameState.isGameOver}
		<div class="game-over-overlay">
			<div class="game-over-modal">
				<h2>🙏 Game Over</h2>
				<p>"Faith comes by hearing, and hearing by the word of God"</p>
				<p><strong>Final Score:</strong> {$gameState.score}</p>
				<p><strong>Words Found:</strong> {$gameState.foundWords.length}</p>
				<button on:click={() => {
					gameStore.restartGame();
					bibleVerseStore.fetchNewVerse();
				}}>
					Play Again
				</button>
			</div>
		</div>
	{/if}
</main>

<style>
	.game-container {
		height: 100vh;
		display: flex;
		flex-direction: column;
		color: white;
		overflow: hidden;
	}

	.game-header {
		text-align: center;
		padding: 1rem;
		background: rgba(0, 0, 0, 0.2);
		backdrop-filter: blur(10px);
	}

	.game-header h1 {
		margin: 0;
		font-size: 2rem;
		font-weight: bold;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
	}

	.game-header p {
		margin: 0.5rem 0 0 0;
		opacity: 0.9;
	}

	.game-layout {
		display: grid;
		grid-template-columns: 300px 1fr 300px;
		gap: 1rem;
		flex: 1;
		padding: 1rem;
		min-height: 0;
	}

	.left-panel, .right-panel {
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		border-radius: 15px;
		padding: 1rem;
		overflow-y: auto;
	}

	.game-board-container {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.instructions {
		margin-top: 2rem;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 10px;
	}

	.instructions h3 {
		margin-top: 0;
		color: #ffd700;
	}

	.instructions ul {
		padding-left: 1rem;
		margin: 0.5rem 0;
	}

	.instructions li {
		margin: 0.25rem 0;
		font-size: 0.9rem;
	}

	.game-over-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.8);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	.game-over-modal {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		padding: 2rem;
		border-radius: 20px;
		text-align: center;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
		border: 2px solid rgba(255, 255, 255, 0.2);
	}

	.game-over-modal h2 {
		margin-top: 0;
		color: #ffd700;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
	}

	.game-over-modal button {
		background: #ffd700;
		color: #333;
		border: none;
		padding: 1rem 2rem;
		border-radius: 25px;
		font-size: 1.1rem;
		font-weight: bold;
		cursor: pointer;
		margin-top: 1rem;
		transition: transform 0.2s;
	}

	.game-over-modal button:hover {
		transform: scale(1.05);
	}

	/* Responsive Design */
	@media (max-width: 1200px) {
		.game-layout {
			grid-template-columns: 250px 1fr 250px;
		}
	}

	@media (max-width: 768px) {
		.game-layout {
			grid-template-columns: 1fr;
			grid-template-rows: auto 1fr auto;
		}
		
		.left-panel, .right-panel {
			max-height: 200px;
		}
	}
</style>
