import React, { Component } from 'react';
// import './App.css';
import axios from 'axios';

class Game extends Component {
    constructor(props) {
        super(props)
        this.state = {
            score: 0,
            curTime: 0,
            startTime: 5,
            light: 1024,
            name: '',
            skill: '',
            haveTimeStop: false
        }
        this.GetScore = this.GetScore.bind(this)
        this.StartGame = this.StartGame.bind(this)
        this.Timer = this.Timer.bind(this)
    }
    GetScore() {
        let score, haveTimeStop
        axios.get(`http://localhost:5000/`)
            .then(res => {
                console.log(res.data["haveTimeStop"]);
                score = res.data['score'];
                haveTimeStop = res.data['haveTimeStop'];
                this.setState({haveTimeStop})
                let {skill} = this.state.skill
                // this.setState({skill: ''})
                if(score > this.state.score){
                    if(skill){
                        this.handleSkill()
                    }
                    skill = ''
                    this.setState({ score, skill })
                }
            })
    }
    Timer() {
        var {curTime, haveTimeStop} = this.state
        if(!haveTimeStop)
            curTime -= 1;
            if (curTime < 0) {
                clearInterval(this.timer);
                clearInterval(this.score);
            }
            else {
                this.setState({ curTime })
            }
        }
    StartGame() {
        var {startTime} = this.state
        this.setState({ curTime:  startTime})
        setTimeout(1000)
        this.timer = setInterval(this.Timer, 1000)
        this.score = setInterval(this.GetScore, 100);
    }
    handleSkill() {
        console.log(this.state.skill);
        axios({
            method: 'post',
            url: 'http://localhost:5000/skill',
            data: {
                skill: this.state.skill, // This is the body part
            }
        }).then(res => {
            // console.log(res);
        })
    }
    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            // axios({
            //     method: 'post',
            //     url: 'http://localhost:5000/timeout',
            //     data: {
            //         name: this.state.name, // This is the body part
            //     }
            // }).then(res => {
            //     console.log(res);
            // })
            // axios.get(`http://localhost:5000/skillx2`)
            axios.get(`http://localhost:5000/test`)
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
