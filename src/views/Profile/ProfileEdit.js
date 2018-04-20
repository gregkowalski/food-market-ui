import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { Segment, Input, Button, Image, Header, Grid, Message, TextArea, Dropdown } from 'semantic-ui-react'
import { Divider, Icon } from 'semantic-ui-react'
import Autocomplete from 'react-google-autocomplete';
import crypto from 'crypto'
import './ProfileEdit.css'
import Util from '../../services/Util'
import Url from '../../services/Url'
import AppHeader from '../../components/AppHeader'
import LoadingIcon from '../../components/LoadingIcon'
import CognitoUtil from '../../services/Cognito/CognitoUtil'
import StripeUtil from '../../services/Stripe/StripeUtil'
import { Actions, Selectors } from '../../store/currentUser'

const languageOptions = [
    { key: 'en-CA', value: 'en-CA', text: 'English' },
    { key: 'fr-CA', value: 'fr-CA', text: 'French' },
    { key: 'pl-PL', value: 'pl-PL', text: 'Polish' },
    { key: 'zh-CN', value: 'zh-CN', text: 'Chinese' },
    { key: 'zh-HK', value: 'zh-HK', text: 'Cantonese' },
    { key: 'tr-TR', value: 'tr-TR', text: 'Turkish' },
    { key: 'es-ES', value: 'es-ES', text: 'Spanish' },
    { key: 'sgn-US', value: 'sgn-US', text: 'Sign Language' },
    { key: 'it-IT', value: 'it-IT', text: 'Italian' },
    { key: 'pt-PT', value: 'pt-PT', text: 'Portuguese' },
    { key: 'de-CH', value: 'de-CH', text: 'German' },
    { key: 'ja-JP', value: 'ja-JP', text: 'Japanese' },
    { key: 'tl-PH', value: 'tl-PH', text: 'Tagalog' },
    { key: 'ko-KR', value: 'ko-KR', text: 'Korean' },
    { key: 'ru-RU', value: 'ru-RU', text: 'Russian' },
    { key: 'hi-IN', value: 'hi-IN', text: 'Hindi' },
    { key: 'pa-IN', value: 'pa-IN', text: 'Punjabi' },
    { key: 'el-GR', value: 'el-GR', text: 'Greek' }
]

class ProfileEdit extends React.Component {

    state = {
        hasChanges: false,
        hasErrors: {
            phone: false
        },
        message: {
            show: false,
        },
    };

    componentWillMount() {
        this.props.actions.loadCurrentUser();
        this.isExternalIdp = CognitoUtil.isExternalIdp(CognitoUtil.getLoggedInUserJwt());
    }

    handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        let newHasBlurred = Object.assign({}, this.state.hasBlurred);
        newHasBlurred[name] = true;
        let newState = {
            [name]: value,
            hasBlurred: newHasBlurred,
            hasChanges: true
        };

