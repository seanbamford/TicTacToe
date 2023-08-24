import { useState } from 'react'
import './App.css'

function Game() {
	const [history, setHistory] = useState<Array<Array<string | null>>>([Array(9).fill(null)])
	const [currentMove, setCurrentMove] = useState(0)
	const xIsNext: boolean = currentMove % 2 === 0
	const currentSquares: Array<string | null> = history[currentMove]
	const [isAscending, setIsAscending] = useState<boolean>(true)
	interface Coordinates {
		row: number | undefined
		column: number | undefined
	}
	function handlePlay(nextSquares: Array<string | null>) {
		const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
		setHistory(nextHistory)
		setCurrentMove(nextHistory.length - 1)
	}

	function jumpTo(nextMove: number) {
		setCurrentMove(nextMove)
	}
	function getCoordinates(now: Array<string | null>, prev?: Array<string | null>): Coordinates {
		let index: number | null
		if (prev) {
			index = now.findIndex((element: string | null, idx: number) => element !== prev[idx])
		} else {
			index = now.findIndex((element: string | null) => element && true)
		}
		const row = Math.floor(index / 3) + 1
		const column = (index % 3) + 1

		return { row, column }
	}
	const moves = history.map((move: Array<string | null>) => {
		let description: string
		const coordinates: Coordinates = getCoordinates(move, history[history.indexOf(move) - 1])
		const location: string = ' (Row: ' + coordinates.row + ' Column: ' + coordinates.column + ')'
		const i = history.indexOf(move)
		if (i != 0) {
			description = 'Go to move #' + Number(history.indexOf(move) + 1) + '.' + location
		} else {
			description = 'Go to game start.'
		}
		if (history[currentMove] !== move || currentMove == 0) {
			return (
				<li key={i}>
					<button onClick={() => jumpTo(i)}>{description}</button>
				</li>
			)
		} else {
			return <div key={i}>{'You are at move #' + (currentMove + 1) + '.'}</div>
		}
	})

	function handleSort() {
		setIsAscending(!isAscending)
	}

	const sortedMoves: JSX.Element[] = isAscending ? [...moves] : [...moves].reverse()

	return (
		<div className='game'>
			<div className='game-board'>
				<Board xIsNext={xIsNext} squares={currentSquares} moveNumber={currentMove} onPlay={handlePlay} />
			</div>
			<div className='game-info'>
				{sortedMoves.length > 1 ? <div className='status'>Move List</div> : ''}
				{sortedMoves.length > 1 ? <button onClick={handleSort}>Sort Moves</button> : ''}
				{sortedMoves.length > 1 ? <ol>{sortedMoves}</ol> : ''}
			</div>
		</div>
	)
}

function Square({ value, onSquareClick, isWin }: { value: string | null; onSquareClick: () => void; isWin: boolean }) {
	const classNames = 'square' + (isWin ? ' win' : '')
	return (
		<button className={classNames} onClick={onSquareClick}>
			{value}
		</button>
	)
}

function Board({
	xIsNext,
	squares,
	moveNumber,
	onPlay,
}: {
	xIsNext: boolean
	squares: Array<string | null>
	moveNumber: number
	onPlay: (nextSquares: Array<string | null>) => void
}) {
	const lines: Array<Array<number>> = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	]
	const winningSquares: Array<number> = []
	function calculateWinner(squares: Array<string | null>): string | null {
		for (const [a, b, c] of lines) {
			if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
				winningSquares.push(a, b, c)
				return squares[a]
			}
		}

		return null
	}
	function handleClick(i: number) {
		if (squares[i] || calculateWinner(squares)) return
		const nextSquares: Array<string | null> = squares.slice()
		if (xIsNext) nextSquares[i] = 'X'
		else nextSquares[i] = 'O'
		onPlay(nextSquares)
	}

	const winner = calculateWinner(squares)
	const winSquares = winner ? winningSquares : []
	let status: string

	if (winner) {
		status = winner + ' wins!'
	} else if (moveNumber > 8) {
		status = "It's a draw."
	} else {
		status = (xIsNext ? 'X' : 'O') + "'s turn."
	}

	return (
		<>
			<div className='status'>{status}</div>
			{[0, 1, 2].map((row) => (
				<div key={row} className='board-row'>
					{[0, 1, 2].map((col) => {
						const index = row * 3 + col
						const isWinningSquare = winSquares.includes(index)
						return <Square key={col} value={squares[index]} onSquareClick={() => handleClick(index)} isWin={isWinningSquare} />
					})}
				</div>
			))}
		</>
	)
}

export default Game
