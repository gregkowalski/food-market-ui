const Config = {
    Api: {
        Region: 'us-west-2',
        BaseUrl: 'https://api.foodcraft.ca/v1',
    },
    Cognito: {
        AppWebDomain: 'foodcraft.auth.us-west-2.amazoncognito.com',
        ClientAppId: '6id7k4qe2tk433cbh4e8nf5mth',
        UserPoolId: 'us-west-2_WdWrx74ZQ',
        RedirectUriSignIn: 'https://www.foodcraft.ca/cognitoCallback',
        RedirectUriSignOut: 'https://www.foodcraft.ca/cognitoSignout',
        TokenScopesArray: ['openid', 'aws.cognito.signin.user.admin', 'email']
    },
    Stripe: {
        ClientId: 'ca_DUazA1PDmlTRzbLlJqi70Fb2WFmGGTsb',
        PublicApiKey: 'pk_live_xqxanOaNwa0wzt3N8XCUke5s',
        ConnectOAuthRedirectUri: 'https://www.foodcraft.ca/stripeCallback',
    },
    Foodcraft: {
        SupportEmail: 'support@foodcraft.ca'
    },
    Google: {
        ApiKey: 'AIzaSyBfMn-NL_oNuejJMLZT1nQdNEKP4o-E9wY'
    },
    GoogleAnalytics: {
        TrackingId: 'UA-123045559-3'
    }
}

export default Config;