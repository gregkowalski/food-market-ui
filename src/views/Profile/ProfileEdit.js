import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Field, reduxForm } from 'redux-form'
import PropTypes from 'prop-types'
import { Segment, Button, Header, Grid, Input, Icon } from 'semantic-ui-react'
import crypto from 'crypto'
import './ProfileEdit.css'
import AppHeader from '../../components/AppHeader'
import LoadingIcon from '../../components/LoadingIcon'
import StripeUtil from '../../services/Stripe/StripeUtil'
import { Actions as CurrentUserActions, Selectors as CurrentUserSelectors } from '../../store/currentUser'
import { Actions, Selectors, ProfileViews } from '../../store/profile'
import { Certifications, CertificationLabels, DaysOfWeek } from '../../Enums';
import StripeComponent from './StripeComponent'
import { ValidatedAutocomplete, ValidatedDropdown, ValidatedField, ValidatedTextArea } from '../../components/Validation'
import moment from 'moment'
import Calendar from 'react-week-calendar'
import 'react-week-calendar/dist/style.css'
import { ProfileViewComponent } from './ProfileView'
import { Colors } from '../../Constants'

import PhoneVerificationComponent from './PhoneVerificationComponent'

const certificationOptions = [
    {
        key: Certifications.foodsafe_level1,
        value: Certifications.foodsafe_level1,
        text: CertificationLabels.foodsafe_level1
    },
    {
        key: Certifications.foodsafe_level2,
        value: Certifications.foodsafe_level2,
        text: CertificationLabels.foodsafe_level2
    },
    {
        key: Certifications.market_safe,
        value: Certifications.market_safe,
        text: CertificationLabels.market_safe
    },
    {
        key: Certifications.pro_caterer,
        value: Certifications.pro_caterer,
        text: CertificationLabels.pro_caterer
    },
];

const availabilityKeys = [
    DaysOfWeek.monday, DaysOfWeek.tuesday, DaysOfWeek.wednesday, DaysOfWeek.thursday,
    DaysOfWeek.friday, DaysOfWeek.saturday, DaysOfWeek.sunday
];

class ProfileEdit extends React.Component {

    state = {
        selectedIntervals: undefined,
        didSelectedIntervalsChange: false,
    };

    componentWillMount() {
        this.props.actions.loadCurrentUser();
    }

    componentWillReceiveProps(nextProps) {
        const { user } = this.props;
        if (user && !this.state.selectedIntervals) {
            if (user.availability) {
                let selectedIntervals = [];
                for (let day in user.availability) {
                    let dayOfWeek = availabilityKeys.findIndex((d) => d === day) + 1;
                    for (let hour of user.availability[day]) {
                        // using 2018-01-0x as the first day happens to be a Monday and a datetime object is required
                        let start = moment.utc('2018-01-0' + dayOfWeek + 'T' + hour + ':00', moment.ISO_8601).local();
                        let interval = {
                            start: start,
                            end: start.clone().add(1, 'hour'),
                            uid: dayOfWeek + '-' + hour,
                            value: ''
                        };
                        selectedIntervals.push(interval);
                    }
                };
                this.setState({ selectedIntervals: selectedIntervals });
            }
        }
    }

    handleSave = (user) => {
        const { selectedIntervals } = this.state;
        let availability = {};
        for (let interval of selectedIntervals) {
            let segments = interval.uid.split('-');
            let weekday = segments[0];
            let key = availabilityKeys[weekday - 1];
            if (availability[key] === undefined)
                availability[key] = [];

            let hour = segments[1];
            availability[key].push(hour);
        }
        user.availability = availability;
        this.setState({ didSelectedIntervalsChange: false });

        console.log(user);
        console.log('saving...');
        return this.props.actions.saveUser(user);
    }

    handleConnectStripeClick = (e) => {
        e.preventDefault();

        const state = crypto.randomBytes(64).toString('hex');
        let stripeConnectUrl = StripeUtil.getStripeConnectUrl(state);
        StripeUtil.setCsrfState(state);
        window.open(stripeConnectUrl, '_self');
    }

