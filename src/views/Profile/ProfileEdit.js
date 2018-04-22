import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Field, reduxForm } from 'redux-form'
import PropTypes from 'prop-types'
import { Segment, Input, Button, Header, Grid, Message, TextArea, Dropdown } from 'semantic-ui-react'
import { Divider, Icon } from 'semantic-ui-react'
import Autocomplete from '../../components/Autocomplete'
import crypto from 'crypto'
import './ProfileEdit.css'
import Util from '../../services/Util'
import Url from '../../services/Url'
import AppHeader from '../../components/AppHeader'
import LoadingIcon from '../../components/LoadingIcon'
import CognitoUtil from '../../services/Cognito/CognitoUtil'
import StripeUtil from '../../services/Stripe/StripeUtil'
import { Actions, Selectors } from '../../store/currentUser'
import { Certifications } from '../../Enums';
import StripeComponent from './StripeComponent'

const certificationOptions = [
    { key: Certifications.foodsafe_level1, value: Certifications.foodsafe_level1, text: 'FoodSafe Level 1' },
    { key: Certifications.foodsafe_level2, value: Certifications.foodsafe_level2, text: 'FoodSafe Level 2' },
    { key: Certifications.market_safe, value: Certifications.market_safe, text: 'Market Safe' },
    { key: Certifications.pro_caterer, value: Certifications.pro_caterer, text: 'Professional Caterer' },
];

class ProfileEdit extends React.Component {

    state = {};

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
    }

    navigateToProfileView = () => {
        this.props.history.push(Url.profileView(this.props.user.user_id));
    }

    handleSave = (user) => {
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
                                            <Field name='name' autoComplete='name' component={renderField} type='text' placeholder='Enter your name' />
                                            <div className='profileedit-input-descriptions'>
                                                Your public profile only shows your first name. When you order food, your cook will see your first and last name.
                                            </div>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column computer={3}>Username</Grid.Column>
                                        <Grid.Column computer={13}>
                                            <Field name='username' autoComplete='username' component={renderField} type='text' placeholder='Enter your username' />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column computer={3}>Email <Icon className='profileedit-secured-input' name='lock' /></Grid.Column>
                                        <Grid.Column computer={13}>
                                            <Field disabled={this.isExternalIdp} name='email' autoComplete='email' component={renderField} type='text' placeholder='Enter your email' />
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
                                        <Grid.Column computer={3}>Neighbourhood</Grid.Column>
                                        <Grid.Column computer={13}>
                                            <Field name='hood' autoComplete='hood' component={renderField} type='text' placeholder='Where do you live?' />
                                            <div className='profileedit-input-descriptions'>
                                                Your neck of the woods (i.e. Kitslano, Yaletown, North Burnaby)
                                            </div>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column computer={3}>About:</Grid.Column>
                                        <Grid.Column computer={13}>
                                            <Field name='info' autoComplete='info' component={renderTextArea} rows={2} type='text' placeholder='Tell everyone about yourself' />
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
                                            <Field name='phone' autoComplete='phone' component={renderField} type='tel' parse={parsePhone} placeholder="What's your phone number?" />
                                            <div className='profileedit-input-descriptions'>We will never share your private phone number without your permission.</div>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column computer={3}>Address <Icon className='profileedit-secured-input' name='lock' /></Grid.Column>
                                        <Grid.Column computer={10}>
                                            <Field name='address' className='profileedit-address' autoComplete='address' component={renderAutocomplete} type='text' placeholder="What is your address?" />
                                            <div className='profileedit-input-descriptions'>
                                                We take your privacy seriously. Your address is never shown publicly. We use this data to improve our geosearch and matching.
                                            </div>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column computer={3}>Certifications</Grid.Column>
                                        <Grid.Column computer={13}>
                                            <Field name='certifications' autoComplete='certifications' placeholder="What are your certifications?"
                                                options={certificationOptions} component={renderDropdown} />
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Segment>
                            <Header className='profileedit-header' block attached='top'>Stripe</Header>
                            <Segment attached >
                                <StripeComponent stripe_account_id={user.stripe_account_id} onConnectStripe={this.handleConnectStripeClick} />
                            </Segment>
                            <div className='profileedit-save-button-container'>
                                <Button className='profileedit-save-button' type='submit'
                                    disabled={pristine} loading={submitting} onClick={handleSubmit(this.handleSave)}>Save profile</Button>
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

    if (!values.hood) {
        errors.hood = { header: 'Neighbourhood is required', message: 'Please enter your neighbourhood' };
    }

    if (!values.info) {
        errors.info = { header: 'Your bio is required', message: 'Please tell us about yourself' };
    }

    if (!values.email) {
        errors.email = { header: 'Email is required', message: 'Please enter your email address' };
    }
    else if (!validateEmail(values.email)) {
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

const validateEmail = (email) => {
    var pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(email);
}

const renderDropdown = ({ input, meta, placeholder, options }) => {
    const { touched, error } = meta;
    const dropdown = Object.assign({}, input);

    const dropdownOnChange = (event, data) => {
        console.log(data);
        input.onChange(data.value);
    }

    const dropdownOnBlur = (event, data) => {
        console.log(data);
        input.onBlur(data.value);
    }

    dropdown.onChange = dropdownOnChange;
    dropdown.onBlur = dropdownOnBlur;
    return (
        <div>
            <Dropdown {...dropdown} fluid multiple search selection options={options} placeholder={placeholder} />
            {touched && error &&
                <Message error header={error.header} content={error.message} icon='exclamation circle' />
            }
        </div>
    );
}

const renderAutocomplete = ({ input, meta, placeholder, autoComplete, className }) => {
    const { touched, error } = meta;

    const onPlaceSelected = (place) => {
        input.onChange(place.formatted_address);
    }
    return (
        <div>
            <Autocomplete className={className}
                {...input}
                autoComplete={autoComplete}
                onPlaceSelected={onPlaceSelected}
                types={['address']}
                placeholder={placeholder}
                componentRestrictions={{ country: 'ca' }}
            />
            {touched && error &&
                <Message error header={error.header} content={error.message} icon='exclamation circle' />
            }
        </div>
    );
}
const renderField = ({ input, type, meta, placeholder, autoComplete, disabled }) => {
    const { touched, error } = meta;
    const hasError = !(!error); // turn it into a boolean
    return (
        <div>
            <Input {...input} disabled={disabled} type={type} placeholder={placeholder} error={hasError} autoComplete={autoComplete} />
            {touched && error &&
                <Message error header={error.header} content={error.message} icon='exclamation circle' />
            }
        </div>
    );
}

const renderTextArea = ({ input, type, meta, placeholder, autoComplete, rows }) => {
    const { touched, error } = meta;
    return (
        <div>
            <TextArea {...input} placeholder={placeholder} autoComplete={autoComplete} autoHeight rows={rows} />
            {touched && error &&
                <Message error header={error.header} content={error.message} icon='exclamation circle' />
            }
        </div>
    );
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
