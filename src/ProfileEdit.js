import React from 'react'
import jwtDecode from 'jwt-decode'
import { Redirect, Link } from 'react-router-dom'
import { Segment, Input, Button, Image, Header, Grid, Message, TextArea, Menu } from 'semantic-ui-react'
import Autocomplete from 'react-google-autocomplete';
import { parse as parsePhone, asYouType as asYouTypePhone } from 'libphonenumber-js'
import crypto from 'crypto'
import './ProfileEdit.css'
import AppHeader from './components/AppHeader'
import LoadingIcon from './components/LoadingIcon'
import CognitoUtil from './Cognito/CognitoUtil'
import StripeUtil from './Stripe/StripeUtil';
import ApiClient from './Api/ApiClient'

export default class ProfileEdit extends React.Component {

    state = {
        activeItem: 'editProfile',
        hasChanges: false,
        hasErrors: {
            phone: false
        },
        loading: true,
        saving: false
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

        let api = new ApiClient();
        api.loadUserProfile(jwt.sub)
            .then(response => {
                //console.log(response);
                let user = response.data;
                this.user = user;
                //Util.busySleep(3);

                let phone;
                if (user.phone) {
                    phone = this.getAsYouTypePhone(user.phone.phone);
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

    handleAddressChange(place) {
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

    validatePhoneNumber(phone) {
        if (!phone) {
            return true;
        }
        const result = parsePhone(phone);
        console.log('parsePhone: ' + JSON.stringify(result));
        return result.phone ? true : false;
    }

    getAsYouTypePhone(value) {
        if (!value) {
            return '';
        }
        if (!value.startsWith('+1')) {
            if (value.startsWith('1')) {
                value = '+' + value;
            }
            else {
                value = '+1' + value;
            }
        }

        let trimmed = value.replace(/\s/g, '');
        if (value && trimmed.length > 12) {
            value = trimmed.substring(0, 12);
        }
        value = new asYouTypePhone('US').input(value);
        return value;
    }

    handlePhoneNumberChange = (e) => {
        const name = e.target.name;
        let value = this.getAsYouTypePhone(e.target.value);
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
        phone = parsePhone(phone);
        let newUser = { city, name, username, info, lang, phone, address, apt };
        Object.assign(this.user, newUser);
        console.log(this.user);

        this.setState({ saving: true });
        console.log('saving...');

        let api = new ApiClient();
        api.saveUserProfile(this.user)
            .then(response => {
                this.setState({
                    hasChanges: false,
                    saving: false
                });
                console.log('saved');
            })
            .catch(err => {
                console.error(err);
                this.setState({ saving: false });
            });
    }

    handleConnectStripeClick(e) {
        e.preventDefault();

        const state = crypto.randomBytes(64).toString('hex');
        let stripeConnectUrl = StripeUtil.getStripeConnectUrl(state);
        StripeUtil.setCsrfState(state);
        window.open(stripeConnectUrl, '_self');
    }

    render() {
        if (!this.isOwnProfile) {
            return <Redirect to='/' />
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
                    <div style={{ marginBottom: '10px' }}>If you'd like to become a cook and make money with Foodcraft, please sign up with Stripe.</div>
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
            const { activeItem } = this.state
            content =
                <div className='profileedit-main'>
                    <Grid>
                        <Grid.Column width={4}>
                            <Menu fluid vertical tabular className='profileedit-menu'>
                                <Menu.Item name='Edit Profile' active={activeItem === 'editProfile'} onClick={this.handleEditProfile} />
                                <Menu.Item name='References' active={activeItem === 'references'} onClick={this.handleReferences} />
                            </Menu>
                            {this.isOwnProfile &&
                                <div style={{ display: 'inline-flex'}}>
                                    <Link to={`/profile/view/${this.user.user_id}`}>
                                        <Button className='profileedit-view-button' >View Profile</Button>
                                    </Link>
                                </div>
                            }
                        </Grid.Column>
                        <Grid.Column stretched width={12}>
                            <Header className='profileedit-header' block attached='top'><span style={{fontSize: '0.8em', margin: '0px 10px' }}>Required</span></Header>
                            <Segment attached>
                                <Grid stackable className='profileedit-grid-body'>
                                    <Grid.Row>
                                        <Grid.Column id='profileedit-grid-label' computer={3}>Email:</Grid.Column>
                                        <Grid.Column computer={13}>
                                            <Input disabled={this.isExternalIdp || true} name='email' value={this.state.email} error={this.state.hasErrors.email}
                                                onChange={this.handleChange} onBlur={this.handleBlur} />
                                            <Message error={this.state.hasErrors.email}
                                                hidden={!this.state.hasErrors.email}
                                                visible={this.state.hasErrors.email} header='Invalid email address' content='Please enter your valid email address' icon='exclamation circle' />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column id='profileedit-grid-label' computer={3}>Name:</Grid.Column>
                                        <Grid.Column computer={13}>
                                            <Input name='name' value={this.state.name} error={this.state.hasErrors.name}
                                                onChange={this.handleChange} onBlur={this.handleBlur} />
                                            <Message error={this.state.hasErrors.name}
                                                hidden={!this.state.hasErrors.name}
                                                visible={this.state.hasErrors.name} header='Invalid name' content='Please enter your name' icon='exclamation circle' />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column id='profileedit-grid-label' computer={3}>Neighbourhood:</Grid.Column>
                                        <Grid.Column computer={13}>
                                            <Input name='city' value={this.state.city} error={this.state.hasErrors.city}
                                                onChange={this.handleChange} onBlur={this.handleBlur} />
                                            <Message error={this.state.hasErrors.city}
                                                hidden={!this.state.hasErrors.city}
                                                visible={this.state.hasErrors.city} header='Invalid city' content='Please enter your city' icon='exclamation circle' />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column id='profileedit-grid-label' computer={3}>Username:</Grid.Column>
                                        <Grid.Column computer={13}>
                                            <Input name='username' value={this.state.username} error={this.state.hasErrors.username}
                                                onChange={this.handleChange} onBlur={this.handleBlur} />
                                            <Message error={this.state.hasErrors.username}
                                                hidden={!this.state.hasErrors.username}
                                                visible={this.state.hasErrors.username} header='Invalid username' content='Please enter your username' icon='exclamation circle' />
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
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Segment>
                            <Header className='profileedit-header' block attached='top'><span style={{ fontSize: '0.8em', margin: '0px 10px' }}>Optional</span></Header>
                            <Segment attached>
                                <Grid stackable className='profileedit-grid-body'>
                                <Grid.Row>
                                        <Grid.Column id='profileedit-grid-label' computer={3}>Languages:</Grid.Column>
                                        <Grid.Column computer={13}>
                                            <Input name='lang' value={this.state.lang} error={this.state.hasErrors.lang}
                                                onChange={this.handleChange} onBlur={this.handleBlur} />
                                            <Message error={this.state.hasErrors.lang}
                                                hidden={!this.state.hasErrors.lang}
                                                visible={this.state.hasErrors.lang} header='Invalid languages' content='Please enter the languages you know' icon='exclamation circle' />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column id='profileedit-grid-label' computer={3}>Phone:</Grid.Column>
                                        <Grid.Column computer={13}>
                                            <Input name='phone' type='tel' placeholder='Phone' onChange={this.handlePhoneNumberChange} onBlur={this.handleBlur} value={this.state.phone}
                                                error={this.state.hasErrors.phone} />
                                            <Message error={this.state.hasErrors.phone}
                                                hidden={!this.state.hasErrors.phone}
                                                visible={this.state.hasErrors.phone} header='Invalid phone number' content='Please enter your phone number' icon='exclamation circle' />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column id='profileedit-grid-label' computer={3}>Delivery Address:</Grid.Column>
                                        <Grid.Column computer={10}>
                                            <Autocomplete className='profileedit-address'
                                                name='address'
                                                onPlaceSelected={(place) => this.handleAddressChange(place)}
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
                                        </Grid.Column>
                                        <Grid.Column id='profileedit-grid-label' computer={1}>Apt:</Grid.Column>
                                        <Grid.Column computer={2} style={{ paddingTop: 0 }}>
                                            <Input name='apt' placeholder='' onChange={this.handleChange} onBlur={this.handleBlur} value={this.state.apt} />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column id='profileedit-grid-label' computer={3}>Certifications:</Grid.Column>
                                        <Grid.Column computer={13}>
                                            <Input name='lang' value={this.state.certification} error={this.state.hasErrors.certification}
                                                onChange={this.handleChange} onBlur={this.handleBlur} />
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Segment>
                            <Header className='profileedit-header' block attached='top'><span style={{ fontSize: '0.8em', margin: '0px 10px' }}>Stripe</span></Header>
                            <Segment attached >
                                <div style={{margin: '10px 10px 10px 60px'}}>{stripeComponent}</div>
                            </Segment>
                            <div style={{ marginTop: '20px' }}>
                                <Button disabled={!this.state.hasChanges} loading={this.state.saving}
                                    className='profileedit-view-button' type='submit' onClick={(e) => this.handleSave(e)}>Save</Button>
                            </div>
                        </Grid.Column>
                    </Grid>
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