    handleCalendarSelect = (intervals) => {
        const { selectedIntervals } = this.state;
        let didSelectedIntervalsChange = false;

        for (let interval of intervals) {
            let addMode = undefined;

            // go through intervals of selected range to check if previously already selected
            while (interval.start < interval.end) {
                interval.start.utc();
                let uid = interval.start.isoWeekday() + interval.start.format('-HH:mm');
                interval.start.local();

                // eslint-disable-next-line
                let index = selectedIntervals.findIndex((interval) => interval.uid === uid)

                if (addMode === undefined)
                    addMode = (index === -1);

                // add or remove 1 hour intervals based on selected range
                if (addMode) {
                    if (index === -1) {
                        selectedIntervals.push({
                            start: interval.start.clone(),
                            end: interval.start.clone().add(1, 'hour'),
                            uid: uid,
                            value: ''
                        });
                        didSelectedIntervalsChange = true;
                    }
                } else if (index > -1) {
                    selectedIntervals.splice(index, 1);
                    didSelectedIntervalsChange = true;
                }

                interval.start.add(1, 'hour');
            }
        };

        this.setState({
            selectedIntervals: selectedIntervals,
            didSelectedIntervalsChange: didSelectedIntervalsChange
        });
    }

    handleCalendarEventRemove = (event) => {
        const { selectedIntervals } = this.state;
        const index = selectedIntervals.findIndex((interval) => interval.uid === event.uid);
        if (index > -1) {
            selectedIntervals.splice(index, 1);
            this.setState({
                selectedIntervals: selectedIntervals,
                didSelectedIntervalsChange: true
            });
        }
    }

    handleSelectEditProfile = () => {
        this.props.actions.editProfile();
    }

    handleSelectViewProfile = () => {
        this.props.actions.viewProfile();
    }

    handleChangePhoneClick = () => {
        if (!this.props.showChangePhoneView) {
            this.props.actions.showChangePhoneView();
        }
        else {
            this.props.actions.hideChangePhoneView();
        }
    }

