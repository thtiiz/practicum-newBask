import React, { Component } from 'react';
import axios from 'axios';

class Scoreboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            scoreboard: []
        }
    }
    componentDidMount() {
        axios.get(`http://localhost:5000/scoreboard`).then(res => {
            var sortedScoreboard = []
            for (let name in res.data) {
                sortedScoreboard.push([name, res.data[name]])
            }
            sortedScoreboard.sort(function (x, y) {
                return y[1] - x[1];
            })
            console.log(sortedScoreboard);
        })
    }
    render() {
        return (
            <div className="container">

            </div>
        );
    }
}

export default Scoreboard;
