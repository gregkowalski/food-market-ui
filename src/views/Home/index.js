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
import Url from '../../services/Url'
import foodImg from './home-food.jpg'
import cookImg from './home-cook.jpg'
import westendImg from './home-westend.jpg'
import yaletownImg from './home-yaletown.jpg'

class Home extends React.Component {

    navigateToSearch = () => {
        this.props.history.push(Url.search());
    }

    render() {
        return (
            <div>
                <AppHeader />
                <div className='home'>
                    <div className='home-explore'>
                        <div>Explore Foodcraft</div>
                        <Grid stackable>
                            <Grid.Column width={6}>
                                <div className='home-explore-item' onClick={this.navigateToSearch}>
                                    <Image src={foodImg} />
                                    <div>Find Food</div>
                                </div>
                            </Grid.Column>
                            <Grid.Column width={6}>
                                <div className='home-explore-item' onClick={this.navigateToSearch}>
                                    <Image src={cookImg} />
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
                                        <Image src={westendImg} />
                                        <Card.Content>
                                            <Card.Header textAlign='center'>Westend</Card.Header>
                                        </Card.Content>
                                    </Card>
                                </div>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <div onClick={this.navigateToSearch}>
                                    <Card fluid>
                                        <Image src={yaletownImg} />
                                        <Card.Content>
                                            <Card.Header textAlign='center'>Yaletown</Card.Header>
                                        </Card.Content>
                                    </Card>
                                </div>
                            </Grid.Column>
                        </Grid>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Home);