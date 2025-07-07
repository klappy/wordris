<script lang="ts">
	import type { VerseState } from '$lib/stores/bibleVerseStore';

	export let verse: VerseState;

	function formatVerseText(text: string): string {
		// Add line breaks for better readability
		const words = text.split(' ');
		const lines = [];
		let currentLine = '';
		
		for (const word of words) {
			if (currentLine.length + word.length + 1 <= 50) {
				currentLine += (currentLine ? ' ' : '') + word;
			} else {
				if (currentLine) lines.push(currentLine);
				currentLine = word;
			}
		}
		if (currentLine) lines.push(currentLine);
		
		return lines.join('\n');
	}

	function getBookColor(reference: string): string {
		const book = reference.split(' ')[0];
		const colors = {
			'Genesis': '#E8F5E8', 'Exodus': '#FFE8E8', 'Psalms': '#E8E8FF',
			'Proverbs': '#FFF8E8', 'Matthew': '#E8FFE8', 'Mark': '#FFE8FF',
			'Luke': '#E8FFFF', 'John': '#FFFFE8', 'Romans': '#F0E8FF',
			'1 Corinthians': '#E8FFF0', '2 Corinthians': '#FFF0E8',
			'Ephesians': '#F0FFE8', 'Philippians': '#E8F0FF',
			'Colossians': '#FFE8F0', 'Hebrews': '#F8E8FF',
			'James': '#E8FFF8', '1 Peter': '#F8FFE8',
			'1 John': '#FFE8E8', 'Revelation': '#E8E8E8'
		};
		return colors[book] || '#F0F0F0';
	}
</script>

