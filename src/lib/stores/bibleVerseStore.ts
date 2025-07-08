import { writable } from 'svelte/store';

export interface DifficultyRating {
	score: number;
	level: string;
	description: string;
	factors: {
		wordCount: number;
		charCount: number;
		letterDiversity: number;
		avgWordLength: number;
		uncommonLetters: number;
		repetition: number;
		bookDifficulty: number;
	};
}

export interface BibleVerse {
	reference: string;
	text: string;
	translation: string;
}

export interface VerseState {
	currentVerse: BibleVerse | null;
	wordBank: string[];
	loading: boolean;
	error: string | null;
	currentDifficulty: DifficultyRating | null;
	playerLevel: number;
	availableVerses: Array<{ verse: BibleVerse; difficulty: DifficultyRating }>;
}

// Comprehensive Bible verses with different difficulty levels
const BIBLE_VERSES = [
	// Beginner Level (1-3)
	{ reference: "John 3:16", text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.", translation: "NIV" },
	{ reference: "Psalm 23:1", text: "The Lord is my shepherd, I lack nothing.", translation: "NIV" },
	{ reference: "John 14:6", text: "Jesus answered, I am the way and the truth and the life. No one comes to the Father except through me.", translation: "NIV" },
	{ reference: "Romans 3:23", text: "For all have sinned and fall short of the glory of God.", translation: "NIV" },
	{ reference: "1 John 4:8", text: "Whoever does not love does not know God, because God is love.", translation: "NIV" },
	
	// Intermediate Level (4-6)
	{ reference: "Romans 8:28", text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.", translation: "NIV" },
	{ reference: "Philippians 4:13", text: "I can do all this through him who gives me strength.", translation: "NIV" },
	{ reference: "Jeremiah 29:11", text: "For I know the plans I have for you declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.", translation: "NIV" },
	{ reference: "Matthew 28:19", text: "Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.", translation: "NIV" },
	{ reference: "1 Corinthians 13:4", text: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud.", translation: "NIV" },
	
	// Advanced Level (7-8)
	{ reference: "Ephesians 2:8-9", text: "For it is by grace you have been saved, through faith and this is not from yourselves, it is the gift of God not by works, so that no one can boast.", translation: "NIV" },
	{ reference: "Romans 12:2", text: "Do not conform to the pattern of this world, but be transformed by the renewing of your mind. Then you will be able to test and approve what Gods will is his good, pleasing and perfect will.", translation: "NIV" },
	{ reference: "Hebrews 11:1", text: "Now faith is confidence in what we hope for and assurance about what we do not see.", translation: "NIV" },
	{ reference: "2 Timothy 3:16", text: "All Scripture is God breathed and is useful for teaching, rebuking, correcting and training in righteousness.", translation: "NIV" },
	
	// Expert Level (9-10)
	{ reference: "1 Thessalonians 5:16-18", text: "Rejoice always, pray continually, give thanks in all circumstances; for this is Gods will for you in Christ Jesus.", translation: "NIV" },
	{ reference: "Revelation 3:20", text: "Here I am! I stand at the door and knock. If anyone hears my voice and opens the door, I will come in and eat with that person, and they with me.", translation: "NIV" },
	{ reference: "Isaiah 55:8-9", text: "For my thoughts are not your thoughts, neither are your ways my ways, declares the Lord. As the heavens are higher than the earth, so are my ways higher than your ways and my thoughts than your thoughts.", translation: "NIV" },
	{ reference: "Romans 1:16", text: "For I am not ashamed of the gospel, because it is the power of God that brings salvation to everyone who believes: first to the Jew, then to the Gentile.", translation: "NIV" }
];

// Bible book difficulty ratings (based on vocabulary complexity and themes)
const BOOK_DIFFICULTY: Record<string, number> = {
	'Genesis': 3, 'Exodus': 4, 'Leviticus': 7, 'Numbers': 6, 'Deuteronomy': 6,
	'Joshua': 4, 'Judges': 5, 'Ruth': 3, '1 Samuel': 4, '2 Samuel': 4,
	'1 Kings': 5, '2 Kings': 5, '1 Chronicles': 6, '2 Chronicles': 6,
	'Ezra': 6, 'Nehemiah': 5, 'Esther': 4, 'Job': 8, 'Psalms': 4,
	'Proverbs': 6, 'Ecclesiastes': 7, 'Song of Solomon': 6, 'Isaiah': 7,
	'Jeremiah': 7, 'Lamentations': 7, 'Ezekiel': 8, 'Daniel': 6,
	'Hosea': 7, 'Joel': 6, 'Amos': 6, 'Obadiah': 6, 'Jonah': 4,
	'Micah': 6, 'Nahum': 6, 'Habakkuk': 7, 'Zephaniah': 6, 'Haggai': 6,
	'Zechariah': 7, 'Malachi': 6, 'Matthew': 4, 'Mark': 3, 'Luke': 4,
	'John': 3, 'Acts': 5, 'Romans': 6, '1 Corinthians': 5, '2 Corinthians': 6,
	'Galatians': 6, 'Ephesians': 6, 'Philippians': 5, 'Colossians': 6,
	'1 Thessalonians': 5, '2 Thessalonians': 5, '1 Timothy': 5, '2 Timothy': 5,
	'Titus': 5, 'Philemon': 4, 'Hebrews': 7, 'James': 5, '1 Peter': 5,
	'2 Peter': 6, '1 John': 4, '2 John': 4, '3 John': 4, 'Jude': 6,
	'Revelation': 8
};

function calculateVerseDifficulty(verse: BibleVerse): DifficultyRating {
	const cleanText = verse.text.replace(/[^\w\s]/g, '').toLowerCase();
	const words = cleanText.split(/\s+/).filter(word => word.length > 0);
	
	// Factor 1: Word count (more words = harder)
	const wordCount = words.length;
	const wordCountScore = Math.min(wordCount / 8, 10); // Scale by 8 words
	
	// Factor 2: Character count (longer = harder)
	const charCount = cleanText.replace(/\s/g, '').length;
	const charCountScore = Math.min(charCount / 30, 10); // Scale by 30 chars
	
	// Factor 3: Unique letter diversity (more unique letters = harder)
	const uniqueLetters = new Set(cleanText.replace(/\s/g, '').split(''));
	const letterDiversity = Math.min(uniqueLetters.size / 2.6, 10); // Scale by 26 letters
	
	// Factor 4: Average word length (longer words = harder)
	const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
	const avgWordLengthScore = Math.min(avgWordLength / 0.8, 10); // Scale by 8 average
	
	// Factor 5: Uncommon letters (Q, X, Z, J, etc. = harder)
	const uncommonLetters = ['q', 'x', 'z', 'j', 'k', 'v', 'w', 'y'];
	const uncommonCount = cleanText.split('').filter(char => uncommonLetters.includes(char)).length;
	const uncommonLettersScore = Math.min(uncommonCount / 3, 10); // Scale by 3 uncommon
	
	// Factor 6: Letter repetition (less repetition = harder to form words)
	const letterCounts: Record<string, number> = {};
	cleanText.replace(/\s/g, '').split('').forEach(char => {
		letterCounts[char] = (letterCounts[char] || 0) + 1;
	});
	const avgRepetition = Object.values(letterCounts).reduce((sum, count) => sum + count, 0) / Object.keys(letterCounts).length;
	const repetitionScore = Math.max(0, 10 - (avgRepetition / 2)); // Inverse: less repetition = harder
	
	// Factor 7: Bible book difficulty
	const bookName = verse.reference.split(' ')[0];
	const fullBookName = verse.reference.split(/\s+/).slice(0, verse.reference.split(' ').length > 2 && /^\d/.test(verse.reference.split(' ')[1]) ? 2 : 1).join(' ');
	const bookDifficulty = BOOK_DIFFICULTY[fullBookName] || BOOK_DIFFICULTY[bookName] || 5;
	
	// Calculate weighted total (out of 70, then scale to 10)
	const totalScore = (
		wordCountScore * 1.2 +      // 12 points max
		charCountScore * 1.1 +      // 11 points max
		letterDiversity * 1.0 +     // 10 points max
		avgWordLengthScore * 1.1 +  // 11 points max
		uncommonLettersScore * 0.8 + // 8 points max
		repetitionScore * 0.9 +     // 9 points max
		(bookDifficulty / 1.1)      // ~9 points max
	) / 7; // Average of all factors
	
	// Determine level based on score
	let level: string;
	let description: string;
	
	if (totalScore <= 2) {
		level = "Beginner";
		description = "Simple words, short verses, perfect for starting your journey";
	} else if (totalScore <= 4) {
		level = "Easy";
		description = "Familiar verses with common words and clear meaning";
	} else if (totalScore <= 6) {
		level = "Intermediate";
		description = "Moderate length with some challenging vocabulary";
	} else if (totalScore <= 8) {
		level = "Advanced";
		description = "Complex verses requiring strong word formation skills";
	} else {
		level = "Expert";
		description = "Master level with intricate word patterns and deep theology";
	}
	
	return {
		score: Math.round(totalScore * 10) / 10,
		level,
		description,
		factors: {
			wordCount,
			charCount,
			letterDiversity: uniqueLetters.size,
			avgWordLength: Math.round(avgWordLength * 10) / 10,
			uncommonLetters: uncommonCount,
			repetition: Math.round(avgRepetition * 10) / 10,
			bookDifficulty
		}
	};
}

function extractWordsFromVerse(text: string): string[] {
	return text
		.replace(/[^\w\s]/g, ' ')
		.split(/\s+/)
		.filter(word => word.length >= 3)
		.map(word => word.toUpperCase())
		.filter((word, index, arr) => arr.indexOf(word) === index); // Remove duplicates
}

function createLevelProgression(score: number): number {
	// Level progression based on score
	if (score < 1000) return 1;
	if (score < 2500) return 2;
	if (score < 5000) return 3;
	if (score < 8000) return 4;
	if (score < 12000) return 5;
	if (score < 17000) return 6;
	if (score < 23000) return 7;
	if (score < 30000) return 8;
	if (score < 40000) return 9;
	return 10;
}

function createBibleVerseStore() {
	const { subscribe, set, update } = writable<VerseState>({
		currentVerse: null,
		wordBank: [],
		loading: false,
		error: null,
		currentDifficulty: null,
		playerLevel: 1,
		availableVerses: []
	});

	// Pre-calculate verse difficulties
	const versesWithDifficulty = BIBLE_VERSES.map(verse => ({
		verse,
		difficulty: calculateVerseDifficulty(verse)
	}));

	return {
		subscribe,

		fetchNewVerse: (targetLevel?: number) => {
			update(state => {
				state.loading = true;
				state.error = null;
				return state;
			});

			try {
				// If no target level specified, use random verse
				let selectedVerse;
				
				if (targetLevel) {
					// Filter verses by difficulty level
					const suitableVerses = versesWithDifficulty.filter(v => {
						const difficultyLevel = Math.ceil(v.difficulty.score / 2);
						return difficultyLevel >= targetLevel - 1 && difficultyLevel <= targetLevel + 1;
					});
					
					selectedVerse = suitableVerses.length > 0 
						? suitableVerses[Math.floor(Math.random() * suitableVerses.length)]
						: versesWithDifficulty[Math.floor(Math.random() * versesWithDifficulty.length)];
				} else {
					selectedVerse = versesWithDifficulty[Math.floor(Math.random() * versesWithDifficulty.length)];
				}

				const words = extractWordsFromVerse(selectedVerse.verse.text);

				update(state => {
					state.currentVerse = selectedVerse.verse;
					state.wordBank = words;
					state.currentDifficulty = selectedVerse.difficulty;
					state.loading = false;
					state.availableVerses = versesWithDifficulty;
					return state;
				});

			} catch (error) {
				update(state => {
					state.error = error instanceof Error ? error.message : 'Failed to fetch verse';
					state.loading = false;
					return state;
				});
			}
		},

		fetchVerseByLevel: (level: number) => {
			const store = createBibleVerseStore();
			store.fetchNewVerse(level);
			return store;
		},

		updatePlayerLevel: (score: number) => {
			update(state => {
				state.playerLevel = createLevelProgression(score);
				return state;
			});
		},

		// API integration for external Bible verses (future enhancement)
		fetchFromAPI: async (reference?: string) => {
			update(state => {
				state.loading = true;
				state.error = null;
				return state;
			});

			try {
				// This could be connected to bible-api.com or other Bible APIs
				const apiUrl = reference 
					? `https://bible-api.com/${reference}`
					: 'https://bible-api.com/john+3:16';
				
				const response = await fetch(apiUrl);
				const data = await response.json();

				if (data && data.text) {
					const verse: BibleVerse = {
						reference: data.reference,
						text: data.text,
						translation: data.translation_id || 'KJV'
					};

					const difficulty = calculateVerseDifficulty(verse);
					const words = extractWordsFromVerse(verse.text);

					update(state => {
						state.currentVerse = verse;
						state.wordBank = words;
						state.currentDifficulty = difficulty;
						state.loading = false;
						return state;
					});
				} else {
					throw new Error('Invalid verse data received');
				}

			} catch (error) {
				console.error('API fetch failed, using fallback:', error);
				// Fallback to local verses
				update(state => {
					const fallbackVerse = versesWithDifficulty[0];
					state.currentVerse = fallbackVerse.verse;
					state.wordBank = extractWordsFromVerse(fallbackVerse.verse.text);
					state.currentDifficulty = fallbackVerse.difficulty;
					state.loading = false;
					state.error = 'Using offline verse';
					return state;
				});
			}
		}
	};
}

export const bibleVerseStore = createBibleVerseStore();