import React from 'react'
import AppHeader from './components/AppHeader'

export default class NotFoundPage extends React.Component {

    render() {
        return (
            <div>
                <AppHeader />
                404 Not Found...
            </div>
        );
    }
}