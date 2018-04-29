import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { Image, Grid, Card } from 'semantic-ui-react'
import queryString from 'query-string'
import './index.css'
import HomeHeader from '../../components/HomeHeader'
import AppFooter from '../../components/AppFooter'
import Url from '../../services/Url'
import Util from '../../services/Util'
import foodImg1 from './home-food1.jpg'
import foodImg2 from './home-food2.jpg'
import foodImg3 from './home-food3.jpg'
import cookImg1 from './home-cook1.jpg'
import cookImg2 from './home-cook2.jpg'
import cookImg3 from './home-cook3.jpg'
// import joinImg1 from './home-join1.jpg'
import westendImg from './home-westend.jpg'
import yaletownImg from './home-yaletown.jpg'
// import backgroundImg from './home-background-crop.jpg'
// import backgroundImg1 from './home-background-mid.jpg'
import AddressFoodSearchBox from './AddressFoodSearchBox'
import { RegionIds } from '../../components/Map/Regions'
import { DeliveryOptions } from '../../Enums'

class Home extends React.Component {

    componentWillMount() {
        this.homefood = Util.getRandomItem([foodImg1, foodImg2, foodImg3]);
        this.homecook = Util.getRandomItem([cookImg1, cookImg2, cookImg3]);
    }

    searchByLocation = (loc) => {
        const qs = queryString.parse(this.props.location.search);
        const query = Object.assign({ d: DeliveryOptions.pickup }, qs, loc);
        const url = Url.search(query);
        this.props.history.push(url);
    }

    render() {
        return (
            <div>
                <HomeHeader />
                <div className='home'>
                    <div className='home-top'>
                        <div className='home-top-image'>
                            {/* <Image src={backgroundImg1} /> */}
                        </div>
                        <div className='home-top-content'>
                            <div className='home-howto'>
                                <Link to={Url.howto()}>How It Works</Link>
                                <div className='home-link-separator'>|</div>
                                <Link to={Url.whycook()}>Become A Cook</Link>
                            </div>
                            <div className='home-tagline'>Handcrafted to taste like home</div>

                            <div className='home-search-question'>Looking for something to eat? We got you.</div>
                            <AddressFoodSearchBox onSearchByLocation={this.searchByLocation} />

                        </div>
                    </div>

                    <div className='home-explore'>
                        <div>Explore the marketplace</div>
                        <Grid stackable>
                            <Grid.Column width={5}>
                                <Link to={Url.search()}>
                                    <div className='home-explore-item'>
                                        <Image src={this.homefood} />
                                        <div>See all food</div>
                                    </div>
                                </Link>
                            </Grid.Column>
                            <Grid.Column width={5}>
                                <Link to={Url.cooks()}>
                                    <div className='home-explore-item'>
                                        <Image src={this.homecook} />
                                        <div>Discover local cooks</div>
                                    </div>
                                </Link>
                            </Grid.Column>
                        </Grid>
                    </div>

                    <div className='home-hoods'>
                        <div>Get food delivered to your neighbourhood</div>
                        <Grid stackable>
                            <Grid.Column width={8}>
                                <Link to={Url.search({ r: RegionIds.VancouverWestEnd, d: DeliveryOptions.delivery })}>
                                    <Card fluid>
                                        <Image src={westendImg} />
                                        <div>West End</div>
                                    </Card>
                                </Link>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Link to={Url.search({ r: RegionIds.VancouverYaletown, d: DeliveryOptions.delivery })}>
                                    <Card fluid>
                                        <Image src={yaletownImg} />
                                        <div>Yaletown</div>
                                    </Card>
                                </Link>
                            </Grid.Column>
                        </Grid>
                    </div>
                </div>
                <AppFooter />
            </div>
        );
    }
}

export default withRouter(Home);