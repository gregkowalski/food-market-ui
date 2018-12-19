import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Button } from 'semantic-ui-react'
import './index.css'
import AppHeader from '../../components/AppHeader'
import { Actions, Selectors, ProfileViews } from './redux'
import { ProfileViewComponent } from './ProfileView'
import ProfileEdit from './ProfileEdit'

class Profile extends React.Component {

    handleSelectEditProfile = () => {
        this.props.actions.editProfile();
    }

    handleSelectViewProfile = () => {
        this.props.actions.viewProfile();
    }

    render() {
        const { currentView, user } = this.props;
        const editStyle = {
            textDecoration: currentView === ProfileViews.EDIT ? 'underline' : 'none'
        }

        const viewStyle = {
            textDecoration: currentView === ProfileViews.VIEW ? 'underline' : 'none'
        }

        return (
            <div>
                <AppHeader fixed />
                <div className='profile-side'>
                    <div style={editStyle} onClick={this.handleSelectEditProfile}>Edit Profile</div>
                    <div style={viewStyle} onClick={this.handleSelectViewProfile}>View Profile</div>
                    <Button color='purple' className='profile-save-button' type='submit'
                    // disabled={pristine && !this.state.didSelectedIntervalsChange}
                    // loading={submitting}
                    // onClick={handleSubmit(this.handleSave)}
                    >Save profile</Button>
                    {/* {message && message.show &&
                        <Message className='profileedit-save-confirm' floating size='tiny'
                            onDismiss={() => this.setState({ message: { show: false } })}>
                            {message.content}
                        </Message>
                    } */}
                </div>
                {currentView === ProfileViews.VIEW &&
                    <ProfileViewComponent user={user} />
                }
                {currentView === ProfileViews.EDIT &&
                    <ProfileEdit />
                }
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        currentView: Selectors.currentView(state),
        user: Selectors.currentUser(state)
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Actions, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);