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
          key={i}
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
        list.push(<br key={i + 9} />)
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

  function Head(props) {
    const { status, order, onClick } = props
    return (
      <div>
        <label>{status}</label>
        <button className="historyBtu" onClick={onClick}>{order ? '逆序' : '顺序' }</button>
      </div>
    )
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
          locate: null,
          // 记录的文本
          text: 'Start Game',
        }],
        // 下一个角色
        xIsNext: true,
        // 记录步数
        stepNumber: 0,
        // 历史记录的顺序，true为逆序，false为顺序
        order: true,
      }
    }

    /**
     * 点击棋盘位置更改显示
     * @param {棋盘的索引} i 
     */
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
      this.setState({ 
        history: updateHistory.concat([{
          squares,
          locate: this.getLocate(i),
          text: 'Go to move #' + (updateHistory.length - 1),
        }]),
        xIsNext: !this.state.xIsNext,
        stepNumber: updateHistory.length,
      })
    }

    /**
     * 获取每一步的坐标
     * @param {棋盘位置} i 
     */
    getLocate(i) {
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
      return locate
    }

    /**
     * 跳到指定的历史记录
     * @param {步数} step 
     */
    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: step % 2 === 0,
      })
    }

    /**
     * 逆序显示历史记录
     */
    handleHistoryChange() {
      const { order, history } = this.state
      let nerHistory = history
      this.setState({
        order: !order,
        history: nerHistory.reverse(),
      })
    }

    render() {
      const { squares } = this.state.history[this.state.stepNumber]
      const winner = calculateWinner(squares)
      const moves = this.state.history.map((step, move) => {
      const desc = step.text + (step.locate != null ? (',locate:' + step.locate.x + ',' + step.locate.y) : '')
      if (move === this.state.stepNumber) {
        // 当前步骤加粗显示
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
            <Head status={status} order={this.state.order} onClick={() => this.handleHistoryChange()} />
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
  