<div class="verse-display">
	<div class="verse-header">
		<h3>📖 Today's Verse</h3>
		{#if verse.loading}
			<div class="loading-spinner">⏳</div>
		{/if}
	</div>

	{#if verse.loading}
		<div class="loading-state">
			<div class="loading-animation">
				<div class="loading-dots">
					<span>📖</span>
					<span>✨</span>
					<span>🙏</span>
				</div>
			</div>
			<p>Loading God's Word...</p>
		</div>
	{:else if verse.error}
		<div class="error-state">
			<div class="error-icon">⚠️</div>
			<p class="error-message">Error loading verse: {verse.error}</p>
			<p class="error-fallback">Using offline verse</p>
		</div>
	{:else if verse.currentVerse}
		<div class="verse-content">
			<div class="verse-reference" style="background-color: {getBookColor(verse.currentVerse.reference)};">
				<span class="reference-text">{verse.currentVerse.reference}</span>
				<span class="translation">({verse.currentVerse.translation})</span>
			</div>
			
			<div class="verse-text-container">
				<div class="verse-text">
					"{formatVerseText(verse.currentVerse.text)}"
				</div>
			</div>

			<div class="verse-stats">
				<div class="stat">
					<span class="stat-icon">📝</span>
					<span class="stat-value">{verse.wordBank.length}</span>
					<span class="stat-label">words</span>
				</div>
				<div class="stat">
					<span class="stat-icon">🔤</span>
					<span class="stat-value">{verse.currentVerse.text.replace(/[^\w]/g, '').length}</span>
					<span class="stat-label">letters</span>
				</div>
				<div class="stat">
					<span class="stat-icon">📏</span>
					<span class="stat-value">{Math.round(verse.currentVerse.text.split(' ').reduce((sum, word) => sum + word.length, 0) / verse.currentVerse.text.split(' ').length)}</span>
					<span class="stat-label">avg</span>
				</div>
			</div>

			{#if verse.currentDifficulty}
				<div class="difficulty-preview">
					<div class="difficulty-header">
						<span class="difficulty-icon">
							{#if verse.currentDifficulty.level === 'Beginner'}🌱
							{:else if verse.currentDifficulty.level === 'Easy'}📖
							{:else if verse.currentDifficulty.level === 'Intermediate'}⭐
							{:else if verse.currentDifficulty.level === 'Advanced'}🔥
							{:else}👑
							{/if}
						</span>
						<span class="difficulty-level">{verse.currentDifficulty.level}</span>
						<span class="difficulty-score">{verse.currentDifficulty.score}/10</span>
					</div>
					<p class="difficulty-description">{verse.currentDifficulty.description}</p>
				</div>
			{/if}
		</div>
	{:else}
		<div class="empty-state">
			<div class="empty-icon">📚</div>
			<p>No verse loaded</p>
		</div>
	{/if}
</div>

<style>
	.verse-display {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 10px;
		padding: 1rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
		margin-bottom: 1rem;
	}

	.verse-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.verse-header h3 {
		margin: 0;
		color: #ffd700;
		font-size: 1.1rem;
	}

	.loading-spinner {
		animation: spin 2s linear infinite;
	}

	.loading-state {
		text-align: center;
		padding: 2rem 1rem;
		color: rgba(255, 255, 255, 0.8);
	}

	.loading-animation {
		margin-bottom: 1rem;
	}

	.loading-dots {
		display: flex;
		justify-content: center;
		gap: 0.5rem;
	}

	.loading-dots span {
		font-size: 1.5rem;
		animation: bounce 1.5s ease-in-out infinite;
	}

	.loading-dots span:nth-child(1) { animation-delay: 0s; }
	.loading-dots span:nth-child(2) { animation-delay: 0.3s; }
	.loading-dots span:nth-child(3) { animation-delay: 0.6s; }

	.error-state {
		text-align: center;
		padding: 1.5rem;
		background: rgba(244, 67, 54, 0.1);
		border-radius: 8px;
		border: 1px solid rgba(244, 67, 54, 0.3);
	}

	.error-icon {
		font-size: 2rem;
		margin-bottom: 0.5rem;
	}

	.error-message {
		color: #ff6b6b;
		margin: 0.5rem 0;
		font-weight: bold;
	}

	.error-fallback {
		color: rgba(255, 255, 255, 0.7);
		margin: 0;
		font-size: 0.9rem;
	}

	.verse-content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.verse-reference {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 1rem;
		border-radius: 8px;
		color: #333;
		font-weight: bold;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.reference-text {
		font-size: 1rem;
		font-weight: bold;
	}

	.translation {
		font-size: 0.8rem;
		opacity: 0.8;
	}

	.verse-text-container {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 8px;
		padding: 1.5rem;
		border-left: 4px solid #ffd700;
		position: relative;
	}

	.verse-text-container::before {
		content: '"';
		position: absolute;
		top: -10px;
		left: 10px;
		font-size: 3rem;
		color: #ffd700;
		opacity: 0.3;
		font-family: serif;
	}

	.verse-text {
		font-size: 1.1rem;
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.95);
		font-style: italic;
		white-space: pre-line;
		text-align: justify;
		margin: 0;
	}

	.verse-stats {
		display: flex;
		justify-content: space-around;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 8px;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.stat {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}

	.stat-icon {
		font-size: 1.2rem;
	}

	.stat-value {
		font-size: 1.3rem;
		font-weight: bold;
		color: #ffd700;
	}

	.stat-label {
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.7);
	}

	.difficulty-preview {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 8px;
		padding: 1rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.difficulty-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.difficulty-icon {
		font-size: 1.2rem;
	}

	.difficulty-level {
		font-weight: bold;
		color: #ffd700;
	}

	.difficulty-score {
		margin-left: auto;
		background: rgba(255, 215, 0, 0.2);
		color: #ffd700;
		padding: 0.25rem 0.5rem;
		border-radius: 12px;
		font-size: 0.8rem;
		font-weight: bold;
	}

	.difficulty-description {
		margin: 0;
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.8);
		line-height: 1.4;
	}

	.empty-state {
		text-align: center;
		padding: 2rem;
		color: rgba(255, 255, 255, 0.6);
	}

	.empty-icon {
		font-size: 2rem;
		margin-bottom: 0.5rem;
	}

	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	@keyframes bounce {
		0%, 20%, 50%, 80%, 100% {
			transform: translateY(0);
		}
		40% {
			transform: translateY(-10px);
		}
		60% {
			transform: translateY(-5px);
		}
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.verse-display {
			padding: 0.75rem;
		}
		
		.verse-text {
			font-size: 1rem;
		}
		
		.verse-stats {
			flex-direction: column;
			gap: 0.5rem;
		}
		
		.stat {
			flex-direction: row;
			justify-content: space-between;
		}
		
		.difficulty-header {
			flex-wrap: wrap;
		}
	}
</style>