    render() {
        const { handleSubmit, pristine, submitting } = this.props;
        const { isLoadingProfile, isSavingProfile, user, currentView, showChangePhoneView } = this.props;

        if (isLoadingProfile) {
            return (
                <div>
                    <AppHeader fixed />
                    <div className='profileedit-loading'>
                        <LoadingIcon size='large' />
                    </div>
                </div>
            );
        }

        const hasValidPhone = user.phone && user.phone_verified;

        return (
            <div>
                <AppHeader fixed />
                <ProfileSideView
                    currentView={currentView}
                    onEditProfile={this.handleSelectEditProfile}
                    onViewProfile={this.handleSelectViewProfile}
                >
                    {currentView === ProfileViews.EDIT &&
                        <Button color='purple' type='submit'
                            disabled={pristine && !this.state.didSelectedIntervalsChange}
                            loading={submitting || isSavingProfile}
                            onClick={handleSubmit(this.handleSave)}>Save profile</Button>
                    }
                </ProfileSideView>
                <div className='profileedit-main'>
                    {currentView === ProfileViews.VIEW &&
                        <ProfileViewComponent className='profileedit-view-container' user={user} />
                    }
                    {currentView === ProfileViews.EDIT &&
                        <Grid>
                            <Grid.Column>
                                <Header className='profileedit-header' block attached='top'>Contact Info</Header>
                                <Segment attached>
                                    <Grid stackable className='profileedit-grid-body' columns='equal'>
                                        <Grid.Row>
                                            <Grid.Column computer={3} tablet={16}>Email <Icon className='profileedit-secured-input' name='lock' /></Grid.Column>
                                            <Grid.Column computer={13} tablet={16}>
                                                <Input value={user.email} disabled={true} />
                                                <div className='profileedit-input-descriptions'>
                                                    Your email is never displayed publicly. It is only shared when you have a confirmed order request with another Foodcraft user.
                                                </div>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column computer={3} tablet={16}>Phone <Icon className='profileedit-secured-input' name='lock' /></Grid.Column>
                                            <Grid.Column computer={13} tablet={16}>
                                                <div className='profileedit-phone'>
                                                    <Input value={user.phone} disabled={true} placeholder='Add your phone number' />
                                                    <Button color='purple' onClick={this.handleChangePhoneClick}>
                                                        {hasValidPhone &&
                                                            <div>Change</div>
                                                        }
                                                        {!hasValidPhone &&
                                                            <div>Add</div>
                                                        }
                                                    </Button>
                                                </div>
                                                <div className='profileedit-input-descriptions'>We will never share your private phone number without your permission.</div>
                                            </Grid.Column>
                                        </Grid.Row>
                                        {showChangePhoneView &&
                                            <Grid.Row>
                                                <Grid.Column only='computer' computer={3}></Grid.Column>
                                                <Grid.Column computer={13} tablet={16}>
                                                    <label><Icon name='mobile alternate' color='purple' /> Phone Verification</label>
                                                    <PhoneVerificationComponent />
                                                </Grid.Column>
                                            </Grid.Row>
                                        }
                                    </Grid>
                                </Segment>
                                <Header className='profileedit-header' block attached='top'>Contact Preferences</Header>
                                <Segment attached>
                                    <Grid stackable className='profileedit-grid-body'>
                                        <Grid.Row>
                                            <Grid.Column computer={3} tablet={16}>Phone Notifications</Grid.Column>
                                            <Grid.Column computer={13} tablet={16}>
                                                <div className='profileedit-checkbox'>
                                                    <Field id='phone_notifications' name='phone_notifications' component='input' type='checkbox'
                                                        disabled={!hasValidPhone} />
                                                    {hasValidPhone &&
                                                        <label className='profileedit-input-descriptions' htmlFor='phone_notifications'>
                                                            Check the box to enable phone SMS notifications about your orders (provider charges may apply)
                                                        </label>
                                                    }
                                                    {!hasValidPhone &&
                                                        <label className='profileedit-input-descriptions' htmlFor='phone_notifications'>
                                                            To enable SMS notifications about your orders, first add a phone number under <strong>Contact Info</strong>
                                                        </label>
                                                    }
                                                </div>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column computer={3} tablet={16}>Mailing List</Grid.Column>
                                            <Grid.Column computer={13} tablet={16}>
                                                <div className='profileedit-checkbox'>
                                                    <Field id='email_notifications' name='email_notifications' component='input' type='checkbox' />
                                                    <label className='profileedit-input-descriptions' htmlFor='email_notifications'>
                                                        Check the box to subscribe to our mailing list
                                                    </label>
                                                </div>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Segment>
                                <Header className='profileedit-header' block attached='top'>About</Header>
                                <Segment attached>
                                    <Grid stackable className='profileedit-grid-body' columns='equal'>
                                        <Grid.Row>
                                            <Grid.Column computer={3} tablet={16}>Profile Name</Grid.Column>
                                            <Grid.Column computer={13} tablet={16}>
                                                <Field name='username' autoComplete='username' component={ValidatedField} type='text' placeholder='Enter your public name' />
                                                <div className='profileedit-input-descriptions'>
                                                    This is the name shown on your public profile.
                                                </div>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column computer={3} tablet={16}>Full Name <Icon className='profileedit-secured-input' name='lock' /></Grid.Column>
                                            <Grid.Column computer={13} tablet={16}>
                                                <Field name='name' autoComplete='name' component={ValidatedField} type='text' placeholder='Enter your full name' />
                                                <div className='profileedit-input-descriptions'>
                                                    Your full name is never shown publicly. When you order food, your cook will see your full name.
                                                </div>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column computer={3} tablet={16}>Address <Icon className='profileedit-secured-input' name='lock' /></Grid.Column>
                                            <Grid.Column computer={13} tablet={16}>
                                                <Field name='address' className='profileedit-address' autoComplete='address' component={ValidatedAutocomplete} type='text' placeholder="What is your address?" />
                                                <div className='profileedit-input-descriptions'>
                                                    <p>We take your privacy seriously. Your address is never shown publicly. We use this data to improve our geosearch and matching.
                                                    </p>
                                                    <p><strong>Address is required for cooks.</strong> This address will be used as your default pick-up location for your orders unless otherwise specified.</p>
                                                </div>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column computer={3} tablet={16}>Bio</Grid.Column>
                                            <Grid.Column computer={13} tablet={16}>
                                                <Field name='info' autoComplete='info' component={ValidatedTextArea} rows={2} type='text' placeholder='Tell everyone about yourself' />
                                                <div className='profileedit-input-descriptions'>
                                                    Let other people in the Foodcraft community get to know you.
                                                    <div style={{ marginTop: '5px' }}>
                                                        What are some things you like to do? Or share the 5 foods you can't live without. Do you have a food philosophy? Share your life motto!
                                                    </div>
                                                </div>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column computer={3} tablet={16}>Food Certifications</Grid.Column>
                                            <Grid.Column computer={13} tablet={16}>
                                                <Field name='certifications' autoComplete='certifications' placeholder="What are your certifications?"
                                                    fluid multiple search selection
                                                    options={certificationOptions} component={ValidatedDropdown} />
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Segment>
                                <Header className='profileedit-header' block attached='top'>Cook Info</Header>
                                <Segment attached >
                                    <StripeComponent has_stripe_account={user.has_stripe_account} onConnectStripe={this.handleConnectStripeClick} />
                                </Segment>
                                {user.has_stripe_account &&
                                    <Header className='profileedit-header' block attached='top'>Weekly Availability for Orders</Header>
                                }
                                {user.has_stripe_account &&
                                    <Segment attached>
                                        <div className="profileedit-availability-text">
                                            <p>
                                                Select the times for when your food is <strong><i>ready</i></strong> for pick up and delivery.
                                            </p>
                                            <p>
                                                Your customers will be able to request orders from you only during the times you select below.
                                                Remember to consider the time it takes you to make food (and to complete delivery if applicable)!
                                            </p>
                                        </div>
                                        <Calendar
                                            useModal={false}
                                            // using 2018-01-01 to 2018-01-07 as they happen to be Monday to Friday, and datetime objects are needed 
                                            firstDay={moment('2018-01-01', moment.ISO_8601)}
                                            startTime={moment('2018-01-01T06:00:00', moment.ISO_8601)}
                                            endTime={moment('2018-01-07T20:00:00', moment.ISO_8601)}
                                            scaleUnit={60}
                                            dayFormat='ddd'
                                            selectedIntervals={this.state.selectedIntervals}
                                            onIntervalSelect={this.handleCalendarSelect}
                                            onEventClick={this.handleCalendarEventRemove}
                                        />
                                    </Segment>
                                }
                            </Grid.Column>
                        </Grid>
                    }
                </div>
            </div>
        );
    }
}

