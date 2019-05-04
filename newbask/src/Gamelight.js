import React, { Component } from 'react';
// import './App.css';
import axios from 'axios';

class Game extends Component {
    constructor(props) {
        super(props)
        this.state = {
            score: 0,
            curTime: 0,
            light: 1024,
            name: ''
        }
        this.GetScore = this.GetScore.bind(this)
        this.StartGame = this.StartGame.bind(this)
        this.Timer = this.Timer.bind(this)
    }
    GetScore() {
        let score
        axios.get(`http://localhost:5000/`)
            .then(res => {
                console.log(res);
                score = res.data;
                this.setState({ score })
            })
    }
    Timer() {
        let curTime = this.state.curTime - 1;
        console.log(curTime);
        if (curTime < 0) {
            clearInterval(this.timer);
            clearInterval(this.score);
        }
        else {
            this.setState({ curTime })
        }
    }
    StartGame() {
        this.setState({ curTime: 1 })
        setTimeout(1000)
        this.timer = setInterval(this.Timer, 1000)
        this.score = setInterval(this.GetScore, 100);
    }
    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            axios({
                method: 'post',
                url: 'http://localhost:5000/timeout',
                data: {
                    name: this.state.name, // This is the body part
                }
            }).then(res => {
                console.log(res);
            })
        }
    }
    handleChange = (e) => {
        this.setState({
            name: e.target.value
        })
    }
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <h1>Score</h1>
                    <h2>{this.state.score}</h2>
                    <h1>Time</h1>
                    <h2>{this.state.curTime}</h2>
                    <a className="button is-primary" onClick={this.StartGame}>Start</a>
                </div>
                <input className="input" type="text" placeholder="Text input" onKeyDown={this.handleKeyDown} onChange={this.handleChange} />
            </div>
        );
    }
}

export default Game;
