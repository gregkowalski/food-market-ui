import React from 'react'
import './InfoPage.css'
import AppHeader from '../../components/AppHeader'
import AppFooter from '../../components/AppFooter';

const InfoPage = (props) => {

    return (
        <div>
            <AppHeader />
            <div className='infopage'>
                {props.children}
            </div>
            <AppFooter />
        </div>
    )
}

export default InfoPage;