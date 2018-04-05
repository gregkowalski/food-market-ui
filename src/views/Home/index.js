import React from 'react'
import { withRouter } from 'react-router-dom'
// import { connect } from 'react-redux'
// import { bindActionCreators } from 'redux'
// import PropTypes from 'prop-types'
import { Image, Grid, Card } from 'semantic-ui-react'
import './index.css'
// import Constants from '../../Constants'
// import { Actions, Selectors } from '../../store/order'
import AppHeader from '../../components/AppHeader'
import AppFooter from '../../components/AppFooter'
import Url from '../../services/Url'
import Util from '../../services/Util'
import foodImg1 from './home-food1.jpg'
import foodImg2 from './home-food2.jpg'
import foodImg3 from './home-food3.jpg'
import cookImg1 from './home-cook1.jpg'
import cookImg2 from './home-cook2.jpg'
import cookImg3 from './home-cook3.jpg'
import westendImg from './home-westend.jpg'
import yaletownImg from './home-yaletown.jpg'

class Home extends React.Component {

    navigateToSearch = () => {
        this.props.history.push(Url.search());
    }

    componentWillMount() {
        this.homefood = Util.getRandomItem([foodImg1, foodImg2, foodImg3]);
        this.homecook = Util.getRandomItem([cookImg1, cookImg2, cookImg3]);
    }

    render() {
        return (
            <div>
                <AppHeader />
                <div className='home'>
                    <div className='home-explore'>
                        <div>Explore the marketplace</div>
                        <Grid stackable>
                            <Grid.Column width={6}>
                                <div className='home-explore-item' onClick={this.navigateToSearch}>
                                    <Image src={this.homefood} />
                                    <div>Find Food</div>
                                </div>
                            </Grid.Column>
                            <Grid.Column width={6}>
                                <div className='home-explore-item' onClick={this.navigateToSearch}>
                                    <Image src={this.homecook} />
                                    <div>Meet Cooks</div>
                                </div>
                            </Grid.Column>
                        </Grid>
                    </div>
                    <div className='home-hoods'>
                        <div>Search by neighbourhood</div>
                        <Grid stackable>
                            <Grid.Column width={8}>
                                <div onClick={this.navigateToSearch}>
                                    <Card fluid>
                                        <div className='home-hoods-image'>
                                            <Image src={westendImg} />
                                        </div>
                                        <Card.Content>
                                            <Card.Header textAlign='center'>Westend</Card.Header>
                                        </Card.Content>
                                    </Card>
                                </div>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <div onClick={this.navigateToSearch}>
                                    <Card fluid>
                                        <div className='home-hoods-image'>
                                            <Image src={yaletownImg} />
                                        </div>
                                        <Card.Content>
                                            <Card.Header textAlign='center'>Yaletown</Card.Header>
                                        </Card.Content>
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