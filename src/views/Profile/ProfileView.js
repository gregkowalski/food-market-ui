import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { Segment, Image, Header, Grid, Icon } from 'semantic-ui-react'
import './ProfileView.css'
import { Actions, Selectors } from '../../store/publicUser'
import AppHeader from '../../components/AppHeader'
import LoadingIcon from '../../components/LoadingIcon'
import { CertificationLabels } from '../../Enums'
import Util from '../../services/Util'

class ProfileView extends React.Component {

    componentWillMount() {
        const userId = this.props.match.params.userId;
        this.props.actions.loadPublicUser(userId);
    }

    render() {
        const { user, isLoading } = this.props;

        if (isLoading || !user) {
            return (
                <div>
                    <AppHeader fixed />
                    <div className='profileview-loading'>
                        <LoadingIcon size='large' />
                    </div>
                </div>
            );
        }

        return (
            <div>
                <AppHeader fixed />
                <ProfileViewComponent user={user} className='profileview-container' />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: Selectors.user(state),
        isLoading: Selectors.isLoading(state),
        apiError: Selectors.apiError(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return { actions: bindActionCreators(Actions, dispatch) };
};

ProfileView.propTypes = {
    user: PropTypes.shape({
        user_id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
    }),
    isLoading: PropTypes.bool.isRequired,
    apiError: PropTypes.any,
    actions: PropTypes.shape({
        loadPublicUser: PropTypes.func.isRequired,
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileView);

export const ProfileViewComponent = ({ user, className }) => {

    return (
        <div className={className}>
            <Grid className='profileview'>
                <Grid.Column computer={6} only='computer tablet'>
                    <Grid.Row>
                        <ImageSection user={user} />
                    </Grid.Row>
                    <Grid.Row>
                        <VerifiedInfoSection user={user} />
                    </Grid.Row>
                    <Grid.Row>
                        <CertificationsSection user={user} />
                    </Grid.Row>
                </Grid.Column>
                <Grid.Column computer={10} only='computer tablet'>
                    <UserHeaderSection user={user} greeting />
                    <UserInfoSection user={user} simple />
                </Grid.Column>
                <Grid.Column mobile={16} only='mobile'>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column mobile={5}>
                                <ImageSection user={user} />
                            </Grid.Column>
                            <Grid.Column mobile={11}>
                                <UserHeaderSection user={user} />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column mobile={16}>
                                <UserInfoSection user={user} />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column mobile={16}>
                                <VerifiedInfoSection user={user} />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column mobile={16}>
                                <CertificationsSection user={user} />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Grid.Column>
            </Grid>
        </div>
    );
}


const ImageSection = ({ user }) => {
    return (
        <Image src={user.image || '/assets/images/new-food.png'} />
    )
}

const VerifiedInfoSection = ({ user }) => {
    return (
        <div>
            <Header className='profileview-card-header' block attached='top'>Verified Info</Header>
            <Segment attached>
                <div className='profileview-card-items'>
                    <VerifiedInfo label='Email' isVerified={user.email_verified} />
                    <VerifiedInfo label='Phone Number' isVerified={user.phone_verified} />
                </div>
            </Segment>
        </div>
    )
}

const VerifiedInfo = ({ isVerified, label }) => {

    if (!isVerified) {
        return null;
    }

    let iconName = isVerified ? 'check circle outline' : 'remove circle outline';
    let iconColor = isVerified ? 'teal' : 'red';
    return (
        <div className='profileview-verifiedinfo'>
            <div>{label}</div>
            <Icon size='large' color={iconColor} name={iconName} />
        </div>);
}

const CertificationsSection = ({ user }) => {
    return (
        <div>
            <Header className='profileview-card-header' block attached='top'>Certifications</Header>
            <Segment attached>
                <div className='profileview-card-items'>
                    {user.certifications && user.certifications.map((cert, index) => {
                        return (<div key={index}>{CertificationLabels[cert]}</div>);
                    })}
                </div>
            </Segment>
        </div>
    )
}

const UserInfoSection = ({ user, simple }) => {
    if (!user.info)
        return null;

    if (simple) {
        return (
            <div className='profileview-user-info'>{user.info}</div>
        );
    }

    return (
        <div>
            <Header className='profileview-card-header' block attached='top'>About Me</Header>
            <Segment attached>
                <div className='profileview-user-info'>{user.info}</div>
            </Segment>
        </div>
    )
}

const UserHeaderSection = ({ user, greeting }) => {

    let join_date;
    if (user.join_date) {
        join_date = Util.toCurrentTimezoneMoment(user.join_date);
    }

    let greetingText = user.username;
    if (greeting) {
        greetingText = `Hi, I'm ${user.username}!`;
    }

    return (
        <div>
            <div className='profileview-user-greeting'>{greetingText}</div>
            {join_date &&
                <div className='profileview-user-joindate'>
                    Joined in {join_date.format('MMMM YYYY')}
                </div>
            }
        </div>
    )
}
