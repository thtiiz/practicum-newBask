import React, { Component } from 'react';
import axios from 'axios';
import './Scoreboard.css'
import Scorestyle from './scorestyle.json'
import back from '../assets/pic/back.png'

class Leaderboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            leaders: [],
            maxScore: 100,
            scoreboard: [],
            myname: ''
        };
        this.getData = this.getData.bind(this);
        this.rankstyle = this.rankstyle.bind(this);
        this.refstyle = this.refstyle.bind(this)
        this.myRef = React.createRef()
        console.log(this.props.location.state);
    }
    getData() {
        let myname = this.props.location.state.name
        // let myname = "opor"
        axios.get(`http://localhost:5000/scoreboard`).then(res => {
            var sortedScoreboard = []
            for (let name in res.data) {
                sortedScoreboard.push([name, res.data[name]])
            }
            sortedScoreboard.sort(function (x, y) {
                return y[1] - x[1];
            })
            // sortedScoreboard[: 5]
            this.setState({ scoreboard: sortedScoreboard, myname })
            // console.log(sortedScoreboard);
        })
    }
    rankstyle(name) {
        let { myname } = this.state
        let style = "leader"
        if (myname === name)
            style += " myrank"
        return style
    }
    refstyle(name) {
        if (this.state.myname === name) {
            console.log(name);
            return this.myRef
        }
        else
            return ""
    }
    scrollToMyRef = () => {
        window.scrollTo({ behavior: 'smooth', top: this.myRef.current.offsetTop - 300 })
    }
    componentWillMount() {
        this.getData();
    }
    componentDidMount() {
        setTimeout(this.scrollToMyRef, 500)
        // this.scrollToMyRef()
    }
    render() {
        let colors = Scorestyle['colors'];
        let crown = Scorestyle['crown'];
        let score =
            this.state.scoreboard.map((el, i) => (
                <div
                    key={i}
                    style={{
                        animationDelay: i * 0.1 + 's'
                    }}
                    className={this.rankstyle(el[0])}
                    ref={this.refstyle(el[0])}
                >
                    <div className="leader-wrap">
                        {
                            i < 3 ? (
                                <div
                                    style={{
                                        backgroundColor: colors[i]
                                    }}
                                    className="leader-ava"
                                >
                                    <svg
                                        fill="#fff"
                                        xmlns="http://www.w3.org/2000/svg"
                                        height={24}
                                        width={24}
                                        viewBox="0 0 32 32"
                                    >
                                        <path d={crown} />
                                    </svg>
                                </div>
                            ) : null}
                        <div className="leader-content">
                            <div className="leader-name">{i + 1 + '. ' + el[0]}</div>
                            <div className="leader-score">
                                <img src={require("../assets/pic/p-char.svg")} className="point" alt="point" />
                                <div className="leader-score_title">{el[1]}</div>
                            </div>
                        </div>
                    </div>
                    <div style={{ animationDelay: 0.4 + i * 0.2 + 's' }} className="leader-bar">
                        <div
                            style={{
                                backgroundColor: colors[i],
                                width: el[1] / this.state.maxScore * 100 + '%'
                            }}
                            className="bar"
                        />
                    </div>
                </div>
            ))
        return (
            <div className="Leaderboard container has-text-justified">
                <a href="/">
                    <img src={back} alt="back" className="back-button" />
                </a>
                <h1 className="is-size-4 leaderboard-header">Leaderboard</h1>
                <div className="leaders" >
                    {score}
                </div>
            </div>
        );
    }
}

export default Leaderboard;