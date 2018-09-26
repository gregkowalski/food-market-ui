import React from 'react'
import { Redirect } from 'react-router-dom'
import Url from '../../services/Url'

export default class CognitoSignout extends React.Component {
    render() {
        return <Redirect to={Url.home()} />
    }
}

