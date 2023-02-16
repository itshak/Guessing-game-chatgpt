import React, { useState, useEffect } from 'react'

function App() {
	const [gameStarted, setGameStarted] = useState(false)
	const [numDigits, setNumDigits] = useState(4)
	const [numSymbols, setNumSymbols] = useState(10)
	const [symbols, setSymbols] = useState([])
	const [secretNumber, setSecretNumber] = useState('')
	const [guess, setGuess] = useState('')
	const [numAttempts, setNumAttempts] = useState(0)
	const [guesses, setGuesses] = useState([])
	const [gameOver, setGameOver] = useState(false)

	// Generate a random integer between min and max (inclusive)
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min
	}

	// Create an array of symbols based on numSymbols
	useEffect(() => {
		const allSymbols = '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*'
		const symbolList = allSymbols.split('').slice(0, numSymbols)
		setSymbols(symbolList)
	}, [numSymbols])

	// Start a new game
	function startGame() {
		// Generate a random secret number with numDigits digits
		let newSecretNumber = ''
		for (let i = 0; i < numDigits; i++) {
			const symbolIndex = getRandomInt(0, numSymbols - 1)
			newSecretNumber += symbols[symbolIndex]
		}
		setSecretNumber(newSecretNumber)
		setGameStarted(true)
	}

	// Handle input change for guess
	function handleGuessChange(event) {
		setGuess(event.target.value)
	}

	// Handle guess submission
	function handleGuessSubmit(event) {
		event.preventDefault()
		// Check the guess against the secret number
		let matchingDigits = 0
		let matchingPositions = 0
		for (let i = 0; i < numDigits; i++) {
			const guessChar = guess.charAt(i)
			if (secretNumber.includes(guessChar)) {
				matchingDigits++
			}
			if (secretNumber.charAt(i) === guessChar) {
				matchingPositions++
			}
		}
		setGuesses([...guesses, [guess, matchingDigits, matchingPositions]])
		setNumAttempts(numAttempts + 1)
		if (matchingPositions === numDigits) {
			setGameOver(true)
		} else {
			setGuess('')
		}
	}

	// Resign the game
	function handleResign() {
		setGameOver(true)
	}

	// Reset the game
	function resetGame() {
		setGameStarted(false)
		setSecretNumber('')
		setGuess('')
		setNumAttempts(0)
		setGuesses([])
		setGameOver(false)
	}

	// Render the game settings
	const gameSettings = (
		<div>
			<h2>Game Settings</h2>
			<form>
				<label htmlFor='numDigits'>Number of digits (1-20):</label>
				<input
					type='number'
					id='numDigits'
					name='numDigits'
					min='1'
					max='20'
					value={numDigits}
					onChange={(event) => setNumDigits(parseInt(event.target.value))}
				/>
				<br />
				<label htmlFor='numSymbols'>Number of symbols (1-36):</label>
				<input
					type='number'
					id='numSymbols'
					name='numSymbols'
					min='1'
					max='36'
					value={numSymbols}
					onChange={(event) => setNumSymbols(parseInt(event.target.value))}
				/>
				<br />
				<button onClick={startGame}>Start Game</button>
			</form>
		</div>
	)

	// Render the game board
	const gameBoard = (
		<div>
			<h2>Guess the Number</h2>
			<p>Number of attempts: {numAttempts}</p>
			<p>Available symbols: {symbols.join(', ')}</p>
			<form onSubmit={handleGuessSubmit}>
				<label htmlFor='guessInput'>Enter your {numDigits}-digit guess:</label>
				<input
					type='text'
					id='guessInput'
					name='guessInput'
					maxLength={numDigits}
					value={guess}
					onChange={handleGuessChange}
				/>
				<button type='submit'>Guess</button>
				<button onClick={handleResign}>Resign</button>
			</form>
			<h3>Guess History</h3>
			<table>
				<thead>
					<tr>
						<th>Guess</th>
						<th>Matching Digits</th>
						<th>Matching Positions</th>
					</tr>
				</thead>
				<tbody>
					{guesses.map((guessData, index) => (
						<tr key={index}>
							<td>{guessData[0]}</td>
							<td>{guessData[1]}</td>
							<td>{guessData[2]}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)

	return (
		<div>
			{gameStarted ? gameBoard : gameSettings}
			{gameOver && (
				<div>
					<h2>Game Over</h2>
					<p>Secret number was: {secretNumber}</p>
					<button onClick={resetGame}>Play Again</button>
				</div>
			)}
		</div>
	)
}

export default App
