import React, { Component } from 'react';

class Inputname extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
        this.focusRef = React.createRef();
    }
    componentDidUpdate() {
        console.log(this.focusRef);
        this.focusRef.current.focus();
    }
    render() {
        return (
            <div className="box">
                <h1 className="is-size-5">Score</h1>
                <h1 className="is-size-5">{this.props.score}</h1>
                <input ref={this.focusRef} className="input" type="text" placeholder="Enter your name." onKeyDown={this.props.handleKeyDown} onChange={this.props.handleChange} />
            </div>
        );
    }
}

export default Inputname;
