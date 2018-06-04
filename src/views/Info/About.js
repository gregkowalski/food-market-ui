import React from 'react'
import InfoPage from './InfoPage'
import { Image, Button } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import './About.css'
import aboutImg from './about-img.jpg'
import Url from '../../services/Url'

export class About extends React.Component {

    navigateToHome = () => {
        this.props.history.push(Url.search());
    }

    render() {

        const header = (
            <div className='about-header'>
                <Image src={aboutImg} />
                {/* <div>Photograph by Brooke Lark</div> */}
                <div className='about-title'>What is Foodcraft?</div>
            </div>
        );
        return (
            <InfoPage header={header}>
                <div className='about-content'>
                    <p>Foodcraft is a marketplace for unique handmade foods.</p>
                    <p>Food keeps us alive, but good food makes us <i>feel</i> alive.</p>
                    <p>We're proud to support local cooks, from professional caterers to homecooks, as they grow their own business.
                        Our mission is to enable anyone to share their handmade foods.
                </p>
                    <Button className='about-food-grid-button' onClick={this.navigateToHome}>Explore Foodcraft</Button>
                </div>
            </InfoPage>
        )
    }
}
export default withRouter(About);