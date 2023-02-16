import React, { useState } from 'react'

const SYMBOLS =
	'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+'

function generateSecretWord(wordLength, symbolCount) {
	const allSymbols = SYMBOLS.substring(0, symbolCount)
	const symbols = []
	while (symbols.length < wordLength) {
		const symbol = allSymbols.charAt(
			Math.floor(Math.random() * allSymbols.length)
		)
		if (!symbols.includes(symbol)) {
			symbols.push(symbol)
		}
	}
	return symbols.join('')
}

function calculateCorrect(guess, secretWord) {
	let correct = 0
	for (let i = 0; i < secretWord.length; i++) {
		if (guess.includes(secretWord.charAt(i))) {
			correct++
		}
	}
	return correct
}

function calculateCorrectlyPositioned(guess, secretWord) {
	let correctlyPositioned = 0
	for (let i = 0; i < secretWord.length; i++) {
		if (guess.charAt(i) === secretWord.charAt(i)) {
			correctlyPositioned++
		}
	}
	return correctlyPositioned
}

function GuessingGame() {
	const [wordLength, setWordLength] = useState(4)
	const [symbolCount, setSymbolCount] = useState(10)
	const [secretWord, setSecretWord] = useState(
		generateSecretWord(wordLength, symbolCount)
	)
	const [guess, setGuess] = useState('')
	const [guesses, setGuesses] = useState([])
	const [gameOver, setGameOver] = useState(false)
	const [score, setScore] = useState(0)
	const [message, setMessage] = useState('')

	function handleWordLengthChange(event) {
		setWordLength(parseInt(event.target.value))
	}

	function handleSymbolCountChange(event) {
		setSymbolCount(parseInt(event.target.value))
	}

	function handleSettingsSubmit(event) {
		event.preventDefault()
		if (symbolCount >= wordLength) {
			setSecretWord(generateSecretWord(wordLength, symbolCount))
			setGuess('')
			setGuesses([])
			setGameOver(false)
			setScore(0)
			setMessage('')
		}
	}

	function handleGuessChange(event) {
		setGuess(event.target.value.substring(0, wordLength))
	}

	function handleGuessSubmit(event) {
		event.preventDefault()
		if (guess.length === wordLength) {
			const correct = calculateCorrect(guess, secretWord)
			const correctlyPositioned = calculateCorrectlyPositioned(
				guess,
				secretWord
			)
			setGuesses([...guesses, { guess, correct, correctlyPositioned }])
			if (guess === secretWord) {
				setGameOver(true)
				setMessage(`You win in ${guesses.length + 1} guesses!`)
			} else {
				setGuess('')
				setScore(score + 1)
			}
		}
	}

	function handleResignClick() {
		setGameOver(true)
		setMessage(
			`The secret word was ${secretWord}. You lost after ${guesses.length} guesses.`
		)
	}

	function handleTryAgainClick() {
		setWordLength(4)
		setSymbolCount(10)
		setSecretWord(generateSecretWord(4, 10))
		setGuess('')
		setGuesses([])
		setGameOver(false)
		setScore(0)
		setMessage('')
	}

	return (
		<div>
			{gameOver ? (
				<div>
					<p>{message}</p>
					<button onClick={handleTryAgainClick}>Try Again</button>
				</div>
			) : (
				<div>
					<p>Score: {score}</p>
					<form onSubmit={handleGuessSubmit}>
						<label>
							Guess:
							<input
								type='text'
								value={guess}
								onChange={handleGuessChange}
							/>
						</label>
						<button type='submit'>Guess</button>
					</form>
					<ul>
						{guesses.map((item, index) => (
							<li key={index}>
								{item.guess} - correct: {item.correct}, correctly positioned:{' '}
								{item.correctlyPositioned}
							</li>
						))}
					</ul>
					<button onClick={handleResignClick}>Resign</button>
				</div>
			)}
			{!gameOver && (
				<div>
					<p>Settings</p>
					<form onSubmit={handleSettingsSubmit}>
						<label>
							Word Length:
							<input
								type='number'
								min='1'
								max='20'
								value={wordLength}
								onChange={handleWordLengthChange}
							/>
						</label>
						<br />
						<label>
							Symbol Count:
							<input
								type='number'
								min='1'
								max='62'
								value={symbolCount}
								onChange={handleSymbolCountChange}
							/>
						</label>
						<br />
						<button type='submit'>Submit</button>
					</form>
					<p>Symbols in use: {SYMBOLS.substring(0, symbolCount)}</p>
				</div>
			)}
		</div>
	)
}

export default GuessingGame
