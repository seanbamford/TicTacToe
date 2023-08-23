import { useState } from 'react'
import './App.css'

function Game() {
  const [history, setHistory] = useState<Array<Array<string | null>>>([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext: boolean = currentMove % 2 === 0;
  const currentSquares: Array<string | null> = history[currentMove];

  function handlePlay(nextSquares: Array<string | null>) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((move: Array<string | null>) => {
    let description: string;
    const i = history.indexOf(move);
    if (i != 0) {
      description = "Go to move #" + Number(history.indexOf(move) + 1);
    } else {
      description = "Go to game start";
    }

    if (history[currentMove] !== move || currentMove == 0) {
      return (
        <li key={i}>
          <button onClick={() => jumpTo(i)}>{description}</button>
        </li>
      );
    } else {
      return <div>{"You are at move #" + (currentMove + 1)}</div>;
    }
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function Square({ value, onSquareClick }: { value: string | null; onSquareClick: () => void }) {
  return <button className="square" onClick={onSquareClick}>{value}</button>;
}

function Board({ xIsNext, squares, onPlay }: { xIsNext: boolean; squares: Array<string | null>; onPlay: (nextSquares: Array<string | null>) => void }) {
  function handleClick(i: number) {
    if (squares[i] || calculateWinner(squares)) return;
    const nextSquares: Array<string | null> = squares.slice();
    if (xIsNext) nextSquares[i] = "X";
    else nextSquares[i] = "O";
    onPlay(nextSquares);
  }
  // const grid = () => {
  //   for (let i = 0; i < 9; i++) {
  //     <Square value={squares[i]} onSquareClick={() => handleClick(i)}
  //   }
  //   //return <Square value={squares[i]} onSquareClick={() => handleClick(i)} />
  // }
  const winner = calculateWinner(squares);
  let status: string;
  if (winner) {
    status = winner + " wins!";
  } else {
    status = (xIsNext ? "X" : "O") + "'s turn.";
  }

  return (
    <>
      <div className="status">{status}</div>
      {[0, 1, 2].map((row) => (
        <div key={row} className="board-row">
          {[0, 1, 2].map((col) => {
            const index = row * 3 + col;
            return (
              <Square
                key={col}
                value={squares[index]}
                onSquareClick={() => handleClick(index)}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

function calculateWinner(squares: Array<string | null>): string | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}

export default Game;
