const Config = {
    Api: {
        Region: 'us-west-2',
        BaseUrl: 'https://api-greg.cosmo-test.com/v1',
    },
    Cognito: {
        AppWebDomain: 'food-market-greg.auth.us-west-2.amazoncognito.com',
        ClientAppId: '7a4ickt7a3po8m2m1l8prnkh6v',
        UserPoolId: 'us-west-2_9SNYJrOeq',
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
        SupportEmail: 'greg+dev@foodcraft.ca'
    },
    GoogleAnalytics: {
        TrackingId: 'UA-123045559-1'
    }
}

export default Config;