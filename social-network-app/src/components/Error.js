import React, { Component } from 'react';

class Reaction extends Component {
    render() {
        return (
            <div className="text-center error-page">
                <div>{this.props.error ? <h3><strong>Error: </strong><span>{this.props.error}</span></h3> : <h2><strong>Error 404 </strong><span>Page not found!</span></h2>}</div>
                <h3><a href="/" alt="">Go to homepage</a></h3>
                <h3><a href="/login" alt="">Go to Login</a></h3>
            </div>
        )
    }
}

export default Reaction;