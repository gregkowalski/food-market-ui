import React from 'react'
import AppHeader from './components/AppHeader'
import CognitoUtil from './Cognito/CognitoUtil'
import { Segment, Input, Form, Button, Image, Header, Grid, Icon } from 'semantic-ui-react'
import './ProfileView.css'
import FlagUser from './components/FlagUser'
import ApiClient from './Api/ApiClient'
import jwtDecode from 'jwt-decode'
import Util from './Util'
import { Link } from 'react-router-dom'

export default class ProfileView extends React.Component {

    state = {
        hasChanges: false
    };

    user;
    isOwnProfile;

    componentWillMount() {
        const userId = this.props.match.params.userId;

        const jwtToken = CognitoUtil.getLoggedInUserJwtToken();
        if (jwtToken) {
            const jwt = jwtDecode(jwtToken);
            if (userId === jwt.sub) {
                this.isOwnProfile = true;
            }
        }

        let api = new ApiClient();
        api.getUser(userId)
            .then(response => {
                //Util.busySleep(3);
                if (!response.data) {
                    return;
                }
                console.log(response.data);
                this.user = response.data;

                let newState = {
                    username: this.user.username,
                };
                this.setState(newState);
            })
            .catch(err => {
                console.error(err);
            })
    }

    handleChange(e) {
        let oldValue;
        if (this.state.jwt.hasOwnProperty(e.target.name)) {
            oldValue = this.state.jwt[e.target.name];
        }
        let newValue = e.target.value;
        if (oldValue !== newValue) {
            let newState = {
                hasChanges: true
            };
            newState[e.target.name] = e.target.value;
            this.setState(newState);
        }
    }

    handleSave(e) {
        if (!this.state.hasChanges) {
            return;
        }
    }

    render() {
        let content;
        if (!this.user) {
            content =
                <div style={{ marginTop: '70px', width: '100%' }}>
                    <div style={{ margin: '0 auto', width: '100px' }}>
                        <Icon loading name='refresh' />Loading...
                    </div>
                </div>
        }
        else {
            content =
                <div className="profileview-flex-container">
                    <div className="profileview-flex-item-left">
                        <div className='profileview-head-left'>
                            <div className='profileview-card'>
                                <Segment style={{ textAlign: 'left', fontWeight: 'bold' }} secondary attached='top'>
                                    <div className='profileview-card-header'>Verified info</div>
                                </Segment>
                                <Segment style={{ textAlign: 'center' }} attached>
                                    <div className='profileview-card-items'>
                                        <div style={{ float: 'left' }}>Email address</div>
                                        <Icon style={{ float: 'right' }} size='large' color='teal' name='check circle outline' />
                                        <div style={{ clear: 'both' }}></div>
                                        <div style={{ float: 'left', marginTop: '20px' }}>Phone number</div>
                                        <Icon style={{ float: 'right', marginTop: '20px' }} size='large' color='teal' name='check circle outline' />
                                        <div style={{ clear: 'both' }}></div>
                                    </div>
                                </Segment>
                            </div>
                            <div className='profileview-card'>
                                <Segment style={{ textAlign: 'left', marginTop: '20px', fontWeight: 'bold' }} secondary attached='top'>
                                    <div className='profileview-card-header'> About Me</div>
                                </Segment>
                                <Segment style={{ textAlign: 'center' }} attached>
                                    <div className='profileview-card-items'>
                                        <div style={{ textAlign: 'left' }}><strong>Languages</strong></div>
                                        <div style={{ textAlign: 'left', marginTop: '3px' }}> {this.user.lang}</div>
                                        <div style={{ clear: 'left' }}></div>
                                    </div>
                                </Segment>
                            </div>
                        </div>
                    </div>
                    <div style={{ paddingRight: '8%' }}>
                        <Grid>
                            <Grid.Column style={{ padding: '0px' }} mobile={16} tablet={16} computer={13}>
                                <div className='profileview-body'>
                                    <Image floated='left' verticalAlign='middle' size='small' shape='circular' src={this.user.image} />
                                    <Header className='profileview-header' as='h1'>Hi, I'm {this.user.name}! </Header>
                                    <div className='profileview-sub-header'>
                                        {this.user.city}  ·<span style={{ color: '#0fb5c3' }}> Joined in {this.user.join_date}</span>
                                    </div>

                                    <FlagUser />

                                    <div style={{ clear: 'both' }}></div>
                                    
                                    <div className='profileview-user-info'>{this.user.info}</div>

                                    {this.isOwnProfile &&
                                        <div style={{ display: 'inline-flex' }}>
                                            <Link to={`/profile/edit/${this.user.userId}`}>
                                                <Button color='blue'>Edit Profile</Button>
                                            </Link>
                                            <div style={{marginTop: '8px'}}>(only you can see this)</div>
                                        </div>
                                    }
                                </div>
                            </Grid.Column>
                        </Grid >
                    </div>
                </div>
        }

        return (
            <div>
                <AppHeader fixed />
                {content}
            </div >
        )
    }
}