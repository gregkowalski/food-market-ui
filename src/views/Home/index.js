import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { Image, Grid, Card, Button } from 'semantic-ui-react'
import './index.css'
import Autocomplete from '../../components/Autocomplete'
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



class Home extends React.Component {

    tagline;

    navigateToSearch = () => {
        this.props.history.push(Url.search());
    }

    navigateToCooks = () => {
        this.props.history.push(Url.cooks());
    }

    componentWillMount() {
        this.homefood = Util.getRandomItem([foodImg1, foodImg2, foodImg3]);
        this.homecook = Util.getRandomItem([cookImg1, cookImg2, cookImg3]);
        this.tagline = this.getRandomTagline();
    }

    getRandomTagline() {

        const taglines = [
            'Handcrafted to taste like home',
            // 'homemade + local',
            // 'Making good food taste better.',
            // 'Eat like family.',
            // 'Good food starts here.',
            // 'cooking is love you can taste.'
        ];

        let index = Util.getRandomInt(0, taglines.length - 1);
        return taglines[index];
    }

    autocompleteStyle(isValid) {
        const style = {};
        if (isValid) {
            style.border = '1px solid rgba(34, 36, 38, .15)';
        }
        else {
            style.border = '1px solid #e0b4b4';
            style.backgroundColor = '#fff6f6';
        }
        return style;
    }

    render() {
        const { buyerAddress, isBuyerAddressValid, onAddressSelected, onAddressChange, onAddressBlur } = this.props;

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
                            <div className='home-tagline'>{this.tagline}</div>
                            <div className='home-search-question'>Looking for something to eat? We got you.</div>
                            <div className='home-search'>

                                <Autocomplete
                                    style={this.autocompleteStyle(isBuyerAddressValid)}
                                    name='address'
                                    onPlaceSelected={onAddressSelected}
                                    onChange={onAddressChange}
                                    onBlur={onAddressBlur}
                                    types={['address']}
                                    placeholder='Enter your street address'
                                    componentRestrictions={{ country: 'ca' }}
                                    value={buyerAddress} />
                                {/* <Message
                            error={!isBuyerAddressValid}
                            hidden={isBuyerAddressValid}
                            visible={!isBuyerAddressValid}
                            header='Invalid address'
                            content='Please enter your delivery address' /> */}

                                <div>
                                    <div className='home-search-flex-grow'>
                                        <Button fluid color='purple' onClick={this.props.onPickupClick}>FIND FOOD NEAR ME</Button>
                                    </div>
                                </div>

                                {/* <div>
                                    <div className='home-search-flex-grow'>
                                        <Button fluid color='purple' onClick={this.props.onPickupClick}>PICK-UP</Button>
                                    </div>
                                    <span className='home-or-spacing'>or</span>
                                    <div className='home-search-flex-grow'>
                                        <Button fluid color='purple' onClick={this.props.onDeliveryClick}>DELIVERY</Button>
                                    </div>
                                </div> */}

                            </div>


                        </div>
                    </div>

                    <div className='home-explore'>
                        <div>Explore the marketplace</div>
                        <Grid stackable>
                            <Grid.Column width={5}>
                                <div className='home-explore-item' onClick={this.navigateToSearch}>
                                    <Image src={this.homefood} />
                                    <div>See all food</div>
                                </div>
                            </Grid.Column>
                            <Grid.Column width={5}>
                                <div className='home-explore-item' onClick={this.navigateToCooks}>
                                    <Image src={this.homecook} />
                                    <div>Discover local cooks</div>
                                </div>
                            </Grid.Column>
                            {/* <Grid.Column width={5}>
                                <div className='home-explore-item' onClick={this.navigateToSearch}>
                                    <Image src={joinImg1} />
                                    <div>Become a cook!</div>
                                </div>
                            </Grid.Column> */}
                        </Grid>
                    </div>

                    <div className='home-hoods'>
                        <div>Get food delivered to your neighbourhood</div>
                        <Grid stackable>
                            <Grid.Column width={8}>
                                <div onClick={this.navigateToSearch}>
                                    <Card fluid>
                                        <Image src={westendImg} />
                                        <div>West End</div>
                                    </Card>
                                </div>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <div onClick={this.navigateToSearch}>
                                    <Card fluid>
                                        <Image src={yaletownImg} />
                                        <div>Yaletown</div>
                                    </Card>
                                </div>
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