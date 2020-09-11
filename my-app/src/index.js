import React, { Component} from "react";
import {Input, Table} from 'antd'
import ReactDOM from 'react-dom'
import Axios from "axios";
import './index.css'

// class Square extends React.Component {
//
//     // constructor(props) {
//     //     super(props);
//     //     this.state = {
//     //         value: null
//     //     }
//     // }
//     render() {
//         return (
//             <button className="square"
//                     onClick={() => this.props.onClick()}>
//                 {
//                     this.props.value
//                 }
//             </button>
//         );
//     }
// }


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
function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    )
}

class Board extends React.Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         squares: Array(9).fill(null),
    //         xIsNext: true
    //     }
    // }


    renderSquare(i) {
        return <Square
            value = {this.props.squares[i]}
            onClick = {() => this.props.onClick(i) }
        />;
    }

    render() {
        // const winner = calculateWinner(this.state.squares);
        // let status;
        // // const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        // if(winner) {
        //     status = 'Winner: ' + winner
        // } else {
        //     status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
        // }
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            stepNumber: 0,
            xIsNext: true
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0,this.state.stepNumber +1)
        const current = history[history.length - 1]
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O'
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        })
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xisNext: (step % 2) === 0
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber]
        const winner = calculateWinner(current.squares)

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to get start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            )
        })
        let status
        if(winner) {
            status = 'Winner: ' + winner
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares = {current.squares}
                        onClick = {(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{ status }</div>
                    <ol>{ moves }</ol>
                </div>
            </div>
        );
    }
}

// ========================================

// ReactDOM.render(
//     <Game />,
//     document.getElementById('root')
// );

export default class LocalImport extends Component {
    constructor(args) {
        super(args);
        this.state = {
            date_seq: '',
            popArrOrigin: [],
            popArr: [], //,
            popName: '',
            tableTotalMess: {}, //ori date of table
            tabName: ''
        }
    }
    render() {
        return (
            <div className="localImport">
                <div className={'import pop_protective'}>
                    <div className="local_import_pop">
                        <h2 className="local_pop_name" title={this.state.popName}>{this.state.popName}</h2>
                        <ul className="local_pop_list">
                            {
                                this.state.popArr.map((item, index) => {
                                    return (
                                        <input type="text"
                                               className="local_pop_list_date"
                                               value={item.date}
                                               // onClick={this.popDateChange.bind(this, index)}
                                               // onBlur={this.popDateBlur}
                                        />
                                    )
                                })
                            }
                        </ul>

                    </div>

                </div>
            </div>
            )
    }
    componentDidMount() {
        this.getTableMessage('', this.state.inputValue)
        window.refresh = (rsp) => {
            this.getTableMessage('',this.state.inputValue)
        }
    }
    updataIndex(record) {
        let date_seq = ''
        let key = record.key
        let arr = this.state.tableTotalMess[this.state.tabName === '' ? 'all' : this.state.tabName]
        for (let i = 0,len = arr.length;i<len;i++) {
            if (arr[i].id === key) {
                date_seq = arr[i]['date_seq']
                break
            }
        }

        this.setState(() => ({
            load: true,
            date_seq
        }))

        axios.get(this.props.ajaxLink.LOCAL_DETAIL, {
            params: { date_seq }
        }).then((res) => {
            let { data: { data, errno, time:nowTime }} = res
            if (errno === 0) {
                let arr = []
                let time = []
                for (let key in data) {
                    arr.push({
                        date: key,
                        num: data[key]
                    })
                    time.push(key.split('-')[0])
                }
                let OriginArr = JSON.parse(JSON.stringify(arr))
                this.setState(() => ({
                    popArr: arr,
                    popArrOrigin: OriginArr
                }), () => {
                    let dom = document.querySelector('local_pop_list_date.pop_num_warn');
                    dom && dom.classList.remove('pop_num_warn')
                })
            }
        })
    }
}

