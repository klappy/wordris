<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import GameBoard from '$lib/components/GameBoard.svelte';
	import WordBank from '$lib/components/WordBank.svelte';
	import ScoreDisplay from '$lib/components/ScoreDisplay.svelte';
	import VerseDisplay from '$lib/components/VerseDisplay.svelte';
	import GameControls from '$lib/components/GameControls.svelte';
	import MobileControls from '$lib/components/MobileControls.svelte';
	import ServiceWorkerRegister from '$lib/components/ServiceWorkerRegister.svelte';
	import { gameStore, type GameMode } from '$lib/stores/gameStore';
	import { bibleVerseStore } from '$lib/stores/bibleVerseStore';

	let gameLoop: number;
	let gameState = gameStore;
	let verseState = bibleVerseStore;
	let isMobile = false;
	let showWordBank = false;
	let showInstructions = false;

	onMount(() => {
		// Initialize the game
		gameStore.initializeGame();
		bibleVerseStore.fetchNewVerse();
		
		// Check if mobile
		isMobile = window.innerWidth <= 768;
		
		// Start the game loop
		startGameLoop();
		
		// Handle window resize
		const handleResize = () => {
			isMobile = window.innerWidth <= 768;
		};
		window.addEventListener('resize', handleResize);
		
		return () => {
			window.removeEventListener('resize', handleResize);
		};
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
		if (isMobile) return; // Disable keyboard controls on mobile
		
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

<ServiceWorkerRegister />

<main class="game-container">
	<header class="game-header">
		<h1>📖 {isMobile ? 'Wordris' : 'Biblical Word Tetris'}</h1>
		{#if !isMobile}
			<p>Form words from Bible verses as letters fall from heaven!</p>
		{/if}
		
		{#if isMobile}
			<div class="mobile-header-buttons">
				<button 
					class="header-btn" 
					class:active={showWordBank}
					on:click={() => showWordBank = !showWordBank}
				>
					📖 Words
				</button>
				<button 
					class="header-btn" 
					class:active={showInstructions}
					on:click={() => showInstructions = !showInstructions}
				>
					❓ Help
				</button>
			</div>
		{/if}
	</header>

	<div class="game-layout" class:mobile={isMobile}>
		{#if !isMobile}
			<!-- Desktop Layout -->
			<aside class="left-panel">
				<VerseDisplay verse={$verseState} />
				<WordBank 
					words={$verseState.wordBank} 
					foundWords={$gameState.foundWords}
					difficulty={$verseState.currentDifficulty}
				/>
			</aside>

			<section class="game-board-container">
				<GameBoard 
					grid={$gameState.grid}
					activeLetter={$gameState.activeLetter}
					gameMode={$gameState.gameMode}
					isGameOver={$gameState.isGameOver}
					foundWordPath={$gameState.foundWordPath}
				/>
			</section>

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
		{:else}
			<!-- Mobile Layout -->
			<div class="mobile-top-info">
				<div class="mobile-score-row">
					<div class="score-item">
						<span class="score-label">Score:</span>
						<span class="score-value">{$gameState.score}</span>
					</div>
					<div class="score-item">
						<span class="score-label">Level:</span>
						<span class="score-value">{$gameState.level}</span>
					</div>
					<div class="score-item">
						<span class="score-label">Found:</span>
						<span class="score-value">{$gameState.foundWords.length}</span>
					</div>
				</div>
				
				<div class="mobile-controls-row">
					<button 
						class="mobile-game-btn pause-btn"
						on:click={() => gameStore.togglePause()}
					>
						{$gameState.isGamePaused ? '▶️' : '⏸️'}
					</button>
					
					<button 
						class="mobile-game-btn mode-btn"
						on:click={() => handleGameModeChange($gameState.gameMode === 'standard' ? 'wordSearch' : 'standard')}
					>
						{$gameState.gameMode === 'standard' ? '🎯' : '🔍'}
					</button>
					
					<button 
						class="mobile-game-btn restart-btn"
						on:click={() => {
							gameStore.restartGame();
							bibleVerseStore.fetchNewVerse();
						}}
					>
						🔄
					</button>
				</div>
			</div>

			<section class="mobile-game-board">
				<GameBoard 
					grid={$gameState.grid}
					activeLetter={$gameState.activeLetter}
					gameMode={$gameState.gameMode}
					isGameOver={$gameState.isGameOver}
					foundWordPath={$gameState.foundWordPath}
				/>
			</section>

			<div class="mobile-bottom-controls">
				<MobileControls 
					on:move={(e) => gameStore.moveActiveLetter(e.detail)}
					on:drop={() => gameStore.dropActiveLetter()}
				/>
			</div>
		{/if}
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

	{#if isMobile && showWordBank}
		<div class="mobile-overlay" on:click={() => showWordBank = false}>
			<div class="mobile-panel" on:click|stopPropagation>
				<div class="mobile-panel-header">
					<h3>📖 Bible Verse & Words</h3>
					<button class="close-btn" on:click={() => showWordBank = false}>✕</button>
				</div>
				<div class="mobile-panel-content">
					<VerseDisplay verse={$verseState} />
					<WordBank 
						words={$verseState.wordBank} 
						foundWords={$gameState.foundWords}
						difficulty={$verseState.currentDifficulty}
					/>
				</div>
			</div>
		</div>
	{/if}

	{#if isMobile && showInstructions}
		<div class="mobile-overlay" on:click={() => showInstructions = false}>
			<div class="mobile-panel" on:click|stopPropagation>
				<div class="mobile-panel-header">
					<h3>🎮 How to Play</h3>
					<button class="close-btn" on:click={() => showInstructions = false}>✕</button>
				</div>
				<div class="mobile-panel-content">
					<div class="instructions">
						<ul>
							<li><strong>Touch Controls:</strong> Use the buttons below the game</li>
							<li><strong>⬅️ ➡️:</strong> Move letters left/right</li>
							<li><strong>⬇️ DROP:</strong> Drop letter instantly</li>
							<li><strong>Soft Drop:</strong> Move letter down slowly</li>
							<li><strong>🎯/🔍:</strong> Switch between Tetris/Word Search mode</li>
						</ul>
						<p><strong>Goal:</strong> Form words from the Bible verse as letters fall from heaven!</p>
						<p><strong>Scoring:</strong> Longer words = more points!</p>
					</div>
				</div>
			</div>
		</div>
	{/if}
</main>

<style>
	.game-container {
		height: 100vh;
		height: 100dvh; /* Dynamic viewport height for mobile */
		display: flex;
		flex-direction: column;
		color: white;
		overflow: hidden;
		position: relative;
	}

	.game-header {
		text-align: center;
		padding: 0.5rem 1rem;
		background: rgba(0, 0, 0, 0.2);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.game-header h1 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: bold;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
	}

	.game-header p {
		margin: 0.25rem 0 0 0;
		opacity: 0.9;
		font-size: 0.9rem;
	}

	.mobile-header-buttons {
		display: flex;
		gap: 0.5rem;
		justify-content: center;
		margin-top: 0.5rem;
	}

	.header-btn {
		background: rgba(255, 255, 255, 0.1);
		color: white;
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 8px;
		padding: 0.5rem 1rem;
		font-size: 0.8rem;
		cursor: pointer;
		transition: all 0.2s ease;
		touch-action: manipulation;
	}

	.header-btn.active {
		background: rgba(255, 255, 255, 0.2);
		border-color: rgba(255, 255, 255, 0.4);
	}

	.game-layout {
		display: grid;
		grid-template-columns: 300px 1fr 300px;
		gap: 1rem;
		flex: 1;
		padding: 1rem;
		min-height: 0;
	}

	.game-layout.mobile {
		grid-template-columns: 1fr;
		grid-template-rows: auto 1fr auto;
		gap: 0.5rem;
		padding: 0.5rem;
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

	.mobile-top-info {
		background: rgba(0, 0, 0, 0.2);
		backdrop-filter: blur(10px);
		border-radius: 12px;
		padding: 0.75rem;
		margin-bottom: 0.5rem;
	}

	.mobile-score-row {
		display: flex;
		justify-content: space-between;
		margin-bottom: 0.5rem;
	}

	.score-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
	}

	.score-label {
		font-size: 0.7rem;
		opacity: 0.8;
		margin-bottom: 0.2rem;
	}

	.score-value {
		font-size: 1rem;
		font-weight: bold;
		color: #ffd700;
	}

	.mobile-controls-row {
		display: flex;
		gap: 0.5rem;
		justify-content: center;
	}

	.mobile-game-btn {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: none;
		border-radius: 8px;
		padding: 0.5rem 1rem;
		font-size: 1rem;
		cursor: pointer;
		transition: all 0.2s ease;
		touch-action: manipulation;
		flex: 1;
		max-width: 80px;
	}

	.mobile-game-btn:active {
		transform: scale(0.95);
	}

	.mobile-game-board {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 0;
	}

	.mobile-bottom-controls {
		background: rgba(0, 0, 0, 0.2);
		backdrop-filter: blur(10px);
		border-radius: 12px;
		padding: 0.5rem;
	}

	.mobile-overlay {
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
		padding: 1rem;
	}

	.mobile-panel {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 15px;
		width: 100%;
		max-width: 400px;
		max-height: 80vh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.mobile-panel-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.2);
	}

	.mobile-panel-header h3 {
		margin: 0;
		font-size: 1.1rem;
	}

	.close-btn {
		background: rgba(255, 255, 255, 0.2);
		color: white;
		border: none;
		border-radius: 50%;
		width: 30px;
		height: 30px;
		font-size: 1rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		touch-action: manipulation;
	}

	.mobile-panel-content {
		flex: 1;
		overflow-y: auto;
		padding: 1rem;
	}

	.instructions {
		margin-top: 1rem;
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
		margin: 0.5rem 0;
		font-size: 0.9rem;
		line-height: 1.4;
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
		padding: 1rem;
	}

	.game-over-modal {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		padding: 2rem;
		border-radius: 20px;
		text-align: center;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
		border: 2px solid rgba(255, 255, 255, 0.2);
		max-width: 90vw;
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
		touch-action: manipulation;
	}

	.game-over-modal button:active {
		transform: scale(0.95);
	}

	/* Desktop breakpoints */
	@media (min-width: 769px) {
		.game-header h1 {
			font-size: 2rem;
		}
		
		.game-header p {
			font-size: 1rem;
		}
	}

	@media (max-width: 1200px) and (min-width: 769px) {
		.game-layout {
			grid-template-columns: 250px 1fr 250px;
		}
	}

	/* Mobile optimizations */
	@media (max-width: 768px) {
		.game-container {
			overflow-y: hidden;
		}
		
		.game-header {
			padding: 0.5rem;
		}
		
		.game-header h1 {
			font-size: 1.3rem;
		}
	}

	@media (max-width: 480px) {
		.game-header h1 {
			font-size: 1.1rem;
		}
		
		.score-value {
			font-size: 0.9rem;
		}
		
		.mobile-game-btn {
			padding: 0.4rem 0.8rem;
			font-size: 0.9rem;
		}
	}

	/* Landscape mobile */
	@media (max-height: 500px) and (orientation: landscape) {
		.game-header {
			padding: 0.25rem;
		}
		
		.game-header h1 {
			font-size: 1rem;
		}
		
		.mobile-top-info {
			padding: 0.5rem;
		}
		
		.mobile-bottom-controls {
			padding: 0.25rem;
		}
	}
</style>
