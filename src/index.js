import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  function Square(props) {
    return (
      <button
        className="square" 
        onClick={props.onClick}
      >
        {props.value}
      </button>
    );
  }
  
  class Board extends React.Component {

    renderSquare(i) {
      return (
        <Square
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
        />
      );
    }

    createBoard = () => {
      let list = []
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            list.push(this.renderSquare(j + 3*i))  
        }
        list.push(<br />)
      }
      return list
    }
  
    render() {

      return (
        <div>
         {this.createBoard().map(item => item)}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        // 记录历史记录
        history: [{ 
          // 井字棋的状态
          squares: Array(9).fill(null),
          // 坐标
          locate: {
            x: null,
            y: null,
          },
        }],
        // 下一个角色
        xIsNext: true,
        // 记录步数
        stepNumber: 0,
      }
    }

    handleClick(i) {
      const { history, stepNumber } = this.state
      // 当跳回之前的步骤后，下一步刷新状态数组
      const updateHistory = history.slice(0, stepNumber + 1)
      const currentSquares = updateHistory[updateHistory.length - 1].squares
      const squares = currentSquares.slice()
      if (calculateWinner(squares) || squares[i]) {
        return
      }
      // 点击之后改变显示
      squares[i] = this.state.xIsNext ? 'X' : 'O'
      // 记录坐标
      let locate = {}
      if (i < 3) {
        locate.x = 1
        locate.y = i + 1
      } else if (i < 6) {
        locate.x = 2
        locate.y = (i === 3) ? 1 : (i === 4) ? 2 : 3
      } else {
        locate.x = 3
        locate.y = (i === 6) ? 1 : (i === 7) ? 2 : 3
      }
      this.setState({ 
        history: updateHistory.concat([{
          squares,
          locate,
        }]),
        xIsNext: !this.state.xIsNext,
        stepNumber: updateHistory.length,
      })
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: step % 2 === 0,
      })
    }

    render() {
      const { squares } = this.state.history[this.state.stepNumber]
      const winner = calculateWinner(squares)
      const moves = this.state.history.map((step, move) => {
        const desc = move ? 'Go to move #' + move + ',locate:' + step.locate.x + ',' + step.locate.y
          : 'Go to game start'
        if (move === this.state.stepNumber) {
          return (
            <li key={move}>
              <button onClick={() => this.jumpTo(move)}><b>{desc}</b></button>
            </li>
          )
        }
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        )
      })
      let status
      if (winner) {
        status = 'Winner: ' + winner
      } else {
        status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O')
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  function calculateWinner(squares) {
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
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  