const ProfileSideView = ({ currentView, onEditProfile, onViewProfile, children }) => {

    const style = (isActive) => {
        const props = {
            display: 'inline-block'
        };
        if (isActive) {
            // props.textDecoration = 'underline';
            props.borderBottom = `2px solid ${Colors.purple}`;
            props.color = Colors.purple;
            props.fontWeight = 500;
        }
        return props;
    }

    const editStyle = style(currentView === ProfileViews.EDIT);
    const viewStyle = style(currentView === ProfileViews.VIEW);

    return (
        <div className='profileedit-side'>
            <div className='profileedit-side-link'>
                <div style={editStyle} onClick={onEditProfile}>Edit Profile</div>
            </div>
            <div className='profileedit-side-link'>
                <div style={viewStyle} onClick={onViewProfile}>View Profile</div>
            </div>
            {children}
        </div>
    );
}

const validate = (values, props) => {
    const errors = {};

    if (!values.username) {
        errors.username = { header: 'Public name is required', message: 'Please enter your public name' };
    }

    if (!values.name) {
        errors.name = { header: 'Full name is required', message: 'Please enter your full name' };
    }

    // Cook validation
    const { user } = props;
    if (user.has_stripe_account) {
        if (!values.address) {
            errors.address = { header: 'Address is required for cooks', message: 'Please enter your address' };
        }
    }

    return errors;
}

ProfileEdit.propTypes = {
    user: PropTypes.shape({
        user_id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
    }),
    isLoadingProfile: PropTypes.bool.isRequired,
    isSavingProfile: PropTypes.bool.isRequired,
    actions: PropTypes.shape({
        loadCurrentUser: PropTypes.func.isRequired,
        saveUser: PropTypes.func.isRequired
    })
}

const mapStateToProps = (state) => {
    return {
        user: CurrentUserSelectors.currentUser(state),
        isLoadingProfile: CurrentUserSelectors.isLoading(state),

        isSavingProfile: Selectors.isSavingProfile(state),
        currentView: Selectors.currentView(state),
        showChangePhoneView: Selectors.showChangePhoneView(state),

        initialValues: CurrentUserSelectors.currentUser(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    const profileActions = bindActionCreators(Actions, dispatch);
    const currentUserActions = bindActionCreators(CurrentUserActions, dispatch);
    const actions = Object.assign({}, profileActions, currentUserActions);
    return { actions };
};

const reduxFormName = 'profileEdit';
const form = reduxForm({ form: reduxFormName, validate, enableReinitialize: true })(ProfileEdit);
const connectedForm = connect(mapStateToProps, mapDispatchToProps)(form);
export default withRouter(connectedForm);
