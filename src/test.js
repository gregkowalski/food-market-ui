import React from 'react'
import { Link } from 'react-router-dom'
import './test.css'

class mytest extends React.Component {

    render() {
        return (
            <div>
                good
                <Link to='/'>Go Home</Link>
            </div>
        );
    }
}

export default mytest;