// Bible verse difficulty calculation system
export const calculateVerseDifficulty = (verseText, reference) => {
  if (!verseText) return 0;
  
  const cleanText = verseText.replace(/[^\w\s]/g, '').toLowerCase();
  const words = cleanText.split(/\s+/).filter(word => word.length > 0);
  
  // Factor 1: Word count (more words = harder)
  const wordCount = words.length;
  const wordCountScore = Math.min(wordCount / 5, 10); // Cap at 10, scale by 5
  
  // Factor 2: Character count (longer = harder)
  const charCount = cleanText.replace(/\s/g, '').length;
  const charCountScore = Math.min(charCount / 20, 10); // Cap at 10, scale by 20
  
  // Factor 3: Unique letter diversity (more unique letters = harder)
  const uniqueLetters = new Set(cleanText.replace(/\s/g, '').split(''));
  const letterDiversityScore = Math.min(uniqueLetters.size / 3, 10); // Cap at 10, scale by 3
  
  // Factor 4: Average word length (longer words = harder)
  const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
  const avgWordLengthScore = Math.min(avgWordLength / 1.5, 10); // Cap at 10, scale by 1.5
  
  // Factor 5: Uncommon letters (q, x, z, j, etc. = harder)
  const uncommonLetters = ['q', 'x', 'z', 'j', 'k', 'v', 'w', 'y'];
  const uncommonLetterCount = cleanText.split('').filter(char => uncommonLetters.includes(char)).length;
  const uncommonLetterScore = Math.min(uncommonLetterCount * 2, 10); // Cap at 10, 2 points per uncommon letter
  
  // Factor 6: Repeated letters (more repetition = easier)
  const letterCounts = {};
  cleanText.replace(/\s/g, '').split('').forEach(char => {
    letterCounts[char] = (letterCounts[char] || 0) + 1;
  });
  const avgRepetition = Object.values(letterCounts).reduce((sum, count) => sum + count, 0) / Object.keys(letterCounts).length;
  const repetitionScore = Math.max(0, 10 - (avgRepetition - 1) * 2); // Less repetition = harder
  
  // Factor 7: Bible book difficulty (some books are inherently harder)
  const bookDifficultyScore = getBookDifficulty(reference);
  
  // Calculate weighted total difficulty
  const totalDifficulty = (
    wordCountScore * 1.5 +           // Word count weight
    charCountScore * 1.2 +           // Character count weight  
    letterDiversityScore * 2.0 +     // Letter diversity weight (most important)
    avgWordLengthScore * 1.3 +       // Average word length weight
    uncommonLetterScore * 1.8 +      // Uncommon letters weight
    repetitionScore * 1.0 +          // Repetition weight
    bookDifficultyScore * 0.8        // Book difficulty weight
  ) / 9.6; // Normalize to 0-10 scale
  
  return Math.round(totalDifficulty * 10) / 10; // Round to 1 decimal place
};

// Rate difficulty of different Bible books
export const getBookDifficulty = (reference) => {
  if (!reference) return 5; // Default medium difficulty
  
  const book = reference.toLowerCase();
  
  // Easy books (familiar, simple language)
  if (book.includes('psalm') || book.includes('proverb') || book.includes('john') || 
      book.includes('mark') || book.includes('luke') || book.includes('matthew')) {
    return 3;
  }
  
  // Medium books
  if (book.includes('genesis') || book.includes('exodus') || book.includes('acts') || 
      book.includes('romans') || book.includes('corinthians') || book.includes('james')) {
    return 5;
  }
  
  // Hard books (complex theology, unusual names, historical context)
  if (book.includes('leviticus') || book.includes('deuteronomy') || book.includes('chronicles') || 
      book.includes('ezekiel') || book.includes('revelation') || book.includes('hebrews')) {
    return 8;
  }
  
  // Default medium difficulty
  return 5;
};

// Get difficulty level name
export const getDifficultyLevel = (score) => {
  if (score <= 2) return { name: 'Beginner', color: '#4CAF50' };
  if (score <= 4) return { name: 'Easy', color: '#8BC34A' };
  if (score <= 6) return { name: 'Medium', color: '#FFC107' };
  if (score <= 8) return { name: 'Hard', color: '#FF9800' };
  return { name: 'Expert', color: '#F44336' };
};

// Group verses by difficulty level
export const groupVersesByDifficulty = (verses) => {
  const groups = {
    beginner: [],
    easy: [],
    medium: [],
    hard: [],
    expert: []
  };
  
  verses.forEach(verse => {
    const difficulty = calculateVerseDifficulty(verse.text, verse.reference);
    const level = getDifficultyLevel(difficulty);
    
    verse.difficulty = difficulty;
    verse.difficultyLevel = level;
    
    if (difficulty <= 2) groups.beginner.push(verse);
    else if (difficulty <= 4) groups.easy.push(verse);
    else if (difficulty <= 6) groups.medium.push(verse);
    else if (difficulty <= 8) groups.hard.push(verse);
    else groups.expert.push(verse);
  });
  
  return groups;
};

// Create a level progression system
export const createLevelProgression = (playerScore) => {
  const levels = [
    { name: 'New Believer', minScore: 0, maxScore: 100, difficulty: 'beginner' },
    { name: 'Growing Christian', minScore: 101, maxScore: 300, difficulty: 'easy' },
    { name: 'Mature Believer', minScore: 301, maxScore: 600, difficulty: 'medium' },
    { name: 'Bible Scholar', minScore: 601, maxScore: 1000, difficulty: 'hard' },
    { name: 'Theology Expert', minScore: 1001, maxScore: Infinity, difficulty: 'expert' }
  ];
  
  const currentLevel = levels.find(level => 
    playerScore >= level.minScore && playerScore <= level.maxScore
  ) || levels[0];
  
  const nextLevel = levels.find(level => level.minScore > playerScore);
  
  return {
    current: currentLevel,
    next: nextLevel,
    progress: nextLevel ? 
      ((playerScore - currentLevel.minScore) / (nextLevel.minScore - currentLevel.minScore)) * 100 : 
      100
  };
};

// Sample Bible verses with difficulty ratings (could be expanded into a database)
export const sampleBibleVerses = [
  {
    reference: "John 3:16",
    text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
    translation: "NIV"
  },
  {
    reference: "Psalm 23:1",
    text: "The Lord is my shepherd, I lack nothing.",
    translation: "NIV"
  },
  {
    reference: "Romans 8:28",
    text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
    translation: "NIV"
  },
  {
    reference: "Philippians 4:13",
    text: "I can do all this through him who gives me strength.",
    translation: "NIV"
  },
  {
    reference: "Jeremiah 29:11",
    text: "For I know the plans I have for you declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",
    translation: "NIV"
  },
  {
    reference: "Matthew 28:19-20",
    text: "Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, and teaching them to obey everything I have commanded you.",
    translation: "NIV"
  },
  {
    reference: "Ephesians 2:8-9",
    text: "For it is by grace you have been saved, through faith and this is not from yourselves, it is the gift of God not by works, so that no one can boast.",
    translation: "NIV"
  },
  {
    reference: "1 Corinthians 13:4-7",
    text: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs.",
    translation: "NIV"
  }
];

// Calculate difficulty for all sample verses
export const getSampleVersesWithDifficulty = () => {
  return sampleBibleVerses.map(verse => ({
    ...verse,
    difficulty: calculateVerseDifficulty(verse.text, verse.reference),
    difficultyLevel: getDifficultyLevel(calculateVerseDifficulty(verse.text, verse.reference))
  }));
};