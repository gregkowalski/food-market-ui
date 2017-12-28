import React from 'react'
import { Redirect } from 'react-router-dom'

export default class CognitoSignout extends React.Component {
    render() {
        return <Redirect to='/' />
    }
}

