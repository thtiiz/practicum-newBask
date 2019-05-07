import React, { Component } from 'react';
// import './App.css';
import axios from 'axios';

class Gamelight extends Component {
    constructor(props) {
        super(props)
        this.state = {
            score: 0,
            curTime: 0,
            startTime: 30,
            name: '',
            skill: '',
            activateTimeStop: false,
            activateX2: false,
            activeSkill: [],
            haveSkill: [],
            stage: 0,
            nextStagePoint: [5, 15, 20],
            plusTimeStage: [7, 7, 7],
            isEnd: false
        }
        this.GetScore = this.GetScore.bind(this)
        this.StartGame = this.StartGame.bind(this)
        this.Timer = this.Timer.bind(this)
        this.handleTimeout = this.handleTimeout.bind(this)
        this.RandomSkill = this.RandomSkill.bind(this)
        this.handleStart = this.handleStart.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
    }
    StartGame() {
        var { startTime } = this.state
        this.setState({ curTime: startTime })
        setTimeout(1000)
        this.score = setInterval(this.GetScore, 20)
        this.timer = setInterval(this.Timer, 1000)
        this.randomskill = setInterval(this.RandomSkill, 5000)
    }
    GetScore() {
        let score, activateSkill, haveSkill
        let { skill, stage, nextStagePoint, plusTimeStage, curTime } = this.state
        console.log(skill)
        axios.get(`http://localhost:5000/game`)
            .then(res => {
                // console.log(res.data);
                score = res.data['score'];
                activateSkill = res.data['activateSkill'];
                haveSkill = res.data['haveSkill'];
                console.log(haveSkill, activateSkill);
                this.setState({ activateSkill, haveSkill })
                if (score > this.state.score) { // Update
                    if (score >= nextStagePoint[stage]) {
                        curTime += plusTimeStage[stage]
                        stage += 1
                    }
                    if (score)
                        if (skill) {
                            console.log("get", skill)
                            this.handleSkill(skill)
                        }
                    skill = ''
                    this.setState({ score, skill, stage, curTime })
                }
            })
    }
    Timer() {
        var { curTime, activateSkill } = this.state
        if (activateSkill[0] !== 'timeStop' && activateSkill[1] !== 'timeStop') {
            curTime -= 1;
            if (curTime < 0) {
                clearInterval(this.timer)
                clearInterval(this.score)
                clearInterval(this.randomskill)
                this.handleTimeout()
            }
            else
                this.setState({ curTime })
        }
        else {
            console.log("Time stop!!!");
        }
    }
    RandomSkill() {
        let random = Math.floor(Math.random() * 10) + 1
        let skill = (random % 2 === 0) ? 'x2' : 'timeStop'
        this.setState({ skill })
        console.log(random, skill);
    }
    handleSkill(skill) {
        axios({
            method: 'post',
            url: 'http://localhost:5000/skill',
            data: {
                skill // This is the body part
            }
        }).then(res => {
            // console.log(res);
        })
    }
    handleStart() {
        axios.get(`http://localhost:5000/initial`)
        this.StartGame()
    }
    handleTimeout() {
        console.log("handle Timeout");
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
                this.setState({
                    name: ''
                })
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
                    <a className="button is-primary" onClick={this.handleStart}>Start</a>
                </div>
                <input className="input" type="text" placeholder="Text input" onKeyDown={this.handleKeyDown} onChange={this.handleChange} />
                <h1>Activate: {this.state.activateSkill}</h1>
                <h1>Have Skill: {this.state.haveSkill}</h1>
                <h2>Random: {this.state.skill}</h2>
            </div>
        );
    }
}

export default Gamelight;
