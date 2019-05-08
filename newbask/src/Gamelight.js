import React, { Component } from 'react';
import './Game.css';
import axios from 'axios';
import Objective from './Objective'

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
            haveSkill: ['no', 'no'],
            stage: 0,
            nextStagePoint: [5, 15, 30, 100],
            plusTimeStage: [10, 10, 10, 30],
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
        let { stage, nextStagePoint, plusTimeStage, haveSkill, skill } = this.state
        let haveskill = haveSkill.map((val, i) =>
            <figure className="image is-128x128 column" key={i}>
                <img className="is-rounded" src={require("../assets/pic/" + val + ".png")} />
            </figure>
        )
        let randomskill
        if (skill) {
            randomskill = (
                <figure className="random image is-128x128">
                    <img className="is-rounded" src={require("../assets/pic/" + skill + ".png")} />
                </figure>
            )
        }

        let object = this.state.nextStagePoint.map((val, i) =>
            <Objective stage={stage} nextStagePoint={nextStagePoint[i]} plusTimeStage={plusTimeStage[i]} key={i} i={i} />
        )
        return (
            <div className="Game">
                <div className="columns is-centered">
                    <h1 className="is-size-3">NU Nak Bas</h1>
                </div>
                <div className="columns is-marginless">
                    <div className="column is-one-fifth">
                        {/* <Objective stage={stage} nextStagePoint={nextStagePoint} plusTimeStage={plusTimeStage} /> */}
                        {object}
                    </div>
                    <div className="score column">
                        <h1 className="is-size-1">{this.state.score}</h1>
                        <h2 className="is-size-6">Score</h2>
                        <div className="columns is-marginless">
                            <div className="column">
                                <h2 className="is-size-3">Time: {this.state.curTime}</h2>
                            </div>

                        </div>
                        <div className="columns is-centered">
                            {/* <div className="column"> */}
                            {/* </div> */}
                            <div className="columns">
                                {randomskill}
                            </div>
                            <div className="columns">
                                <p className="is-size-7">Random Skill</p>
                            </div>
                        </div>
                        <a className="button is-primary" onClick={this.handleStart}>Start</a>
                    </div>
                    <div className="column">
                        <div className="column">
                            <h1>Have Skill</h1>
                        </div>
                        <div className="columns">
                            {haveskill}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Gamelight;
