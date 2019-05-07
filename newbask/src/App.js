import React, { Component } from 'react';
import './App.css';
import Game from './Game'
import Gamelight from './Gamelight'
import Scoreboard from './Scoreboard'
import { Route } from 'react-router-dom'

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    render() {
        return (
            <div className="container-fluid">
                <Route exact path="/" component={Game} />
                <Route path="/gamelight" component={Gamelight} />
                <Route path="/scoreboard" component={Scoreboard} />
                {/* <Game />
                <Scoreboard /> */}
            </div>
        );
    }
}

export default App;