        console.log(name + ': ' + value);
        this.setState(newState, () => this.validateField(name, value));
    }

    handleAddressChange = (place) => {
        const value = place.formatted_address;
        this.setState({ address: value, hasChanges: true }, () => this.validateField('address', value))
    }

    validateEmail(email) {
        if (!email) {
            return true;
        }
        var pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(email);
    }

    handlePhoneNumberChange = (e) => {
        const name = e.target.name;
        let value = Util.getAsYouTypePhone(e.target.value);
        e.target.value = value;

        let newHasBlurred = Object.assign({}, this.state.hasBlurred);
        newHasBlurred[name] = true;
        let newState = {
            [name]: value,
            hasBlurred: newHasBlurred,
            hasChanges: true
        };

        console.log(name + ': ' + value);
        this.setState(newState, () => this.validateField(name, value));
        // this.setState(newState);
    }

    handleBlur = (e) => {
        const name = e.target.name;
        console.log('Blur: ' + name);

        let hasBlurred = Object.assign({}, this.state.hasBlurred);
        hasBlurred[name] = true;
        this.setState({ hasBlurred: hasBlurred }, () => { this.validateField(name) });
    }

    isValid(hasErrors) {
        for (let v in hasErrors) {
            if (hasErrors[v] === true) {
                return false;
            }
        }
        return true;
    }

    validateField(fieldName, fieldValue) {
        if (!fieldValue) {
            fieldValue = this.state[fieldName];
        }

        let hasBlurred = this.state.hasBlurred;
        let state = this.state;
        let hasErrors = {};

        switch (fieldName) {

            case 'phone':
                hasErrors.phone = false;
                if (hasBlurred.phone && !Util.validatePhoneNumber(state.phone)) {
                    hasErrors.phone = true;
                }
                break;

            case 'email':
                hasErrors.email = false;
                if (hasBlurred.email && !this.validateEmail(state.email)) {
                    hasErrors.email = true;
                }
                break;

            case 'address':
            case 'name':
            case 'city':
            case 'username':
            case 'info':
            case 'lang':
                hasErrors[fieldName] = false;
                if (hasBlurred[fieldName] && !state[fieldName]) {
                    hasErrors[fieldName] = true;
                }
                break;

            default:
                break;
        }

        hasErrors = Object.assign(this.state.hasErrors, hasErrors);
        this.setState({ hasErrors });
    }

    handleSave(e) {
        if (!this.state.hasChanges) {
            return;
        }

        let { city, name, username, info, lang, phone, address, apt } = this.state;
        phone = Util.getAsYouTypePhone(phone);
        const newUser = { city, name, username, info, lang, phone, address, apt };
        const user = Object.assign({}, this.props.user, newUser);

        console.log(user);
        console.log('saving...');
        this.props.actions.saveUser(user);

        // this.setState({
        //     hasChanges: false,
        //     saving: false,
        //     message: {
        //         show: true,
        //         content: "Success! Your profile has been updated."
        //     }
        // });
        // console.log('saved');

        // console.error(err);
        // this.setState({
        //     saving: false,
        //     message: {
        //         show: true,
        //         content: "Oops, your profile was not saved."
        //     }
        // });
    }

    handleConnectStripeClick(e) {
        e.preventDefault();

        const state = crypto.randomBytes(64).toString('hex');
        let stripeConnectUrl = StripeUtil.getStripeConnectUrl(state);
        StripeUtil.setCsrfState(state);
        window.open(stripeConnectUrl, '_self');
    }

    navigateToProfileView = () => {
        this.props.history.push(Url.profileView(this.props.user.user_id));
    }

    render() {
        const { isSaving, isLoading, user } = this.props;

        let content;
        if (isLoading) {
            content =
                <div style={{ marginTop: '70px', width: '100%' }}>
                    <div style={{ margin: '0 auto', width: '100px' }}>
                        <LoadingIcon />
                    </div>
                </div>
        }
        else {

            let stripeComponent;
            if (user.stripe_account_id) {
                stripeComponent = (
                    <div className='profileedit-stripe-component-text'>
                        <div>Sharing your food just got a whole lot easier.</div>
                        <div className='profileedit-stripe-component-logo'>

                            <Icon color='green' size='big' name='checkmark' />
                            <Image height='45px' src='/assets/images/stripe-logo-blue.png' />
                            <div> Your Stripe account is successfully connected to Foodcraft.</div>
                        </div>
                        <Divider hidden />
                        <div> Be sure to check out the Foodcraft Help Center for more information, tips, and answers to many frequently asked questions.</div>
                        <Divider hidden />
                        <div className='profileedit-stripe-component-ready'> Ready to get started? </div>
                        <Divider hidden />
                        <a href='https://goo.gl/forms/NxxOMSNXOWESGpsW2' target='_blank' rel="noreferrer noopener" >
                            <Button basic color='purple'>Add a new food</Button>
                        </a>
                    </div>
                );
            }
            else {
                stripeComponent = (
                    <div>
                        <div className='profileedit-menu' style={{ marginBottom: '20px' }}>Interested in sharing your food and making money with Foodcraft?
                    <div style={{ marginTop: '10px' }}>Get started by creating your own Stripe account!
                        </div>
                        </div>
                        <a href='./' onClick={(e) => this.handleConnectStripeClick(e)}>
                            <Image src='/assets/images/stripe-blue-on-light.png' />
                        </a>
                    </div>
                );
            }
            content =
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
                                        <Grid.Column id='profileedit-grid-label' computer={3}>First Name</Grid.Column>
                                        <Grid.Column computer={13}>
                                            <Input name='name' value={user.name} error={this.state.hasErrors.name}
                                                onChange={this.handleChange} onBlur={this.handleBlur} />
                                            <Message error={this.state.hasErrors.name}
                                                hidden={!this.state.hasErrors.name}
                                                visible={this.state.hasErrors.name} header='Invalid name' content='Please enter your name' icon='exclamation circle' />
                                            <div className='profileedit-input-descriptions'>Your public profile only shows your first name. When you order food, your cook will see your first and last name.
                                                </div>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column id='profileedit-grid-label' computer={3}>Username</Grid.Column>
                                        <Grid.Column computer={13}>
                                            <Input name='username' value={user.username} error={this.state.hasErrors.username}
                                                onChange={this.handleChange} onBlur={this.handleBlur} />
                                            <Message error={this.state.hasErrors.username}
                                                hidden={!this.state.hasErrors.username}
                                                visible={this.state.hasErrors.username} header='Invalid username' content='Please enter your username' icon='exclamation circle' />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column id='profileedit-grid-label' computer={3}>Email <Icon className='profileedit-secured-input' name='lock' /></Grid.Column>
                                        <Grid.Column computer={13}>
                                            <Input disabled={this.isExternalIdp} name='email' value={user.email} error={this.state.hasErrors.email}
                                                onChange={this.handleChange} onBlur={this.handleBlur} />
                                            <Message error={this.state.hasErrors.email}
                                                hidden={!this.state.hasErrors.email}
                                                visible={this.state.hasErrors.email} header='Invalid email address' content='Please enter your valid email address' icon='exclamation circle' />
                                            <div className='profileedit-input-descriptions'>Your email is never displayed publicly. It is only shared when you have a confirmed order request with another Foodcraft user.
                                                </div>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column id='profileedit-grid-label' computer={3}>Neighbourhood</Grid.Column>
                                        <Grid.Column computer={13}>
                                            <Input name='Where do you live?' value={user.hood} error={this.state.hasErrors.city}
                                                onChange={this.handleChange} onBlur={this.handleBlur} />
                                            {/* <Message error={this.state.hasErrors.city}
                                                hidden={!this.state.hasErrors.city}
                                                visible={this.state.hasErrors.city} header='Invalid neighbourhood' content='' icon='exclamation circle' /> */}
                                            <div className='profileedit-input-descriptions'>Your neck of the woods (i.e. Kitslano, Yaletown, North Burnaby)
                                                </div>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column id='profileedit-grid-label' computer={3}>About:</Grid.Column>
                                        <Grid.Column computer={13}>
                                            <TextArea name='info' value={user.info} autoHeight rows={1}
                                                onChange={this.handleChange} onBlur={this.handleBlur} />
                                            <Message error={this.state.hasErrors.info}
                                                hidden={!this.state.hasErrors.info}
                                                visible={this.state.hasErrors.info} header='Invalid info' content='Please enter your info' icon='exclamation circle' />
                                            <div className='profileedit-input-descriptions'>Let other people in the Foodcraft community get to know you.
                                                <div style={{ marginTop: '5px' }}>What are some things you like to do? Or share the 5 foods you can't live without. Do you have a food philosophy? Share your life motto!
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
                                        <Grid.Column id='profileedit-grid-label' computer={3}>Languages</Grid.Column>
                                        <Grid.Column computer={13}>
                                            <Dropdown placeholder='Select Language' fluid multiple search selection options={languageOptions} onChange={this.handleChange} onBlur={this.handleBlur} />
                                            <div className='profileedit-input-descriptions'>Add any languages other people can use to chat with you.
                                                </div>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column id='profileedit-grid-label' computer={3}>Phone <Icon className='profileedit-secured-input' name='lock' /></Grid.Column>
                                        <Grid.Column computer={13}>
                                            <Input name='phone' type='tel' placeholder='Phone' onChange={this.handlePhoneNumberChange} onBlur={this.handleBlur} value={user.phone}
                                                error={this.state.hasErrors.phone} />
                                            <Message error={this.state.hasErrors.phone}
                                                hidden={!this.state.hasErrors.phone}
                                                visible={this.state.hasErrors.phone} header='Invalid phone number' content='Please enter your phone number' icon='exclamation circle' />
                                            <div className='profileedit-input-descriptions'>We will never share your private phone number without your permission.</div>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column id='profileedit-grid-label' computer={3}>Address <Icon className='profileedit-secured-input' name='lock' /></Grid.Column>
                                        <Grid.Column computer={10}>
                                            <Autocomplete className='profileedit-address'
                                                name='address'
                                                onPlaceSelected={this.handleAddressChange}
                                                onChange={this.handleChange}
                                                onBlur={this.handleBlur}
                                                types={['address']}
                                                placeholder='Address'
                                                componentRestrictions={{ country: 'ca' }}
                                                value={user.address} />
                                            <Message
                                                error={this.state.hasErrors.address}
                                                hidden={!this.state.hasErrors.address}
                                                visible={this.state.hasErrors.address} header='Invalid address' content='Please enter your address' icon='exclamation circle' />
                                            <div className='profileedit-input-descriptions'>We take your privacy seriously. Your address is never shown publicly. We use this data to improve our geosearch and matching.
                                                </div>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column id='profileedit-grid-label' computer={3}>Certifications</Grid.Column>
                                        <Grid.Column computer={13}>
                                            <Input name='certifications' value={user.certifications} error={this.state.hasErrors.certification}
                                                onChange={this.handleChange} onBlur={this.handleBlur} />
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Segment>
                            <Header className='profileedit-header' block attached='top'>Stripe</Header>
                            <Segment attached >
                                <div className='profileedit-stripe-box'>{stripeComponent}</div>
                            </Segment>
                            <div className='profileedit-save-button-container'>
                                <div><Button disabled={!this.state.hasChanges} loading={isSaving}
                                    className='profileedit-save-button' type='submit' onClick={(e) => this.handleSave(e)}> Save profile </Button>
                                </div>
                                <div>
                                    <Message
                                        className='profileedit-save-confirm'
                                        hidden={!this.state.message.show || this.state.hasChanges}
                                        floating
                                        size='tiny'
                                        onDismiss={() => this.setState({ message: { show: false } })}>
                                        {this.state.message.content}
                                    </Message>
                                </div>
                            </div>

                        </Grid.Column>
                    </Grid>
                    <Divider hidden />
                </div>
        }

        return (
            <div>
                <AppHeader fixed />
                {content}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: Selectors.currentUser(state),
        isLoading: Selectors.isLoading(state),
        isSaving: Selectors.isSaving(state),
        error: Selectors.error(state)
    };
};

const mapDispatchToProps = (dispatch) => {
    return { actions: bindActionCreators(Actions, dispatch) };
};

ProfileEdit.propTypes = {
    user: PropTypes.shape({
        user_id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
    }),
    isLoading: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool.isRequired,
    error: PropTypes.any,
    actions: PropTypes.shape({
        loadCurrentUser: PropTypes.func.isRequired,
        saveUser: PropTypes.func.isRequired
    })
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProfileEdit));