import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import moment from 'moment-timezone'
import { Segment, Image, Header } from 'semantic-ui-react'
import './ProfileView.css'
import { Actions, Selectors } from '../../store/publicUser'
import AppHeader from '../../components/AppHeader'
import FlagUser from '../../components/FlagUser'
import LoadingIcon from '../../components/LoadingIcon'
import VerifiedInfo from './VerifiedInfo'
import { CertificationLabels } from '../../Enums'
import { Constants } from '../../Constants'

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
                    <div style={{ marginTop: '70px', width: '100%' }}>
                        <div style={{ margin: '0 auto', width: '100px' }}>
                            <LoadingIcon />
                        </div>
                    </div>
                </div >
            );
        }

        let join_date;
        if (user.join_date) {
            join_date = moment(user.join_date, moment.ISO_8601).tz(Constants.Timezone);
        }

        return (
            <div>
                <AppHeader fixed />
                <div className='profileview-container'>
                    <div className='profileview-left'>
                        <div className='profileview-card'>
                            <Header className='profileview-card-header' block attached='top'>Verified Info</Header>
                            <Segment attached>
                                <div className='profileview-card-items'>
                                    <VerifiedInfo label='Email' isVerified={user.email_verified} />
                                    <VerifiedInfo label='Phone Number' isVerified={user.phone_verified} />
                                </div>
                            </Segment>
                        </div>
                        <div className='profileview-card' style={{ marginTop: '20px' }}>
                            <Header className='profileview-card-header' block attached='top'>About Me</Header>
                            <Segment attached>
                                <div className='profileview-card-items profileview-about-me'>
                                    <div>Certifications</div>
                                    {user.certifications && user.certifications.map(cert => {
                                        return (<div>{CertificationLabels[cert]}</div>);
                                    })}
                                </div>
                            </Segment>
                        </div>
                    </div>
                    <div className='profileview-main'>

                        <Image floated='left' verticalAlign='middle' size='small' circular src={user.image} />
                        <div className='profileview-header'>Hi, I'm {user.name}!</div>
                        {join_date &&
                            <div className='profileview-sub-header'>
                                Joined in {join_date.format('MMMM YYYY')}
                            </div>
                        }
                        <FlagUser />
                        <div style={{ clear: 'both' }}></div>
                        <div className='profileview-user-info'>{user.info}</div>

                    </div>
                </div>
            </div >
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
    return {
        actions: bindActionCreators(Actions, dispatch),
    };
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
