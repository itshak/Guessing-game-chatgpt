import React, { useState } from 'react'

function App() {
	const [wordLength, setWordLength] = useState(4)
	const [numSymbols, setNumSymbols] = useState(10)
	const [secretWord, setSecretWord] = useState(
		generateSecretWord(wordLength, numSymbols)
	)
	const [guess, setGuess] = useState('')
	const [guesses, setGuesses] = useState([])
	const [results, setResults] = useState([])
	const [score, setScore] = useState(0)
	const [gameOver, setGameOver] = useState(false)

	function generateSecretWord(length, numSymbols) {
		let symbols = '0123456789'
		for (let i = 97; i <= 122 && symbols.length < numSymbols; i++) {
			symbols += String.fromCharCode(i)
		}
		for (let i = 65; i <= 90 && symbols.length < numSymbols; i++) {
			symbols += String.fromCharCode(i)
		}
		const secret = []
		while (secret.length < length) {
			const symbol = symbols[Math.floor(Math.random() * symbols.length)]
			if (!secret.includes(symbol)) {
				secret.push(symbol)
			}
		}
		return secret.join('')
	}

	function submitSettings() {
		if (numSymbols >= wordLength) {
			setSecretWord(generateSecretWord(wordLength, numSymbols))
			setGuess('')
			setGuesses([])
			setResults([])
			setScore(0)
			setGameOver(false)
		}
	}

	function submitGuess() {
		if (guess.length === wordLength) {
			const correctSymbols = []
			const correctPositions = []
			for (let i = 0; i < wordLength; i++) {
				if (guess[i] === secretWord[i]) {
					correctPositions.push(i)
				} else if (
					secretWord.includes(guess[i]) &&
					!correctPositions.includes(i)
				) {
					correctSymbols.push(i)
				}
			}
			setGuesses([...guesses, guess])
			setResults([
				...results,
				{
					correctSymbols: correctSymbols.length,
					correctPositions: correctPositions.length,
				},
			])
			setGuess('')
			if (correctPositions.length === wordLength) {
				setScore(guesses.length + 1)
				setGameOver(true)
			}
		}
	}

	function resign() {
		setGameOver(true)
	}

	function tryAgain() {
		setSecretWord(generateSecretWord(wordLength, numSymbols))
		setGuess('')
		setGuesses([])
		setResults([])
		setScore(0)
		setGameOver(false)
	}

	return (
		<div className='App'>
			{gameOver ? (
				<div className='game-over-screen'>
					<h2>{score === 0 ? 'Resigned' : 'You win!'}</h2>
					<p>Secret word: {secretWord}</p>
					<p>Score: {score}</p>
					<button onClick={tryAgain}>Try again</button>
				</div>
			) : (
				<div>
					<h2>Guess the word</h2>
					<div className='settings'>
						<label htmlFor='word-length-slider'>
							Word length: {wordLength}
						</label>
						<input
							id='word-length-slider'
							type='range'
							min='1'
							max='20'
							step='1'
							value={wordLength}
							onChange={(event) => setWordLength(Number(event.target.value))}
						/>
						<label htmlFor='num-symbols-slider'>
							Number of symbols: {numSymbols}
						</label>
						<input
							id='num-symbols-slider'
							type='range'
							min='10'
							max='62'
							step='1'
							value={numSymbols}
							onChange={(event) => setNumSymbols(Number(event.target.value))}
						/>
						<button onClick={submitSettings}>Submit</button>
					</div>
					<div className='guesses'>
						<ul>
							{guesses.map((guess, index) => (
								<li key={index}>
									{guess} - {results[index].correctSymbols} correct symbol
									{results[index].correctSymbols !== 1 && 's'},{' '}
									{results[index].correctPositions} correct position
									{results[index].correctPositions !== 1 && 's'}
								</li>
							))}
						</ul>
					</div>
					<div className='input'>
						<input
							type='text'
							maxLength={wordLength}
							value={guess}
							onChange={(event) => setGuess(event.target.value)}
						/>
						<button onClick={submitGuess}>Guess</button>
						<button onClick={resign}>Resign</button>
					</div>
					<p>
						Symbols in the game:{' '}
						{numSymbols <= 10
							? '0123456789'
							: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.substring(
									0,
									numSymbols
							  )}
					</p>
				</div>
			)}
		</div>
	)
}

export default App
