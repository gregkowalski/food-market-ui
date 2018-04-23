import React from 'react'
import InfoPage from './InfoPage'
import { Divider } from 'semantic-ui-react'
import './About.css'

const About = () => {
    return (
        <InfoPage>
            <div className='about-header'>What is Foodcraft?</div>
            <Divider hidden />
            <div className='about-content'>
            <p>Foodcraft is food-sharing marketplace for handmade foods. </p>
            <p>We believe in a community built by neighbours and the power
                of quality, small-batch foods. Our goal is to create a space that can uniquely
                help cooks grow their own business with more ease and convenience.</p>
                </div>
        </InfoPage>
    )
}

export default About;