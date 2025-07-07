<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { GameMode } from '$lib/stores/gameStore';

	export let gameMode: GameMode;
	export let isGamePaused: boolean;
	export let isGameOver: boolean;

	const dispatch = createEventDispatcher();

	function handleModeChange(mode: GameMode) {
		dispatch('modeChange', mode);
	}

	function handlePause() {
		dispatch('pause');
	}

	function handleRestart() {
		dispatch('restart');
	}

	function handleNewVerse() {
		dispatch('newVerse');
	}
</script>

<div class="game-controls">
	<div class="controls-header">
		<h3>🎮 Game Controls</h3>
	</div>

	<!-- Game Mode Selection -->
	<div class="mode-selection">
		<h4>Game Mode</h4>
		<div class="mode-buttons">
			<button 
				class="mode-button {gameMode === 'standard' ? 'active' : ''}"
				on:click={() => handleModeChange('standard')}
				disabled={isGameOver}
			>
				<span class="mode-icon">🧩</span>
				<div class="mode-info">
					<span class="mode-name">Tetris Mode</span>
					<span class="mode-description">Words disappear when found</span>
				</div>
			</button>
			
			<button 
				class="mode-button {gameMode === 'wordSearch' ? 'active' : ''}"
				on:click={() => handleModeChange('wordSearch')}
				disabled={isGameOver}
			>
				<span class="mode-icon">🔍</span>
				<div class="mode-info">
					<span class="mode-name">Word Search</span>
					<span class="mode-description">Words stay highlighted</span>
				</div>
			</button>
		</div>
	</div>

	<!-- Game Control Buttons -->
	<div class="control-buttons">
		<button 
			class="control-button pause-button"
			on:click={handlePause}
			disabled={isGameOver}
		>
			<span class="button-icon">{isGamePaused ? '▶️' : '⏸️'}</span>
			<span class="button-text">{isGamePaused ? 'Resume' : 'Pause'}</span>
		</button>

		<button 
			class="control-button restart-button"
			on:click={handleRestart}
		>
			<span class="button-icon">🔄</span>
			<span class="button-text">Restart</span>
		</button>

		<button 
			class="control-button verse-button"
			on:click={handleNewVerse}
		>
			<span class="button-icon">📖</span>
			<span class="button-text">New Verse</span>
		</button>
	</div>

	<!-- Touch Controls for Mobile -->
	<div class="touch-controls">
		<h4>📱 Touch Controls</h4>
		<div class="touch-buttons">
			<button 
				class="touch-button"
				on:touchstart={() => dispatch('move', 'left')}
				on:click={() => dispatch('move', 'left')}
				disabled={isGameOver || isGamePaused}
			>
				⬅️
			</button>
			<button 
				class="touch-button"
				on:touchstart={() => dispatch('move', 'down')}
				on:click={() => dispatch('move', 'down')}
				disabled={isGameOver || isGamePaused}
			>
				⬇️
			</button>
			<button 
				class="touch-button"
				on:touchstart={() => dispatch('move', 'right')}
				on:click={() => dispatch('move', 'right')}
				disabled={isGameOver || isGamePaused}
			>
				➡️
			</button>
			<button 
				class="touch-button drop-button"
				on:touchstart={() => dispatch('drop')}
				on:click={() => dispatch('drop')}
				disabled={isGameOver || isGamePaused}
			>
				⬇️💨
			</button>
		</div>
	</div>

	<!-- Keyboard Shortcuts -->
	<div class="keyboard-shortcuts">
		<h4>⌨️ Keyboard Shortcuts</h4>
		<div class="shortcuts-list">
			<div class="shortcut">
				<span class="key">←→↓</span>
				<span class="description">Move letter</span>
			</div>
			<div class="shortcut">
				<span class="key">Space</span>
				<span class="description">Drop instantly</span>
			</div>
			<div class="shortcut">
				<span class="key">R</span>
				<span class="description">Restart game</span>
			</div>
			<div class="shortcut">
				<span class="key">P</span>
				<span class="description">Pause/Resume</span>
			</div>
		</div>
	</div>

	<!-- Game Status -->
	<div class="game-status">
		<div class="status-indicator {isGameOver ? 'game-over' : isGamePaused ? 'paused' : 'playing'}">
			<span class="status-icon">
				{#if isGameOver}
					⏹️
				{:else if isGamePaused}
					⏸️
				{:else}
					▶️
				{/if}
			</span>
			<span class="status-text">
				{#if isGameOver}
					Game Over
				{:else if isGamePaused}
					Paused
				{:else}
					Playing
				{/if}
			</span>
		</div>
	</div>
</div>

<style>
	.game-controls {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 10px;
		padding: 1rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.controls-header h3 {
		margin: 0;
		color: #ffd700;
		font-size: 1.1rem;
	}

	.mode-selection h4, .keyboard-shortcuts h4, .touch-controls h4 {
		margin: 0 0 0.75rem 0;
		color: rgba(255, 255, 255, 0.9);
		font-size: 0.95rem;
	}

	.mode-buttons {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.mode-button {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		color: rgba(255, 255, 255, 0.8);
		cursor: pointer;
		transition: all 0.2s ease;
		text-align: left;
	}

	.mode-button:hover:not(:disabled) {
		background: rgba(255, 255, 255, 0.1);
		border-color: rgba(255, 255, 255, 0.2);
	}

	.mode-button.active {
		background: linear-gradient(45deg, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.1));
		border-color: #ffd700;
		color: #ffd700;
	}

	.mode-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.mode-icon {
		font-size: 1.5rem;
	}

	.mode-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.mode-name {
		font-weight: bold;
		font-size: 0.9rem;
	}

	.mode-description {
		font-size: 0.8rem;
		opacity: 0.8;
	}

	.control-buttons {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.control-button {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		color: white;
		cursor: pointer;
		transition: all 0.2s ease;
		font-size: 0.9rem;
		font-weight: bold;
	}

	.control-button:hover:not(:disabled) {
		background: rgba(255, 255, 255, 0.1);
		transform: translateY(-1px);
	}

	.control-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.pause-button:hover:not(:disabled) {
		background: linear-gradient(45deg, rgba(255, 193, 7, 0.2), rgba(255, 193, 7, 0.1));
		border-color: #ffc107;
	}

	.restart-button:hover:not(:disabled) {
		background: linear-gradient(45deg, rgba(244, 67, 54, 0.2), rgba(244, 67, 54, 0.1));
		border-color: #f44336;
	}

	.verse-button:hover:not(:disabled) {
		background: linear-gradient(45deg, rgba(76, 175, 80, 0.2), rgba(76, 175, 80, 0.1));
		border-color: #4caf50;
	}

	.button-icon {
		font-size: 1.2rem;
	}

	.button-text {
		font-size: 0.9rem;
	}

	.touch-controls {
		display: none;
	}

	.touch-buttons {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 0.5rem;
	}

	.touch-button {
		padding: 1rem;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		color: white;
		cursor: pointer;
		transition: all 0.2s ease;
		font-size: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.touch-button:hover:not(:disabled) {
		background: rgba(255, 255, 255, 0.1);
		transform: scale(1.05);
	}

	.touch-button:active:not(:disabled) {
		transform: scale(0.95);
	}

	.touch-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.drop-button {
		grid-column: 1 / -1;
		background: linear-gradient(45deg, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.1));
		border-color: #ffd700;
	}

	.shortcuts-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.shortcut {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 6px;
		font-size: 0.85rem;
	}

	.key {
		background: rgba(255, 255, 255, 0.1);
		color: #ffd700;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-family: monospace;
		font-weight: bold;
		font-size: 0.8rem;
	}

	.description {
		color: rgba(255, 255, 255, 0.8);
	}

	.game-status {
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		padding-top: 1rem;
	}

	.status-indicator {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem;
		border-radius: 8px;
		font-weight: bold;
		text-align: center;
		justify-content: center;
	}

	.status-indicator.playing {
		background: linear-gradient(45deg, rgba(76, 175, 80, 0.2), rgba(76, 175, 80, 0.1));
		border: 1px solid rgba(76, 175, 80, 0.3);
		color: #4caf50;
	}

	.status-indicator.paused {
		background: linear-gradient(45deg, rgba(255, 193, 7, 0.2), rgba(255, 193, 7, 0.1));
		border: 1px solid rgba(255, 193, 7, 0.3);
		color: #ffc107;
	}

	.status-indicator.game-over {
		background: linear-gradient(45deg, rgba(244, 67, 54, 0.2), rgba(244, 67, 54, 0.1));
		border: 1px solid rgba(244, 67, 54, 0.3);
		color: #f44336;
	}

	.status-icon {
		font-size: 1.2rem;
	}

	.status-text {
		font-size: 0.9rem;
	}

	/* Mobile responsive */
	@media (max-width: 768px) {
		.touch-controls {
			display: block;
		}
		
		.mode-buttons {
			flex-direction: column;
		}
		
		.shortcuts-list {
			display: none;
		}
	}

	/* Tablet responsive */
	@media (max-width: 1024px) and (min-width: 769px) {
		.touch-controls {
			display: block;
		}
	}
</style>