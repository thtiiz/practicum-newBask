import React, { Component } from 'react';
import './Objective.css';

class Objective extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    render() {
        var { stage, nextStagePoint, plusTimeStage, i } = this.props
        // console.log(this.props)
        var objectStyle = (i === stage) ? "Objective active" : "Objective"
        var fontStyle = (i === stage) ? "is-size-6" : "is-size-7"
        var score =
            // <div className="score column">
            <p className={fontStyle}>{nextStagePoint}</p>
        // </div>
        var time =
            // <div className="time column">
            <p className={fontStyle}> +{plusTimeStage}s</p>
        // </div>
        return (
            <div className={objectStyle}>
                <div className="line columns">
                    <div className="score column">
                        <p className={fontStyle}>Score</p>
                        {score}
                    </div>
                    <div className="time column">
                        <p className={fontStyle}>bonus</p>
                        {time}
                    </div>
                </div>
            </div>
        );
    }
}

export default Objective;
