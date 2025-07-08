<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	// Touch handling for buttons
	function handleButtonTouch(action: string, detail?: string) {
		console.log('Button touch:', action, detail);
		if (action === 'move' && detail) {
			dispatch('move', detail);
		} else if (action === 'drop') {
			dispatch('drop');
		}
	}

	// Swipe gesture handling
	let touchStartX = 0;
	let touchStartY = 0;
	let touchStartTime = 0;
	let gameBoard: HTMLElement;

	function handleTouchStart(e: TouchEvent) {
		if (e.touches.length === 1) {
			touchStartX = e.touches[0].clientX;
			touchStartY = e.touches[0].clientY;
			touchStartTime = Date.now();
		}
	}

	function handleTouchEnd(e: TouchEvent) {
		if (e.changedTouches.length === 1) {
			const touchEndX = e.changedTouches[0].clientX;
			const touchEndY = e.changedTouches[0].clientY;
			const touchEndTime = Date.now();
			
			const deltaX = touchEndX - touchStartX;
			const deltaY = touchEndY - touchStartY;
			const deltaTime = touchEndTime - touchStartTime;
			
			// Minimum swipe distance and maximum time
			const minSwipeDistance = 50;
			const maxSwipeTime = 300;
			
			if (deltaTime < maxSwipeTime) {
				const absDeltaX = Math.abs(deltaX);
				const absDeltaY = Math.abs(deltaY);
				
				// Determine if it's a horizontal or vertical swipe
				if (absDeltaX > minSwipeDistance && absDeltaX > absDeltaY) {
					// Horizontal swipe
					if (deltaX > 0) {
						console.log('Swipe right detected');
						dispatch('move', 'right');
					} else {
						console.log('Swipe left detected');
						dispatch('move', 'left');
					}
				} else if (absDeltaY > minSwipeDistance && absDeltaY > absDeltaX) {
					// Vertical swipe
					if (deltaY > 0) {
						console.log('Swipe down detected');
						dispatch('move', 'down');
					}
				}
			}
		}
	}

	function handleTap(e: TouchEvent) {
		// Quick tap for drop
		const touchEndTime = Date.now();
		const deltaTime = touchEndTime - touchStartTime;
		
		if (deltaTime < 200) {
			const deltaX = Math.abs(e.changedTouches[0].clientX - touchStartX);
			const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY);
			
			// If it's a tap (not a swipe)
			if (deltaX < 20 && deltaY < 20) {
				console.log('Tap detected - dropping');
				dispatch('drop');
			}
		}
	}
</script>

<div class="mobile-controls-container">
	<!-- Swipe Area -->
	<div 
		class="swipe-area"
		on:touchstart={handleTouchStart}
		on:touchend={handleTouchEnd}
		role="button"
		tabindex="0"
		aria-label="Swipe to control game"
	>
		<div class="swipe-instructions">
			<p>🎮 Swipe to Control</p>
			<div class="swipe-hints">
				<span>⬅️ ➡️ Swipe Left/Right</span>
				<span>⬇️ Swipe Down</span>
				<span>👆 Tap to Drop</span>
			</div>
		</div>
	</div>

	<!-- Button Controls -->
	<div class="mobile-controls">
		<div class="control-row">
			<button 
				class="control-btn move-btn"
				on:click={() => handleButtonTouch('move', 'left')}
				aria-label="Move left"
			>
				⬅️
			</button>
			
			<button 
				class="control-btn drop-btn"
				on:click={() => handleButtonTouch('drop')}
				aria-label="Drop piece"
			>
				⬇️ DROP
			</button>
			
			<button 
				class="control-btn move-btn"
				on:click={() => handleButtonTouch('move', 'right')}
				aria-label="Move right"
			>
				➡️
			</button>
		</div>
		
		<div class="control-row">
			<button 
				class="control-btn soft-drop-btn"
				on:click={() => handleButtonTouch('move', 'down')}
				aria-label="Soft drop"
			>
				⬇️ Soft Drop
			</button>
		</div>
	</div>
</div>

<style>
	.mobile-controls-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.swipe-area {
		background: rgba(0, 0, 0, 0.2);
		border: 2px dashed rgba(255, 255, 255, 0.3);
		border-radius: 15px;
		padding: 1rem;
		text-align: center;
		touch-action: pan-x pan-y;
		user-select: none;
		-webkit-user-select: none;
	}

	.swipe-instructions p {
		margin: 0 0 0.5rem 0;
		font-size: 1rem;
		font-weight: bold;
		color: #ffd700;
	}

	.swipe-hints {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.8rem;
		opacity: 0.8;
	}

	.mobile-controls {
		padding: 1rem;
		background: rgba(0, 0, 0, 0.3);
		border-radius: 15px;
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
		background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
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

	.drop-btn:active {
		background: linear-gradient(135deg, #e55555 0%, #d44812 100%);
	}

	.soft-drop-btn {
		flex: 1;
		background: linear-gradient(135deg, #ffd700 0%, #f39c12 100%);
		color: #333;
	}

	.soft-drop-btn:active {
		background: linear-gradient(135deg, #e6c200 0%, #d68910 100%);
	}

	@media (max-width: 480px) {
		.control-btn {
			padding: 0.8rem;
			font-size: 0.9rem;
		}
		
		.swipe-instructions p {
			font-size: 0.9rem;
		}
		
		.swipe-hints {
			font-size: 0.7rem;
		}
	}

	@media (max-height: 600px) and (orientation: landscape) {
		.swipe-area {
			padding: 0.5rem;
		}
		
		.mobile-controls {
			padding: 0.5rem;
		}
		
		.control-btn {
			padding: 0.6rem;
			font-size: 0.8rem;
		}
	}
</style>