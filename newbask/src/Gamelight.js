import React, { Component } from 'react';
// import './App.css';
import axios from 'axios';

class Game extends Component {
    constructor(props) {
        super(props)
        this.state = {
            score: 0,
            curTime: 0,
            light: 1024
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
        this.setState({ curTime: 10 })
        setTimeout(1000)
        this.timer = setInterval(this.Timer, 1000)
        this.score = setInterval(this.GetScore, 10);
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
            </div>
        );
    }
}

export default Game;
