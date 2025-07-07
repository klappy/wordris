import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';
import Button from '@material-ui/core/Button';
import RefreshIcon from '@material-ui/icons/Refresh';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
  },
  verseContainer: {
    backgroundColor: '#f5f5f5',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  verseText: {
    fontStyle: 'italic',
    fontSize: '16px',
    lineHeight: '1.5',
    marginBottom: '10px',
    color: '#333',
  },
  verseReference: {
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#666',
  },
  wordBank: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#4CAF50',
  },
  refreshButton: {
    marginTop: '10px',
    marginBottom: '20px',
  },
  loadingText: {
    color: '#666',
    fontStyle: 'italic',
  },
  errorText: {
    color: '#f44336',
    fontWeight: 'bold',
  },
  levelContainer: {
    backgroundColor: '#e3f2fd',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '2px solid #2196f3',
  },
  levelTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#1976d2',
  },
  levelInfo: {
    fontSize: '14px',
    marginBottom: '5px',
    color: '#555',
  },
  progressBar: {
    height: '8px',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    overflow: 'hidden',
    marginTop: '10px',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4caf50',
    transition: 'width 0.3s ease',
  },
  difficultyBadge: {
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: 'white',
    display: 'inline-block',
    marginLeft: '10px',
  },
});

function About ({score, highScore, wordBank, verseData, refreshVerse, loading, error, playerLevel, currentDifficulty}) {
  return (
    <div className={css(styles.container)}>
      <h3>{`Score : ${score}`}</h3>
      <h3>{`High Score: ${highScore}`}</h3>
      
      {/* Player Level and Progress */}
      {playerLevel && (
        <div className={css(styles.levelContainer)}>
          <div className={css(styles.levelTitle)}>
            {playerLevel.current.name}
          </div>
          <div className={css(styles.levelInfo)}>
            Level Progress: {Math.round(playerLevel.progress)}%
          </div>
          {playerLevel.next && (
            <div className={css(styles.levelInfo)}>
              Next Level: {playerLevel.next.name} (Need {playerLevel.next.minScore - score} more points)
            </div>
          )}
          <div className={css(styles.progressBar)}>
            <div 
              className={css(styles.progressFill)} 
              style={{ width: `${playerLevel.progress}%` }}
            />
          </div>
        </div>
      )}
      
      {loading && <div className={css(styles.loadingText)}>Loading Bible verse...</div>}
      {error && <div className={css(styles.errorText)}>Error: {error}</div>}
      
      {verseData && (
        <div className={css(styles.verseContainer)}>
          <h4>
            Today's Bible Verse
            {verseData.difficultyLevel && (
              <span 
                className={css(styles.difficultyBadge)}
                style={{ backgroundColor: verseData.difficultyLevel.color }}
              >
                {verseData.difficultyLevel.name}
              </span>
            )}
          </h4>
          <div className={css(styles.verseText)}>"{verseData.text}"</div>
          <div className={css(styles.verseReference)}>
            - {verseData.reference}
            {currentDifficulty && (
              <span style={{ marginLeft: '10px', fontSize: '12px', color: '#999' }}>
                (Difficulty: {currentDifficulty}/10)
              </span>
            )}
          </div>
          <Button 
            variant="contained" 
            size="small" 
            color="primary" 
            className={css(styles.refreshButton)} 
            onClick={refreshVerse}
            startIcon={<RefreshIcon />}
          >
            New Verse
          </Button>
        </div>
      )}
      
      <div className={css(styles.wordBank)}>
        Find These Words: {wordBank.join(', ').toUpperCase()}
      </div>
      
      <h4>Biblical Word Tetris</h4>
      <p>Find words from the Bible verse by connecting falling letters in any direction - horizontally, vertically, or diagonally!</p>
      <p>Select letters in order to form words. Valid words will disappear and you'll score points.</p>
      <p>As you progress, you'll unlock more challenging Bible verses and advance through spiritual levels!</p>
      
      <h4>Check out github repo here</h4>
      <a className="github-button" href="https://github.com/klappy/wordris" data-size="large" data-show-count="true" aria-label="Star klappy/wordris on GitHub">Github Repo</a>
    </div>
  );
};

export default About;