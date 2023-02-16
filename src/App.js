import React, { useState } from 'react'

function App() {
	const [gameStarted, setGameStarted] = useState(false)
	const [gameOver, setGameOver] = useState(false)
	const [numDigits, setNumDigits] = useState(4)
	const [numSymbols, setNumSymbols] = useState(10)
	const [secretNumber, setSecretNumber] = useState(
		generateSecretNumber(numDigits, numSymbols)
	)
	const [guess, setGuess] = useState('')
	const [numAttempts, setNumAttempts] = useState(0)
	const [guesses, setGuesses] = useState([])
	const symbols = generateSymbols(numSymbols)

	function generateSymbols(numSymbols) {
		const symbols = []
		for (let i = 0; i < numSymbols && i < 36; i++) {
			symbols.push(getSymbol(i))
		}
		return symbols
	}

	function getSymbol(num) {
		if (num < 10) {
			return num.toString()
		} else {
			return String.fromCharCode('A'.charCodeAt(0) + num - 10)
		}
	}

	function generateSecretNumber(numDigits, numSymbols) {
		let secretNumber = ''
		for (let i = 0; i < numDigits; i++) {
			secretNumber += getSymbol(Math.floor(Math.random() * numSymbols))
		}
		return secretNumber
	}

	function startGame(e) {
		e.preventDefault()
		setSecretNumber(generateSecretNumber(numDigits, numSymbols))
		setGameStarted(true)
	}

	function handleGuessChange(e) {
		setGuess(e.target.value.toUpperCase())
	}

	function handleGuessSubmit(e) {
		e.preventDefault()
		const matchingDigits = countMatchingDigits(guess, secretNumber)
		const matchingPositions = countMatchingPositions(guess, secretNumber)
		setGuesses([...guesses, [guess, matchingDigits, matchingPositions]])
		setNumAttempts(numAttempts + 1)
		if (matchingPositions === numDigits) {
			setGameOver(true)
		}
		setGuess('')
	}

	function handleResign() {
		setGameOver(true)
	}

	function resetGame() {
		setGameStarted(false)
		setGameOver(false)
		setSecretNumber(generateSecretNumber(numDigits, numSymbols))
		setGuess('')
		setNumAttempts(0)
		setGuesses([])
	}

	function countMatchingDigits(guess, secret) {
		const guessDigits = guess.split('')
		const secretDigits = secret.split('')
		let count = 0
		const alreadyCounted = new Set()
		for (let digit of guessDigits) {
			if (secretDigits.includes(digit) && !alreadyCounted.has(digit)) {
				count++
				alreadyCounted.add(digit)
			}
		}
		return count
	}

	function countMatchingPositions(guess, secret) {
		let count = 0
		for (let i = 0; i < guess.length; i++) {
			if (guess[i] === secret[i]) {
				count++
			}
		}
		return count
	}

	// Render the game settings
	const gameSettings = (
		<div>
			<h2>Game Settings</h2>
			<form onSubmit={startGame}>
				<div>
					<label htmlFor='numDigits'>Number of Digits:</label>
					<input
						type='number'
						id='numDigits'
						name='numDigits'
						min='1'
						max='20'
						value={numDigits}
						onChange={(e) => setNumDigits(parseInt(e.target.value))}
					/>
				</div>
				<div>
					<label htmlFor='numSymbols'>Number of Symbols:</label>
					<input
						type='number'
						id='numSymbols'
						name='numSymbols'
						min='1'
						max='36'
						value={numSymbols}
						onChange={(e) => setNumSymbols(parseInt(e.target.value))}
					/>
				</div>
				<button type='submit'>Start Game</button>
			</form>
		</div>
	)

	// Render the game board
	const gameBoard = (
		<div>
			<h2>Guess the Number</h2>
			<p>
				Enter a {numDigits}-digit number using the symbols {symbols.join(', ')}
			</p>
			<form onSubmit={handleGuessSubmit}>
				<input
					type='text'
					pattern={`[${symbols.join('')}]{${numDigits}}`}
					maxLength={numDigits}
					value={guess}
					onChange={handleGuessChange}
				/>
				<button type='submit'>Guess</button>
			</form>
			<button onClick={handleResign}>Resign</button>
			<h3>Guesses</h3>
			<table>
				<thead>
					<tr>
						<th>Guess</th>
						<th>Matching Digits</th>
						<th>Matching Positions</th>
					</tr>
				</thead>
				<tbody>
					{guesses.map((guess, index) => (
						<tr key={index}>
							<td>{guess[0]}</td>
							<td>{guess[1]}</td>
							<td>{guess[2]}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)

	// Render the game over screen
	const gameOverScreen = (
		<div>
			<h2>Game Over</h2>
			<p>{gameOverMessage(numAttempts)}</p>
			<p>The secret number was {secretNumber}</p>
			<button onClick={resetGame}>Play Again</button>
		</div>
	)

	return (
		<div className='App'>
			{!gameStarted && gameSettings}
			{gameStarted && !gameOver && gameBoard}
			{gameOver && gameOverScreen}
		</div>
	)
}

function gameOverMessage(numAttempts) {
	if (numAttempts === 1) {
		return 'You guessed the number in 1 attempt!'
	} else {
		return `You guessed the number in ${numAttempts} attempts.`
	}
}

export default App
