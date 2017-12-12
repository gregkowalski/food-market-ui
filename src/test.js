import React from 'react'
import { Link } from 'react-router-dom'
import './test.css'
import { Image } from 'semantic-ui-react'

class mytest extends React.Component {

    render() {
        return (
            <Image size='medium' shape='circular' src='/assets/images/suppliers/johannk.jpg' />
        );
    }
}

export default mytest;