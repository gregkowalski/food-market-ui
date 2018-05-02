import React from 'react'
import './InfoPage.css'
import AppHeader from '../../components/AppHeader'
import AppFooter from '../../components/AppFooter';
import { Image } from 'semantic-ui-react'
import aboutImg from './about-img.jpg'

const InfoPage = (props) => {

    return (
        <div>
            <AppHeader fixed />
            {props.header}
            <div className='infopage'>
                {props.children}
            </div>
            <AppFooter />
        </div>
    )
}

export default InfoPage;