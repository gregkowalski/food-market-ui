import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Field, reduxForm } from 'redux-form'
import PropTypes from 'prop-types'
import { Segment, Button, Header, Grid, Message } from 'semantic-ui-react'
import { Divider, Icon } from 'semantic-ui-react'
import crypto from 'crypto'
import './ProfileEdit.css'
import Util from '../../services/Util'
import Url from '../../services/Url'
import AppHeader from '../../components/AppHeader'
import LoadingIcon from '../../components/LoadingIcon'
import CognitoUtil from '../../services/Cognito/CognitoUtil'
import StripeUtil from '../../services/Stripe/StripeUtil'
import { Actions, Selectors } from '../../store/currentUser'
import { Certifications, CertificationLabels, DaysOfWeek } from '../../Enums';
import StripeComponent from './StripeComponent'
import { ValidatedAutocomplete, ValidatedDropdown, ValidatedField, ValidatedTextArea } from '../../components/Validation'
import moment from 'moment'
import Calendar from 'react-week-calendar'
import 'react-week-calendar/dist/style.css'

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
        didSelectedIntervalsChange: false
    };

    componentWillMount() {
        this.props.actions.loadCurrentUser();
        this.isExternalIdp = CognitoUtil.isExternalIdp(CognitoUtil.getLoggedInUserJwt());
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.isSaving && !nextProps.isSaving) {

            // We finished saving, let's set the appropriate success or error messages
            if (nextProps.apiError) {
                console.log(nextProps.apiError);
                this.setState({ message: { show: true, content: `Oops, your profile was not saved. Error: ${nextProps.apiError}` } });
            }
            else {
                this.setState({ message: { show: true, content: "Success! Your profile has been updated." } });
            }
        }

        const{user} = this.props;
        if(user && this.state.selectedIntervals === undefined) {
            if(user.availability !== undefined) {
                let selectedIntervals = [];
                for(let day in user.availability) {
                    let dayOfWeek = availabilityKeys.findIndex((d) => d === day) + 1;
                    for(let hour of user.availability[day]) {
                        // using 2018-01-0x as the first day happens to be a Monday and a datetime object is required
                        let start = moment('2018-01-0' + dayOfWeek + 'T' + hour + ':00', moment.ISO_8601)
                        let interval = {
                            start: start,
                            end: start.clone().add(1, 'hour'),
                            uid: dayOfWeek + '-' + hour,
                            value: ''
                        };
                        selectedIntervals.push(interval);
                    }
                };
                this.setState({selectedIntervals: selectedIntervals});
            }
        }
    }

    navigateToProfileView = () => {
        this.props.history.push(Url.profileView(this.props.user.user_id));
    }

    handleSave = (user) => {
        const {selectedIntervals} = this.state;
        let availability = {};
        for(let interval of selectedIntervals) {
            let segments = interval.uid.split('-');
            let weekday = segments[0];
            let key = availabilityKeys[weekday - 1];
            if(availability[key] === undefined)
                availability[key] = [];

            let hour = segments[1];
            availability[key].push(hour);
        }
        user.availability = availability;
        this.setState({didSelectedIntervalsChange: false});

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
        const {selectedIntervals} = this.state;
        let didSelectedIntervalsChange = false;

        for(let interval of intervals) {
            let addMode = undefined;

            // go through intervals of selected range to check if previously already selected
            while(interval.start < interval.end) {
                let uid = interval.start.isoWeekday() + interval.start.format('-HH:mm');
                
                // eslint-disable-next-line
                let index = selectedIntervals.findIndex((interval) => interval.uid === uid)

                if(addMode === undefined)
                    addMode = (index === -1);

                // add or remove 1 hour intervals based on selected range
                if(addMode) {
                    if(index === -1) {
                        selectedIntervals.push({
                            start: interval.start.clone(),
                            end: interval.start.clone().add(1, 'hour'),
                            uid: uid,
                            value: ''
                        });
                        didSelectedIntervalsChange = true;
                    }
                } else if(index > -1) {
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
        const {selectedIntervals} = this.state;
        const index = selectedIntervals.findIndex((interval) => interval.uid === event.uid);
        if (index > -1) {
            selectedIntervals.splice(index, 1);
            this.setState({
                selectedIntervals: selectedIntervals,
                didSelectedIntervalsChange: true
            });
        }
    };

    render() {
        const { isLoading, user } = this.props;
        const { handleSubmit, pristine, submitting } = this.props;
        const { message } = this.state;

        if (isLoading) {
            return (
                <div>
                    <AppHeader fixed />
                    <div style={{ marginTop: '70px', width: '100%' }}>
                        <div style={{ margin: '0 auto', width: '100px' }}>
                            <LoadingIcon />
                        </div>
                    </div>
                </div>
            );
        }

        // Disable all email editing for now as we don't have code
        // written to update cognito email
        const emailEditingEnabled = !this.isExternalIdp && false;

        return (
            <div>
                <AppHeader fixed />
                <div className='profileedit-main'>
                    <div className='profileedit-title'>
                        <div>Edit Profile</div>
                        <Button onClick={this.navigateToProfileView}>View Profile</Button>
                    </div>
                    <Grid>
                        <Grid.Column>
                            <Header className='profileedit-header' block attached='top'>Required</Header>
                            <Segment attached>
                                <Grid stackable className='profileedit-grid-body' columns='equal'>
                                    <Grid.Row stretched>
                                        <Grid.Column computer={3}>First Name</Grid.Column>
                                        <Grid.Column computer={13}>
                                            <Field name='name' autoComplete='name' component={ValidatedField} type='text' placeholder='Enter your name' />
                                            <div className='profileedit-input-descriptions'>
                                                Your public profile only shows your first name. When you order food, your cook will see your first and last name.
                                            </div>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column computer={3}>Username</Grid.Column>
                                        <Grid.Column computer={13}>
                                            <Field name='username' autoComplete='username' component={ValidatedField} type='text' placeholder='Enter your username' />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column computer={3}>Email <Icon className='profileedit-secured-input' name='lock' /></Grid.Column>
                                        <Grid.Column computer={13}>
                                            <Field disabled={!emailEditingEnabled} name='email' autoComplete='email' component={ValidatedField} type='text' placeholder='Enter your email' />
                                            <div className='profileedit-input-descriptions'>
                                                Your email is never displayed publicly. It is only shared when you have a confirmed order request with another Foodcraft user.
                                            </div>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column computer={3}>Email Notifications</Grid.Column>
                                        <Grid.Column computer={13}>
                                            <div className='profileedit-checkbox'>
                                                <Field id='email_notifications' name='email_notifications' component='input' type='checkbox' />
                                                <label className='profileedit-input-descriptions' htmlFor='email_notifications'>Check the box to enable email notifications about your orders</label>
                                            </div>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column computer={3}>Bio</Grid.Column>
                                        <Grid.Column computer={13}>
                                            <Field name='info' autoComplete='info' component={ValidatedTextArea} rows={2} type='text' placeholder='Tell everyone about yourself' />
                                            <div className='profileedit-input-descriptions'>
                                                Let other people in the Foodcraft community get to know you.
                                                <div style={{ marginTop: '5px' }}>
                                                    What are some things you like to do? Or share the 5 foods you can't live without. Do you have a food philosophy? Share your life motto!
                                                </div>
                                            </div>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Segment>
                            <Header className='profileedit-header' block attached='top'>Optional</Header>
                            <Segment attached>
                                <Grid stackable className='profileedit-grid-body'>
                                    <Grid.Row>
                                        <Grid.Column computer={3}>Phone <Icon className='profileedit-secured-input' name='lock' /></Grid.Column>
                                        <Grid.Column computer={13}>
                                            <Field name='phone' autoComplete='phone' component={ValidatedField} type='tel' parse={parsePhone} placeholder="What's your phone number?" />
                                            <div className='profileedit-input-descriptions'>We will never share your private phone number without your permission.</div>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column computer={3}>Address <Icon className='profileedit-secured-input' name='lock' /></Grid.Column>
                                        <Grid.Column computer={13}>
                                            <Field name='address' className='profileedit-address' autoComplete='address' component={ValidatedAutocomplete} type='text' placeholder="What is your address?" />
                                            <div className='profileedit-input-descriptions'>
                                                We take your privacy seriously. Your address is never shown publicly. We use this data to improve our geosearch and matching.
                                            </div>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column computer={3}>Certifications</Grid.Column>
                                        <Grid.Column computer={13}>
                                            <Field name='certifications' autoComplete='certifications' placeholder="What are your certifications?"
                                                options={certificationOptions} component={ValidatedDropdown} />
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Segment>
                            <Header className='profileedit-header' block attached='top'>Stripe</Header>
                            <Segment attached >
                                <StripeComponent stripe_account_id={user.stripe_account_id} onConnectStripe={this.handleConnectStripeClick} />
                            </Segment>
                            <Header className='profileedit-header' block attached='top'>Availability</Header>
                            <Segment attached>
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
                                    onEventClick = {this.handleCalendarEventRemove}
                                />
                            </Segment>
                            <div className='profileedit-save-button-container'>
                                <Button className='profileedit-save-button' type='submit'
                                    disabled={pristine && !this.state.didSelectedIntervalsChange} loading={submitting} onClick={handleSubmit(this.handleSave)}>Save profile</Button>
                                {message && message.show &&
                                    <Message className='profileedit-save-confirm' floating size='tiny'
                                        onDismiss={() => this.setState({ message: { show: false } })}>
                                        {message.content}
                                    </Message>
                                }
                            </div>

                        </Grid.Column>
                    </Grid>
                    <Divider hidden />
                </div>
            </div>
        );
    }
}

const parsePhone = (value) => {
    return Util.getAsYouTypePhone(value);
}

const validate = (values) => {
    const errors = {}
    if (!values.name) {
        errors.name = { header: 'Name is required', message: 'Please enter your name' };
    }

    if (!values.username) {
        errors.username = { header: 'Username is required', message: 'Please enter your username' };
    }

    if (!values.info) {
        errors.info = { header: 'Your bio is required', message: 'Please tell us about yourself' };
    }

    if (!values.email) {
        errors.email = { header: 'Email is required', message: 'Please enter your email address' };
    }
    else if (!Util.validateEmail(values.email)) {
        errors.email = { header: 'Invalid email address', message: 'Please enter your email address' };
    }

    if (!values.phone) {
        errors.phone = { header: 'Phone is required', message: 'Please enter your phone number' };
    }
    else if (!Util.validatePhoneNumber(values.phone)) {
        errors.phone = { header: 'Invalid phone number', message: 'Please enter your phone number' };
    }

    return errors;
}

const mapStateToProps = (state) => {
    return {
        user: Selectors.currentUser(state),
        isLoading: Selectors.isLoading(state),
        isSaving: Selectors.isSaving(state),
        apiError: Selectors.apiError(state),
        initialValues: Selectors.currentUser(state)
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Actions, dispatch),
    };
};

ProfileEdit.propTypes = {
    user: PropTypes.shape({
        user_id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
    }),
    isLoading: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool.isRequired,
    apiError: PropTypes.any,
    actions: PropTypes.shape({
        loadCurrentUser: PropTypes.func.isRequired,
        saveUser: PropTypes.func.isRequired
    })
}

const form = reduxForm({ form: 'profileEdit', validate, enableReinitialize: true })(ProfileEdit);
const connectedForm = connect(mapStateToProps, mapDispatchToProps)(form);
export default withRouter(connectedForm);
