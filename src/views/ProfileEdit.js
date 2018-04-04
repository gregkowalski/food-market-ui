import React from 'react'
import jwtDecode from 'jwt-decode'
import { withRouter } from 'react-router-dom'
import { Segment, Input, Button, Image, Header, Grid, Message, TextArea, Dropdown } from 'semantic-ui-react'
import { Divider, Icon } from 'semantic-ui-react'
import Autocomplete from 'react-google-autocomplete';
import crypto from 'crypto'
import './ProfileEdit.css'
import Util from '../services/Util'
import Url from '../services/Url'
import AppHeader from '../components/AppHeader'
import LoadingIcon from '../components/LoadingIcon'
import CognitoUtil from '../services/Cognito/CognitoUtil'
import StripeUtil from '../services/Stripe/StripeUtil'
import ApiClient from '../services/ApiClient'

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
        activeItem: 'editProfile',
        hasChanges: false,
        hasErrors: {
            phone: false
        },
        loading: true,
        saving: false,
        message: {
            show: false,
        },
    };

    user;
    isOwnProfile;
    isExternalIdp;

    componentWillMount() {
        const userId = this.props.match.params.userId;


        const jwtToken = CognitoUtil.getLoggedInUserJwtToken();
        let jwt;
        if (jwtToken) {
            jwt = jwtDecode(jwtToken);
            if (userId === jwt.sub) {
                this.isOwnProfile = true;
                this.isExternalIdp = CognitoUtil.isExternalIdp(jwt);
                let newState = {
                    email: jwt.email,
                };
                this.setState(newState);
            }
        }
        if (!this.isOwnProfile) {
            return;
        }

        ApiClient.loadUserProfile(jwt.sub)
            .then(response => {
                //console.log(response);
                let user = response.data;
                this.user = user;
                //Util.busySleep(3);

                let phone;
                if (user.phone) {
                    phone = Util.getAsYouTypePhone(user.phone.phone);
                }

                let newState = {
                    //email: user.email,
                    name: user.name,
                    city: user.city,
                    username: user.username,
                    info: user.info,
                    lang: user.lang,
                    address: user.address,
                    phone: phone,
                    apt: user.apt === null ? '' : user.apt,
                    stripe_user_id: user.stripe_user_id,
                    loading: false,
                    certification: 'FOODSAFE Level 1'
                };
                this.setState(newState);
            })
            .catch(err => {
                console.error(err);
            });
    }

    handleEditProfile = (e, { name }) => this.setState({ activeItem: name })

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
                if (hasBlurred.phone && !this.validatePhoneNumber(state.phone)) {
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
        phone = Util.parsePhone(phone);
        let newUser = { city, name, username, info, lang, phone, address, apt };
        Object.assign(this.user, newUser);
        console.log(this.user);

        this.setState({ saving: true });
        console.log('saving...');

        ApiClient.saveUserProfile(this.user)
            .then(response => {
                this.setState({
                    hasChanges: false,
                    saving: false,
                    message: {
                        show: true,
                        content: "Success! Your profile has been updated."
                    }
                });
                console.log('saved');
            })
            .catch(err => {
                console.error(err);
                this.setState({
                    saving: false,
                    message: {
                        show: true,
                        content: "Oops, your profile was not saved."
                    }
                });
            });
    }

    handleConnectStripeClick(e) {
        e.preventDefault();

        const state = crypto.randomBytes(64).toString('hex');
        let stripeConnectUrl = StripeUtil.getStripeConnectUrl(state);
        StripeUtil.setCsrfState(state);
        window.open(stripeConnectUrl, '_self');
    }

    navigateToProfileView = () => {
        this.props.history.push(Url.profileView(this.user.user_id));
    }

    render() {
        if (!this.isOwnProfile) {
            this.props.history.push(Url.home());
            return;
        }

        let stripeComponent;
        if (this.state.stripe_user_id) {
            stripeComponent =
                <div>
                    <div style={{ marginBottom: '10px' }}>You are ready to be a foodcraft cook!!!</div>
                    <Image height='100px' src='/assets/images/stripe-logo-blue.png' />
                </div>
        }
        else {
            stripeComponent =
                <div>
                    <div className='profileedit-menu' style={{ marginBottom: '20px' }}>Interested in becoming a cook and making money with Foodcraft?
                    <div style={{ marginTop: '10px' }}>Get started by creating your own Stripe account!
                        </div>
                    </div>
                    <a href='stripe' onClick={(e) => this.handleConnectStripeClick(e)}>
                        <Image src='/assets/images/stripe-blue-on-light.png' />
                    </a>
                </div>
        }

        let content;
        if (this.state.loading) {
            content =
                <div style={{ marginTop: '70px', width: '100%' }}>
                    <div style={{ margin: '0 auto', width: '100px' }}>
                        <LoadingIcon />
                    </div>
                </div>
        }
        else {
            // const { activeItem } = this.state
            content =
                <div className='profileedit-main'>
                    <div className='profileedit-title'>
                        <div>Edit Profile</div>
                        {this.isOwnProfile &&
                            <Button onClick={this.navigateToProfileView}>View Profile</Button>
                        }
                    </div>
                    <Grid>
                        <Grid.Column>
                            <Header className='profileedit-header' block attached='top'>Required</Header>
                            <Segment attached>
                                <Grid stackable className='profileedit-grid-body'>
                                    <Grid.Row>
                                        <Grid.Column id='profileedit-grid-label' computer={3}>First Name</Grid.Column>
                                        <Grid.Column computer={13}>
                                            <Input name='name' value={this.state.name} error={this.state.hasErrors.name}
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
                                            <Input name='username' value={this.state.username} error={this.state.hasErrors.username}
                                                onChange={this.handleChange} onBlur={this.handleBlur} />
                                            <Message error={this.state.hasErrors.username}
                                                hidden={!this.state.hasErrors.username}
                                                visible={this.state.hasErrors.username} header='Invalid username' content='Please enter your username' icon='exclamation circle' />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column id='profileedit-grid-label' computer={3}>Email <Icon className='profileedit-secured-input' name='lock' /></Grid.Column>
                                        <Grid.Column computer={13}>
                                            <Input disabled={this.isExternalIdp || true} name='email' value={this.state.email} error={this.state.hasErrors.email}
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
                                            <Input name='Where do you live?' value={this.state.city} error={this.state.hasErrors.city}
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
                                            <TextArea name='info' value={this.state.info} autoHeight rows={1}
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
                                            <Input name='phone' type='tel' placeholder='Phone' onChange={this.handlePhoneNumberChange} onBlur={this.handleBlur} value={this.state.phone}
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
                                                value={this.state.address} />
                                            <Message
                                                error={this.state.hasErrors.address}
                                                hidden={!this.state.hasErrors.address}
                                                visible={this.state.hasErrors.address} header='Invalid address' content='Please enter your address' icon='exclamation circle' />
                                            <div className='profileedit-input-descriptions'>We take your privacy seriously. Your address is never shown publicly. We use this data to improve our geosearch and matching.
                                                </div>
                                        </Grid.Column>
                                        <Grid.Column id='profileedit-grid-label' computer={1}>Apt:</Grid.Column>
                                        <Grid.Column computer={2} style={{ paddingTop: 0 }}>
                                            <Input name='apt' placeholder='' onChange={this.handleChange} onBlur={this.handleBlur} value={this.state.apt} />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column id='profileedit-grid-label' computer={3}>Certifications</Grid.Column>
                                        <Grid.Column computer={13}>
                                            <Input name='lang' value={this.state.certification} error={this.state.hasErrors.certification}
                                                onChange={this.handleChange} onBlur={this.handleBlur} />
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Segment>
                            <Header className='profileedit-header' block attached='top'>Stripe</Header>
                            <Segment attached >
                                <div style={{ margin: '10px 10px 10px 60px' }}>{stripeComponent}</div>
                            </Segment>
                            <div style={{ display: 'flex', marginTop: '20px' }}>
                                <div><Button disabled={!this.state.hasChanges} loading={this.state.saving}
                                    className='profileedit-save-button' type='submit' onClick={(e) => this.handleSave(e)}>Save</Button>
                                </div>
                                <div>
                                    <Message
                                        className='profileedit-save-confirm'
                                        hidden={!this.state.message.show || this.state.hasChanges}
                                        floating
                                        size='tiny'
                                        onDismiss={() => this.setState({ message: { show: false } })}
                                    >{this.state.message.content}</Message></div>
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
            </div >
        )
    }
}

export default withRouter(ProfileEdit);