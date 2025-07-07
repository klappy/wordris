<script lang="ts">
	export let score: number;
	export let level: number;
	export let linesCleared: number;
	export let highScore: number;

	function getScoreToNextLevel(currentScore: number): number {
		const levelThresholds = [0, 1000, 2500, 5000, 8000, 12000, 17000, 23000, 30000, 40000, 50000];
		const currentLevel = Math.min(level, levelThresholds.length - 1);
		if (currentLevel >= levelThresholds.length - 1) return 0;
		return levelThresholds[currentLevel] - currentScore;
	}

	function getLevelProgress(currentScore: number): number {
		const levelThresholds = [0, 1000, 2500, 5000, 8000, 12000, 17000, 23000, 30000, 40000, 50000];
		const currentLevel = Math.min(level - 1, levelThresholds.length - 2);
		if (currentLevel >= levelThresholds.length - 2) return 100;
		
		const levelStart = levelThresholds[currentLevel];
		const levelEnd = levelThresholds[currentLevel + 1];
		const progress = ((currentScore - levelStart) / (levelEnd - levelStart)) * 100;
		return Math.max(0, Math.min(100, progress));
	}

	function getLevelIcon(level: number): string {
		if (level <= 2) return '🌱';
		if (level <= 4) return '📖';
		if (level <= 6) return '⭐';
		if (level <= 8) return '🔥';
		return '👑';
	}

	function getLevelName(level: number): string {
		if (level <= 2) return 'Beginner';
		if (level <= 4) return 'Faithful';
		if (level <= 6) return 'Disciple';
		if (level <= 8) return 'Scholar';
		return 'Master';
	}

	function formatScore(score: number): string {
		if (score >= 1000000) {
			return (score / 1000000).toFixed(1) + 'M';
		} else if (score >= 1000) {
			return (score / 1000).toFixed(1) + 'K';
		}
		return score.toString();
	}

	$: scoreToNext = getScoreToNextLevel(score);
	$: levelProgress = getLevelProgress(score);
	$: isNewHighScore = score > highScore && score > 0;
</script>

