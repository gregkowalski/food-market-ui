import React from 'react'
import AppHeader from './components/AppHeader'
import CognitoUtil from './Cognito/CognitoUtil'
import { Segment, Button, Image, Header, Grid, Icon } from 'semantic-ui-react'
import './ProfileView.css'
import FlagUser from './components/FlagUser'
import VerifiedInfo from './components/VerifiedInfo'
import ApiClient from './Api/ApiClient'
import jwtDecode from 'jwt-decode'
import { Link } from 'react-router-dom'

export default class ProfileView extends React.Component {

    user;
    isOwnProfile;
    emailVerified;
    phoneVerified;

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
        api.getPublicUser(userId)
            .then(response => {
                if (!response.data) {
                    return;
                }
                console.log(response.data);
                this.user = response.data;
                this.forceUpdate();
            })
            .catch(err => {
                console.error(err);
            })
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
                <div className='profileview-container'>
                    <div className='profileview-left'>
                        <div className='profileview-card'>
                            <Segment secondary attached='top'>
                                <div className='profileview-card-header'>Verified info</div>
                            </Segment>
                            <Segment attached>
                                <div className='profileview-card-items'>
                                    <VerifiedInfo isVerified={this.user.email_verified} label='Email' />
                                    <VerifiedInfo style={{marginTop: '20px'}} isVerified={this.user.phone_verified} label='Phone Number' />
                                </div>
                            </Segment>
                        </div>
                        <div className='profileview-card' style={{ marginTop: '20px' }}>
                            <Segment secondary attached='top'>
                                <div className='profileview-card-header'> About Me</div>
                            </Segment>
                            <Segment attached>
                                <div className='profileview-card-items'>
                                    <div style={{ textAlign: 'left' }}><strong>Languages</strong></div>
                                    <div style={{ textAlign: 'left', marginTop: '3px' }}> {this.user.lang}</div>
                                    <div style={{ clear: 'left' }}></div>
                                </div>
                            </Segment>
                        </div>
                    </div>
                    <div className='profileview-main'>
                        <Grid>
                            <Grid.Column style={{ padding: '0px' }} mobile={16} tablet={16} computer={13}>
                                <Image floated='left' verticalAlign='middle' size='small' shape='circular' src={this.user.image} />
                                <Header className='profileview-header' as='h1'>Hi, I'm {this.user.name}! </Header>
                                <div className='profileview-sub-header'>
                                    {this.user.city} · <span style={{ color: '#0fb5c3' }}> Joined in {this.user.join_date}</span>
                                </div>

                                <FlagUser />

                                <div style={{ clear: 'both' }}></div>

                                <div className='profileview-user-info'>{this.user.info}</div>

                                {this.isOwnProfile &&
                                    <div style={{ display: 'inline-flex' }}>
                                        <Link to={`/profile/edit/${this.user.user_id}`}>
                                            <Button color='blue'>Edit Profile</Button>
                                        </Link>
                                        <div style={{ marginTop: '8px' }}>(only you can see this)</div>
                                    </div>
                                }
                            </Grid.Column>
                        </Grid>
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
