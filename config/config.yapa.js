const Config = {
    Api: {
        Region: 'us-west-2',
        BaseUrl: 'https://api-yapa.cosmo-test.com/v1',
    },
    Cognito: {
        AppWebDomain: 'food-market-yapa.auth.us-west-2.amazoncognito.com',
        ClientAppId: '1rpohkqj6m3p5g1n70qrnqkdj3',
        UserPoolId: 'us-west-2_luMhWlYlG',
        RedirectUriSignIn: 'http://localhost:3000/cognitoCallback',
        RedirectUriSignOut: 'http://localhost:3000/cognitoSignout',
        TokenScopesArray: ['openid', 'aws.cognito.signin.user.admin', 'email']
    },
    Stripe: {
        ClientId: 'ca_C2ECxvqWXaiTNmA44vVjfx2clgV7OexY'
    }
}

export default Config;