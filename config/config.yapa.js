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
        ClientId: 'ca_DUbAhQcRoGzFdSDBdoPN604uSmOC2bkg',
        PublicApiKey: 'pk_test_LaUn1QZEtks832mqWqyFHX7a',
        ConnectOAuthRedirectUri: 'http://localhost:3000/stripeCallback',
    },
    Foodcraft: {
        SupportEmail: 'yasin+dev@foodcraft.ca'
    },
    GoogleAnalytics: {
        TrackingId: 'UA-123045559-1'
    }
}

export default Config;