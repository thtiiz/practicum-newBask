import React, { Component } from 'react';
import { Redirect } from 'react-router'
import ReactDOM from 'react-dom';
import axios from 'axios';
import './Game.css';
import Objective from './Objective'
import Inputname from './Inputname'
import fire from '../assets/pic/fire.gif'
import fire2 from '../assets/pic/fire2.gif'
import timegif from '../assets/pic/timegif.gif'

class Game extends Component {
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
            activeSkill: ['', ''],
            haveSkill: ['no', 'no'],
            stage: 0,
            nextStagePoint: [5, 15, 30, 100],
            plusTimeStage: [10, 10, 10, 30],
            isEnd: false,
            modalStyle: "modal is-active",
            redirect: false
        }
        this.GetScore = this.GetScore.bind(this)
        this.StartGame = this.StartGame.bind(this)
        this.Timer = this.Timer.bind(this)
        this.handleTimeout = this.handleTimeout.bind(this)
        this.RandomSkill = this.RandomSkill.bind(this)
        this.handleStart = this.handleStart.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.handleactiveSkill = this.handleactiveSkill.bind(this)
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
        let score, activeSkill, haveSkill
        let { skill, stage, nextStagePoint, plusTimeStage, curTime } = this.state
        axios.get(`http://localhost:5000/game`)
            .then(res => {
                score = res.data['score'];
                activeSkill = res.data['activateSkill'];
                // console.log(activeSkill);
                haveSkill = res.data['haveSkill'];
                this.setState({ activeSkill, haveSkill })
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
        var { curTime, activeSkill } = this.state
        // console.log(activeSkill)
        if (activeSkill[0] !== 'timeStop' && activeSkill[1] !== 'timeStop') {
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
        this.setState({
            activeSkill: []
        })
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
    handleactiveSkill() {
        let { activeSkill } = this.state
        if (activeSkill[0] === 'x2' && activeSkill[1] === 'x2') {
            ;
        }
        if (activeSkill[0] === 'x2' || activeSkill[1] === 'x2') {
            ;
        }
        if (activeSkill[0] === 'timeStop' || activeSkill[1] === 'timeStop') {
            ;
        }
    }
    handleStart() {
        axios.get(`http://localhost:5000/initial`)
        this.StartGame()
    }
    handleTimeout() {
        console.log("handle Timeout");
        this.setState({
            modalStyle: "modal is-active"
        })
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
                    redirect: true
                })
            })
        }
    }
    handleChange = (e) => {
        this.setState({
            name: e.target.value
        })
        console.log(this.state.name)
    }
    firegif = (fireState) => {
        // console.log(fireState)
        if (fireState === "fire")
            return fire
        else if (fireState === "fire2")
            return fire2
    }
    render() {
        let { stage, nextStagePoint, plusTimeStage, haveSkill, skill, activeSkill, name } = this.state
        let haveskill = haveSkill.map((val, i) =>
            <figure className="image is-128x128 column haveskill" key={i}>
                <img className="is-rounded" src={require("../assets/pic/" + val + ".png")} alt="haveskill" />
            </figure>
        )
        let randomskill
        if (skill) {
            randomskill = (
                <figure className="image is-128x128 randomskill" >
                    <img className="is-rounded" src={require("../assets/pic/" + skill + ".png")} alt="randomskill" />
                </figure>
            )
        }
        let object = this.state.nextStagePoint.map((val, i) =>
            <Objective stage={stage} nextStagePoint={nextStagePoint[i]} plusTimeStage={plusTimeStage[i]} key={i} i={i} />
        )
        let gameStyle = "Game"
        let fireStyle = "fire inactive-gif"
        let fireState = ""
        let timeStyle = "timegif inactive-gif"
        if (activeSkill[0] === 'x2' && activeSkill[1] === 'x2') {
            gameStyle += " onfire";
            fireStyle = "fire2 active-fire";
            fireState = "fire2"
        }
        else if (activeSkill[0] === '' && activeSkill[1] === '') {

            fireStyle = "fire inactive-gif"
            timeStyle = "timegif inactive-gif"
        }
        else {
            if (activeSkill[0] === 'x2' || activeSkill[1] === 'x2') {
                gameStyle += " x2";
                fireStyle = "fire active-gif";
                fireState = "fire"
            }
            if (activeSkill[0] === 'timeStop' || activeSkill[1] === 'timeStop') {
                gameStyle += " timestop";
                timeStyle = "timegif active-gif";

            }

        }
        if (this.state.redirect)
            return <Redirect to={{
                pathname: '/scoreboard',
                state: { name: this.state.name }
            }} />
        else
            return (
                <div className={gameStyle}>
                    <div className="columns is-centered is-marginless">
                        <h1 className="is-size-3">NU Nak Bas</h1>
                    </div>
                    <div className="columns">
                        <div className="column is-one-fifth is-paddingless">
                            {object}
                        </div>
                        <div className="score column">
                            <h1 className="is-size-1">{this.state.score}</h1>
                            <h2 className="is-size-7">Score</h2>
                            <img src={this.firegif(fireState)} alt="fire" className={fireStyle} />
                            <div className="columns is-marginless is-centered">
                                <h2 className="is-size-5">Time: {this.state.curTime}</h2>
                                {/* <img src={timegif} alt="timegif" className={timeStyle} /> */}
                            </div>
                            <div className="columns is-centered random">
                                {/* <div className="is-block"> */}
                                {randomskill}
                                {/* </div> */}
                            </div>
                            <div className="columns is-centered">
                                {/* <div className="is-block"> */}
                                <p className="is-size-7">Random Skill</p>
                            </div>
                            <a className="button is-primary" onClick={this.handleStart}>Start</a>
                        </div>
                        <div className="column ">
                            <div className="column">
                                <h1>Have Skill</h1>
                            </div>
                            <div className="columns">
                                {haveskill}
                            </div>
                        </div>
                    </div>
                    <div className={this.state.modalStyle}>
                        <div className="modal-background"></div>
                        <div className="modal-content">
                            <Inputname handleKeyDown={this.handleKeyDown} handleChange={this.handleChange} score={this.state.score} />
                            {/* <Link to="/register" >Click to Register</Link> */}
                        </div>
                        <button className="modal-close is-large" aria-label="close"></button>
                    </div>
                </div>
            );
    }
}

export default Game;
