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
});

function About ({score, highScore, wordBank, verseData, refreshVerse, loading, error}) {
  return (
    <div className={css(styles.container)}>
      <h3>{`Score : ${score}`}</h3>
      <h3>{`High Score: ${highScore}`}</h3>
      
      {loading && <div className={css(styles.loadingText)}>Loading Bible verse...</div>}
      {error && <div className={css(styles.errorText)}>Error: {error}</div>}
      
      {verseData && (
        <div className={css(styles.verseContainer)}>
          <h4>Today's Bible Verse</h4>
          <div className={css(styles.verseText)}>"{verseData.text}"</div>
          <div className={css(styles.verseReference)}>- {verseData.reference}</div>
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
      <p>This is a faith-based twist on the classic word puzzle game.</p>
      
      <h4>Check out github repo here</h4>
      <a className="github-button" href="https://github.com/klappy/wordris" data-size="large" data-show-count="true" aria-label="Star klappy/wordris on GitHub">Github Repo</a>
    </div>
  );
};

export default About;