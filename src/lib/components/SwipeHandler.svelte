<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let touchStartX = 0;
	let touchStartY = 0;
	let touchStartTime = 0;
	let isMoving = false;

	function handleTouchStart(e: TouchEvent) {
		if (e.touches.length === 1) {
			touchStartX = e.touches[0].clientX;
			touchStartY = e.touches[0].clientY;
			touchStartTime = Date.now();
			isMoving = false;
		}
	}

	function handleTouchMove(e: TouchEvent) {
		if (e.touches.length === 1) {
			const currentX = e.touches[0].clientX;
			const currentY = e.touches[0].clientY;
			const deltaX = Math.abs(currentX - touchStartX);
			const deltaY = Math.abs(currentY - touchStartY);
			
			// If we've moved enough, consider it a swipe
			if (deltaX > 10 || deltaY > 10) {
				isMoving = true;
			}
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
			
			// Swipe thresholds
			const minSwipeDistance = 30;
			const maxSwipeTime = 500;
			const minTapTime = 50;
			
			if (deltaTime < maxSwipeTime) {
				const absDeltaX = Math.abs(deltaX);
				const absDeltaY = Math.abs(deltaY);
				
				// Check for swipe gestures
				if (absDeltaX > minSwipeDistance && absDeltaX > absDeltaY * 1.5) {
					// Horizontal swipe
					if (deltaX > 0) {
						dispatch('move', 'right');
					} else {
						dispatch('move', 'left');
					}
				} else if (absDeltaY > minSwipeDistance && absDeltaY > absDeltaX * 1.5) {
					// Vertical swipe
					if (deltaY > 0) {
						dispatch('move', 'down');
					}
				} else if (!isMoving && deltaTime > minTapTime && deltaTime < 300) {
					// Quick tap for drop
					dispatch('drop');
				}
			}
		}
	}
</script>

<div 
	class="swipe-handler"
	on:touchstart={handleTouchStart}
	on:touchmove={handleTouchMove}
	on:touchend={handleTouchEnd}
	role="button"
	tabindex="0"
	aria-label="Game board - swipe to control"
>
	<slot />
</div>

<style>
	.swipe-handler {
		touch-action: pan-x pan-y;
		user-select: none;
		-webkit-user-select: none;
		-webkit-tap-highlight-color: transparent;
		width: 100%;
		height: 100%;
		position: relative;
	}
</style>