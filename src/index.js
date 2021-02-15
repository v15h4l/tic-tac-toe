import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className={"square " + (props.isWinningSquare && "winning")} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

function Board(props) {

    const renderSquare = (i) => {
        return <Square
            value={props.squares[i]}
            isWinningSquare={props.winningSquares?.indexOf(i) >= 0}
            onClick={() => props.onClick(i)}
        />;
    }

    return (
        <div>
            <div className="board-row">
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
            </div>
            <div className="board-row">
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
            </div>
            <div className="board-row">
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
            </div>
        </div>
    );
}

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            history: [{ squares: Array(9).fill(null), xIsNext: true }],
            activeHistoryIdx : 0
        };
    }

    handleSquareClick = (i) => {
        let activeHistoryIdx = this.state.activeHistoryIdx;
        const history = this.state.history.slice(0, activeHistoryIdx + 1);
        const squares = history[activeHistoryIdx].squares.slice();
        const xIsNext = history[activeHistoryIdx].xIsNext;

        if (calculateWinStatus(squares) || squares[i]) {
            return;
        }
        squares[i] = xIsNext ? "X" : "O";

        activeHistoryIdx++;
        history.push({ squares, xIsNext: !xIsNext });
        this.setState({ history, activeHistoryIdx });
    };

    handleButtonClick = (i) => {
        this.setState({ activeHistoryIdx: i });
    };

    render() {
        const history = this.state.history.slice();
        const { squares, xIsNext } = history[this.state.activeHistoryIdx];

        let status, winningSquares;
        const winStatus = calculateWinStatus(squares);

        if (winStatus) {
            status = "Winner : " + winStatus.winner;
            winningSquares = winStatus.winningSquares.slice();
        } else if (calculateDraw(squares)) {
            status = "Match Drawn";
        } else {
            status = "Next player : " + (xIsNext ? "X" : "O");
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={squares} winningSquares={winningSquares} onClick={this.handleSquareClick} />
                </div>
                <div className="game-info">
                    <div className="status">{status}</div>
                    <ol>
                        {
                            this.state.history.map((element, idx) => {
                                return (<li>
                                    <button onClick={()=>this.handleButtonClick(idx)}>
                                        {`Go to ${idx > 0 ? "move #" + idx : "game start"}`}
                                    </button>
                                </li>);
                            })
                        }
                    </ol>
                </div>
            </div>
        );
    }
}

function calculateWinStatus(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { winner: squares[a], winningSquares: [a, b, c] };
        }
    }
    return null;
}

function calculateDraw(squares) {
    return !squares.some( sqr => !sqr);
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);