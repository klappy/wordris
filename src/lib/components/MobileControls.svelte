<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function handleTouchStart(e: TouchEvent) {
		e.preventDefault();
	}

	function handleTouchMove(e: TouchEvent) {
		e.preventDefault();
	}
</script>

<div class="mobile-controls">
	<div class="control-row">
		<button 
			class="control-btn move-btn"
			on:touchstart={handleTouchStart}
			on:touchmove={handleTouchMove}
			on:click={() => dispatch('move', 'left')}
		>
			⬅️
		</button>
		
		<button 
			class="control-btn drop-btn"
			on:touchstart={handleTouchStart}
			on:touchmove={handleTouchMove}
			on:click={() => dispatch('drop')}
		>
			⬇️ DROP
		</button>
		
		<button 
			class="control-btn move-btn"
			on:touchstart={handleTouchStart}
			on:touchmove={handleTouchMove}
			on:click={() => dispatch('move', 'right')}
		>
			➡️
		</button>
	</div>
	
	<div class="control-row">
		<button 
			class="control-btn soft-drop-btn"
			on:touchstart={handleTouchStart}
			on:touchmove={handleTouchMove}
			on:click={() => dispatch('move', 'down')}
		>
			⬇️ Soft Drop
		</button>
	</div>
</div>

<style>
	.mobile-controls {
		padding: 1rem;
		background: rgba(0, 0, 0, 0.3);
		border-radius: 15px;
		margin-top: 1rem;
	}

	.control-row {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
		justify-content: center;
	}

	.control-row:last-child {
		margin-bottom: 0;
	}

	.control-btn {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: none;
		border-radius: 12px;
		padding: 1rem;
		font-size: 1rem;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.2s ease;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		border: 2px solid rgba(255, 255, 255, 0.2);
		touch-action: manipulation;
		user-select: none;
		-webkit-user-select: none;
		-webkit-tap-highlight-color: transparent;
	}

	.control-btn:active {
		transform: scale(0.95);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
	}

	.move-btn {
		flex: 1;
		max-width: 80px;
	}

	.drop-btn {
		flex: 2;
		background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
		font-size: 1.1rem;
	}

	.soft-drop-btn {
		flex: 1;
		background: linear-gradient(135deg, #ffd700 0%, #f39c12 100%);
		color: #333;
	}

	@media (max-width: 480px) {
		.control-btn {
			padding: 0.8rem;
			font-size: 0.9rem;
		}
	}
</style>