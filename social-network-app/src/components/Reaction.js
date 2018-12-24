import React, { Component } from 'react';

class Reaction extends Component {
    render() {
        //console.log(this.props);
        return (
            <div className="rection-tooltip">
                <div className="react-wrapper">
                    <button><img src="/reaction/like.png" className="img-responsive" alt="" /></button>
                </div>
                <div className="react-wrapper">
                    <button><img src="/reaction/love.png" className="img-responsive" alt="" /></button>
                </div>
                <div className="react-wrapper">
                    <button><img src="/reaction/haha.png" className="img-responsive" alt="" /></button>
                </div>
                <div className="react-wrapper">
                    <button><img src="/reaction/wow.png" className="img-responsive" alt="" /></button>
                </div>
                <div className="react-wrapper">
                    <button><img src="/reaction/sad.png" className="img-responsive" alt="" /></button>
                </div>
                <div className="react-wrapper">
                    <button><img src="/reaction/angry.png" className="img-responsive" alt="" /></button>
                </div>
            </div>
        )
    }
}


export default (Reaction);