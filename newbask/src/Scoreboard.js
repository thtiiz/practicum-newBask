import React, { Component } from 'react';
import axios from 'axios';
import './Scoreboard.css'
import Scorestyle from './scorestyle.json'

class Leaderboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            leaders: [],
            maxScore: 100,
            scoreboard: [],
            myrank: 1
        };
        this.getData = this.getData.bind(this);
        this.rankstyle = this.rankstyle.bind(this);
        this.refstyle = this.refstyle.bind(this)
        this.myRef = React.createRef()
        console.log(this.props.location.state);
    }
    getData() {
        let myrank = 8
        // let myrank = this.props.myrank
        axios.get(`http://localhost:5000/scoreboard`).then(res => {
            var sortedScoreboard = []
            for (let name in res.data) {
                sortedScoreboard.push([name, res.data[name]])
            }
            sortedScoreboard.sort(function (x, y) {
                return y[1] - x[1];
            })
            this.setState({ scoreboard: sortedScoreboard, myrank })
            // console.log(sortedScoreboard);
        })
    }
    rankstyle(rank) {
        let { myrank } = this.state
        let style = "leader"
        if (myrank === rank)
            style += " myrank"
        return style
    }
    refstyle(rank) {
        if (this.state.myrank === rank) {
            console.log(rank);
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
                    className={this.rankstyle(i + 1)}
                    ref={this.refstyle(i + 1)}
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
                <h1 className="is-size-4 leaderboard-header">Leaderboard</h1>
                <div className="leaders" >
                    {score}
                </div>
            </div>
        );
    }
}

export default Leaderboard;