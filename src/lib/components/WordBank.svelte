<script lang="ts">
	import type { DifficultyRating } from '$lib/stores/bibleVerseStore';

	export let words: string[];
	export let foundWords: string[];
	export let difficulty: DifficultyRating | null;

	function isWordFound(word: string): boolean {
		return foundWords.includes(word);
	}

	function getDifficultyColor(level: string): string {
		switch (level) {
			case 'Beginner': return '#4CAF50';
			case 'Easy': return '#8BC34A';
			case 'Intermediate': return '#FFC107';
			case 'Advanced': return '#FF9800';
			case 'Expert': return '#F44336';
			default: return '#9E9E9E';
		}
	}

	function getDifficultyIcon(level: string): string {
		switch (level) {
			case 'Beginner': return '🌱';
			case 'Easy': return '📖';
			case 'Intermediate': return '⭐';
			case 'Advanced': return '🔥';
			case 'Expert': return '👑';
			default: return '📚';
		}
	}
</script>

<div class="word-bank">
	<div class="header">
		<h3>📜 Word Bank</h3>
		{#if difficulty}
			<div class="difficulty-badge" style="background-color: {getDifficultyColor(difficulty.level)};">
				{getDifficultyIcon(difficulty.level)} {difficulty.level}
			</div>
		{/if}
	</div>

	{#if difficulty}
		<div class="difficulty-info">
			<p class="difficulty-description">{difficulty.description}</p>
			<div class="difficulty-score">
				<span class="score">Difficulty: {difficulty.score}/10</span>
			</div>
		</div>
	{/if}

	<div class="progress">
		<div class="progress-text">
			Progress: {foundWords.length}/{words.length} words found
		</div>
		<div class="progress-bar">
			<div 
				class="progress-fill" 
				style="width: {words.length > 0 ? (foundWords.length / words.length) * 100 : 0}%"
			></div>
		</div>
	</div>

	<div class="words-list">
		{#each words as word}
			<div class="word-item {isWordFound(word) ? 'found' : 'pending'}">
				<span class="word-text">{word}</span>
				<span class="word-length">({word.length})</span>
				{#if isWordFound(word)}
					<span class="check-mark">✓</span>
				{/if}
			</div>
		{/each}
	</div>

	{#if foundWords.length > 0}
		<div class="found-words-section">
			<h4>🎉 Found Words</h4>
			<div class="found-words-list">
				{#each foundWords as word}
					<span class="found-word">{word}</span>
				{/each}
			</div>
		</div>
	{/if}

	{#if difficulty}
		<div class="difficulty-factors">
			<h4>📊 Verse Analysis</h4>
			<div class="factors-grid">
				<div class="factor">
					<span class="factor-label">Words:</span>
					<span class="factor-value">{difficulty.factors.wordCount}</span>
				</div>
				<div class="factor">
					<span class="factor-label">Letters:</span>
					<span class="factor-value">{difficulty.factors.letterDiversity}</span>
				</div>
				<div class="factor">
					<span class="factor-label">Avg Length:</span>
					<span class="factor-value">{difficulty.factors.avgWordLength}</span>
				</div>
				<div class="factor">
					<span class="factor-label">Book Level:</span>
					<span class="factor-value">{difficulty.factors.bookDifficulty}/10</span>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.word-bank {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 10px;
		padding: 1rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.header h3 {
		margin: 0;
		color: #ffd700;
		font-size: 1.1rem;
	}

	.difficulty-badge {
		padding: 0.25rem 0.75rem;
		border-radius: 15px;
		font-size: 0.8rem;
		font-weight: bold;
		color: white;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
	}

	.difficulty-info {
		margin-bottom: 1rem;
		padding: 0.75rem;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 8px;
		border-left: 3px solid #ffd700;
	}

	.difficulty-description {
		margin: 0 0 0.5rem 0;
		font-size: 0.85rem;
		color: rgba(255, 255, 255, 0.8);
		line-height: 1.4;
	}

	.difficulty-score {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.score {
		font-weight: bold;
		color: #ffd700;
		font-size: 0.9rem;
	}

	.progress {
		margin-bottom: 1rem;
	}

	.progress-text {
		font-size: 0.9rem;
		margin-bottom: 0.5rem;
		color: rgba(255, 255, 255, 0.9);
	}

	.progress-bar {
		height: 6px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 3px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #4CAF50, #8BC34A);
		transition: width 0.3s ease;
		border-radius: 3px;
	}

	.words-list {
		max-height: 200px;
		overflow-y: auto;
		margin-bottom: 1rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		padding: 0.5rem;
		background: rgba(0, 0, 0, 0.2);
	}

	.word-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.4rem 0.6rem;
		margin: 0.2rem 0;
		border-radius: 6px;
		transition: all 0.2s ease;
		font-size: 0.9rem;
	}

	.word-item.pending {
		background: rgba(255, 255, 255, 0.05);
		color: rgba(255, 255, 255, 0.7);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.word-item.found {
		background: linear-gradient(45deg, rgba(76, 175, 80, 0.3), rgba(139, 195, 74, 0.3));
		color: #4CAF50;
		border: 1px solid rgba(76, 175, 80, 0.5);
		animation: foundAnimation 0.5s ease-in-out;
	}

	.word-text {
		font-weight: bold;
	}

	.word-length {
		font-size: 0.8rem;
		opacity: 0.7;
	}

	.check-mark {
		color: #4CAF50;
		font-weight: bold;
		font-size: 1.1rem;
	}

	.found-words-section {
		margin-bottom: 1rem;
	}

	.found-words-section h4 {
		margin: 0 0 0.5rem 0;
		color: #4CAF50;
		font-size: 1rem;
	}

	.found-words-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.found-word {
		background: linear-gradient(45deg, #4CAF50, #8BC34A);
		color: white;
		padding: 0.25rem 0.6rem;
		border-radius: 12px;
		font-size: 0.8rem;
		font-weight: bold;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
		animation: bounceIn 0.5s ease-out;
	}

	.difficulty-factors {
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		padding-top: 1rem;
	}

	.difficulty-factors h4 {
		margin: 0 0 0.75rem 0;
		color: #ffd700;
		font-size: 0.95rem;
	}

	.factors-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
	}

	.factor {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.4rem 0.6rem;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 6px;
		font-size: 0.8rem;
	}

	.factor-label {
		color: rgba(255, 255, 255, 0.8);
	}

	.factor-value {
		color: #ffd700;
		font-weight: bold;
	}

	/* Scrollbar styling */
	.words-list::-webkit-scrollbar {
		width: 6px;
	}

	.words-list::-webkit-scrollbar-track {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 3px;
	}

	.words-list::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.3);
		border-radius: 3px;
	}

	.words-list::-webkit-scrollbar-thumb:hover {
		background: rgba(255, 255, 255, 0.5);
	}

	@keyframes foundAnimation {
		0% { transform: scale(1); }
		50% { transform: scale(1.05); }
		100% { transform: scale(1); }
	}

	@keyframes bounceIn {
		0% {
			opacity: 0;
			transform: scale(0.3);
		}
		50% {
			opacity: 1;
			transform: scale(1.05);
		}
		70% {
			transform: scale(0.9);
		}
		100% {
			opacity: 1;
			transform: scale(1);
		}
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.word-bank {
			padding: 0.75rem;
		}
		
		.factors-grid {
			grid-template-columns: 1fr;
		}
		
		.words-list {
			max-height: 150px;
		}
	}

	/* Mobile sidebar compact version */
	:global(.mobile-word-bank-content) .word-bank {
		padding: 0.5rem;
		font-size: 0.8rem;
	}

	:global(.mobile-word-bank-content) .header h3 {
		font-size: 0.9rem;
		margin-bottom: 0.5rem;
	}

	:global(.mobile-word-bank-content) .difficulty-badge {
		padding: 0.2rem 0.5rem;
		font-size: 0.6rem;
	}

	:global(.mobile-word-bank-content) .difficulty-info {
		padding: 0.5rem;
		margin-bottom: 0.5rem;
	}

	:global(.mobile-word-bank-content) .difficulty-description {
		font-size: 0.7rem;
		line-height: 1.3;
	}

	:global(.mobile-word-bank-content) .progress-text {
		font-size: 0.7rem;
	}

	:global(.mobile-word-bank-content) .words-list {
		max-height: 120px;
		padding: 0.3rem;
	}

	:global(.mobile-word-bank-content) .word-item {
		padding: 0.25rem 0.4rem;
		font-size: 0.75rem;
		margin: 0.1rem 0;
	}

	:global(.mobile-word-bank-content) .word-length {
		font-size: 0.6rem;
	}

	:global(.mobile-word-bank-content) .found-words-section {
		margin-bottom: 0.5rem;
	}

	:global(.mobile-word-bank-content) .found-words-section h4 {
		font-size: 0.8rem;
		margin-bottom: 0.3rem;
	}

	:global(.mobile-word-bank-content) .found-word {
		padding: 0.2rem 0.4rem;
		font-size: 0.6rem;
	}

	:global(.mobile-word-bank-content) .difficulty-factors {
		padding-top: 0.5rem;
	}

	:global(.mobile-word-bank-content) .difficulty-factors h4 {
		font-size: 0.8rem;
		margin-bottom: 0.5rem;
	}

	:global(.mobile-word-bank-content) .factors-grid {
		grid-template-columns: 1fr;
		gap: 0.3rem;
	}

	:global(.mobile-word-bank-content) .factor {
		padding: 0.3rem 0.4rem;
		font-size: 0.6rem;
	}
</style>