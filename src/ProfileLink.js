import React from 'react'
import AppHeader from 'components/AppHeader'
import CognitoUtil from 'Cognito/CognitoUtil'
import { Redirect } from 'react-router-dom'
import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';
import { Dropdown, Button, Input } from 'semantic-ui-react'
import ApiClient from 'Api/ApiClient'

export const JsUsers = [
    {
        js_user_id: 1,
        image: '/assets/images/users/johannk.jpg',
        name: 'Johann',
        city: 'West End',
        info: 'I\'m an American who, alongside her Canadian husband, globetrots the world and VanCity for good authentic eats.  In our home, sharing food is a family creed.   So, I\'m excited to share both a family tradition as well as my own fusion recipes.  I believe healthy food can and should taste finger-lickin\' good! ',
        join_date: 'September 2017',
        lang: 'English, Mandarin'
    },
    {
        js_user_id: 2,
        image: '/assets/images/users/molly.png',
        name: 'Holly',
        city: 'Coquitlam',
        info: 'I enjoy making food for family and friends. My kitchen is always cooking up something new!',
        join_date: 'December 2017',
        lang: 'English, Cantonese'
    },
    {
        js_user_id: 3,
        image: '/assets/images/users/IanChan_ProfilePic_500x500.jpg',
        name: 'Ian',
        city: 'North Burnaby',
        info: 'I love to eat and sharing food is part of that joy.',
        join_date: 'September 2017',
        lang: 'English, Cantonese'
    },
    {
        js_user_id: 4,
        image: '/assets/images/users/matthew.png',
        name: 'Pierre',
        city: 'Coquitlam',
        info: 'I really enjoy making food for others.',
        join_date: 'December 2017',
        lang: 'English, Cantonese'
    },
    {
        js_user_id: 5,
        image: '/assets/images/users/steve.jpg',
        name: 'Gabe',
        city: 'North Burnaby',
        info: 'I love cooking in my spare time and I get a lot of joy from  making delicous meals for my family and friends. I am eager to share my creations with the world!',
        join_date: 'December 2017',
        lang: 'English, Cantonese'
    },
    {
        js_user_id: 6,
        image: '/assets/images/users/greg.jpg',
        name: 'Greg',
        city: 'West End',
        info: 'I rarely cook and when I do it kinda tastes ok but it\'s super healthy as demonstrated by my rockin\' body',
        join_date: 'August 2017',
        lang: 'English, Polish, Intermediate Spanish, Beginner Turkish, Beginner Mandarin'
    }
];

export default class ProfileLink extends React.Component {

    jwt;
    jsUserId;
    cognitoSub;

    state = {
        saving: false,
        message: ''
    }

    componentWillMount() {
        let auth = new CognitoAuth(CognitoUtil.getCognitoAuthData());
        let session = auth.getCachedSession();
        if (session && session.isValid()) {
            this.jwt = session.getIdToken().getJwtToken();
        }
    }

    handleCognitoSubChange(event, data) {
        this.cognitoSub = data.value;
        this.setState({ message: '' });
    }

    handleUserSelection(event, data) {
        this.jsUserId = parseInt(data.value, 10);
        this.setState({ message: '' });
    }

    handleSave() {
        console.log(`Link jsUserId:${this.jsUserId} => cognitoSub:${this.cognitoSub}`);

        let user = JsUsers.find(x => x.js_user_id === this.jsUserId);
        if (!user) {
            console.error('User with id=' + this.jsUserId + ' was not found');
            return;
        }

        user.user_id = this.cognitoSub;

        this.setState({ saving: true });

        let api = new ApiClient();
        api.linkUser(this.jwt, user)
            .then(x => {
                this.setState({ saving: false, message: 'Success!' });
                console.log(x);
            })
            .catch(err => {
                let message = 'Status: ' + err.response.status;
                if (err.response.status === 404) {
                    message = `User with Cognito Sub: '${this.cognitoSub}' was not found.  Please register the user and try again.`;
                }
                else if (err.response.data.error) {
                    message = JSON.stringify(err.response.data.error);
                }
                this.setState({ saving: false, message: message });
                console.error(err);
            });
    }

    render() {
        if (!this.jwt) {
            return <Redirect to='/' />
        }

        let jsUsers = JsUsers.map(user => {
            return {
                text: `${user.name} (${user.js_user_id})`,
                value: user.js_user_id,
            }
        });

        return (
            <div>
                <AppHeader />

                <div style={{ margin: '20px 0 0 10px' }}>
                    <Dropdown placeholder='JS User' selection options={jsUsers} onChange={(e, d) => this.handleUserSelection(e, d)} />
                    <Input style={{ marginLeft: '20px', width: '300px' }} placeholder='User Id (Cognito Sub)' onChange={(e, d) => this.handleCognitoSubChange(e, d)} />
                    <Button style={{ margin: '0 10px 0 20px' }} color='pink' onClick={() => this.handleSave()} disabled={this.state.saving} loading={this.state.saving}>
                        Save
                    </Button>
                    {this.state.message}
                </div>
            </div >
        )
    }
}