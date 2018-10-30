import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Actions, Selectors } from '../../store/admin'
import AppHeader from '../../components/AppHeader'
import ErrorCodes from '../../services/ErrorCodes';
import Url from '../../services/Url'
import LoadingIcon from '../../components/LoadingIcon'
import CognitoUtil from '../../services/Cognito/CognitoUtil'

class InvitesCallback extends React.Component {

    componentWillMount() {
        const invite_id = this.props.match.params.invite_id;
        if (!invite_id) {
            CognitoUtil.redirectToLogin();
            return;
        }

        this.props.actions.acceptInvite(invite_id);
    }

    render() {
        const { acceptInviteResult } = this.props;

        let content;
        if (acceptInviteResult && acceptInviteResult.code !== ErrorCodes.SUCCESS) {
            const invite_id = this.props.match.params.invite_id;
            content = (<div>An error has occurred.  Please let us know by contacting <a href={Url.mailTo('support@foodcraft.ca', `Invite error (id=${invite_id})`)}>Foodcraft Support</a></div>);
        }
        else {
            content = <LoadingIcon size='large' />;
        }

        return (
            <div>
                <AppHeader simple />
                <div style={{ margin: 20 }}>
                    {content}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isAcceptingInvite: Selectors.isAcceptingInvite(state),
        acceptInviteResult: Selectors.acceptInviteResult(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return { actions: bindActionCreators(Actions, dispatch) };
};

InvitesCallback.propTypes = {
    acceptInviteResult: PropTypes.shape({
        code: PropTypes.string.isRequired,
    }),

    actions: PropTypes.shape({
        acceptInvite: PropTypes.func.isRequired,
    }).isRequired
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(InvitesCallback));