<div class="score-display">
	<div class="score-header">
		<h3>📊 Score & Progress</h3>
		{#if isNewHighScore}
			<div class="new-high-score">🎉 New High Score!</div>
		{/if}
	</div>

	<div class="score-main">
		<div class="current-score">
			<span class="score-label">Score</span>
			<span class="score-value">{formatScore(score)}</span>
		</div>
		<div class="high-score">
			<span class="score-label">High Score</span>
			<span class="score-value">{formatScore(highScore)}</span>
		</div>
	</div>

	<div class="level-section">
		<div class="level-header">
			<div class="level-info">
				<span class="level-icon">{getLevelIcon(level)}</span>
				<span class="level-text">Level {level}</span>
			</div>
			<div class="level-name">{getLevelName(level)}</div>
		</div>
		
		<div class="level-progress">
			<div class="progress-bar">
				<div 
					class="progress-fill" 
					style="width: {levelProgress}%"
				></div>
			</div>
			<div class="progress-text">
				{#if scoreToNext > 0}
					{formatScore(scoreToNext)} to next level
				{:else}
					Master Level Achieved!
				{/if}
			</div>
		</div>
	</div>

	<div class="stats-section">
		<div class="stat-item">
			<span class="stat-icon">📏</span>
			<div class="stat-info">
				<span class="stat-label">Lines Cleared</span>
				<span class="stat-value">{linesCleared}</span>
			</div>
		</div>
		
		<div class="stat-item">
			<span class="stat-icon">⚡</span>
			<div class="stat-info">
				<span class="stat-label">Level Speed</span>
				<span class="stat-value">{Math.max(1, 11 - level)}/10</span>
			</div>
		</div>
		
		<div class="stat-item">
			<span class="stat-icon">🎯</span>
			<div class="stat-info">
				<span class="stat-label">Efficiency</span>
				<span class="stat-value">{linesCleared > 0 ? Math.round(score / linesCleared) : 0}</span>
			</div>
		</div>
	</div>

	<div class="achievements-section">
		<h4>🏆 Achievements</h4>
		<div class="achievements-grid">
			<div class="achievement {score >= 1000 ? 'unlocked' : 'locked'}">
				<span class="achievement-icon">{score >= 1000 ? '✅' : '🔒'}</span>
				<span class="achievement-text">First 1K</span>
			</div>
			<div class="achievement {linesCleared >= 10 ? 'unlocked' : 'locked'}">
				<span class="achievement-icon">{linesCleared >= 10 ? '✅' : '🔒'}</span>
				<span class="achievement-text">Line Master</span>
			</div>
			<div class="achievement {level >= 5 ? 'unlocked' : 'locked'}">
				<span class="achievement-icon">{level >= 5 ? '✅' : '🔒'}</span>
				<span class="achievement-text">Scholar</span>
			</div>
			<div class="achievement {score >= 10000 ? 'unlocked' : 'locked'}">
				<span class="achievement-icon">{score >= 10000 ? '✅' : '🔒'}</span>
				<span class="achievement-text">Word Saint</span>
			</div>
		</div>
	</div>
</div>

<style>
	.score-display {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 10px;
		padding: 1rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.score-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.score-header h3 {
		margin: 0;
		color: #ffd700;
		font-size: 1.1rem;
	}

	.new-high-score {
		background: linear-gradient(45deg, #ff6b6b, #ffd700);
		color: white;
		padding: 0.25rem 0.75rem;
		border-radius: 15px;
		font-size: 0.8rem;
		font-weight: bold;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
		animation: celebrateHighScore 2s ease-in-out infinite;
	}

	.score-main {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.current-score, .high-score {
		text-align: center;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 8px;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.current-score {
		border-left: 3px solid #4CAF50;
	}

	.high-score {
		border-left: 3px solid #ffd700;
	}

	.score-label {
		display: block;
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.8);
		margin-bottom: 0.5rem;
	}

	.score-value {
		display: block;
		font-size: 1.5rem;
		font-weight: bold;
		color: #ffd700;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
	}

	.level-section {
		background: rgba(255, 255, 255, 0.05);
		padding: 1rem;
		border-radius: 8px;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.level-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.level-info {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.level-icon {
		font-size: 1.5rem;
	}

	.level-text {
		font-size: 1.2rem;
		font-weight: bold;
		color: #ffd700;
	}

	.level-name {
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.8);
		background: rgba(255, 255, 255, 0.1);
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
	}

	.progress-bar {
		height: 8px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 4px;
		overflow: hidden;
		margin-bottom: 0.5rem;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #4CAF50, #8BC34A);
		transition: width 0.3s ease;
		border-radius: 4px;
	}

	.progress-text {
		font-size: 0.85rem;
		color: rgba(255, 255, 255, 0.8);
		text-align: center;
	}

	.stats-section {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.stat-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 8px;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.stat-icon {
		font-size: 1.2rem;
		width: 24px;
		text-align: center;
	}

	.stat-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex: 1;
	}

	.stat-label {
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.8);
	}

	.stat-value {
		font-weight: bold;
		color: #ffd700;
	}

	.achievements-section h4 {
		margin: 0 0 0.75rem 0;
		color: #ffd700;
		font-size: 1rem;
	}

	.achievements-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
	}

	.achievement {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem;
		border-radius: 6px;
		font-size: 0.85rem;
		transition: all 0.2s ease;
	}

	.achievement.unlocked {
		background: linear-gradient(45deg, rgba(76, 175, 80, 0.2), rgba(139, 195, 74, 0.2));
		border: 1px solid rgba(76, 175, 80, 0.3);
		color: #4CAF50;
	}

	.achievement.locked {
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		color: rgba(255, 255, 255, 0.5);
	}

	.achievement-icon {
		font-size: 1rem;
	}

	.achievement-text {
		font-size: 0.8rem;
		font-weight: bold;
	}

	@keyframes celebrateHighScore {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.05); }
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.score-main {
			grid-template-columns: 1fr;
		}
		
		.level-header {
			flex-direction: column;
			gap: 0.5rem;
			text-align: center;
		}
		
		.achievements-grid {
			grid-template-columns: 1fr;
		}
	}
</style>