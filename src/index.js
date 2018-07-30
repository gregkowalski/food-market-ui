import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { StripeProvider } from 'react-stripe-elements'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import ReactGA from 'react-ga'

import 'whatwg-fetch'
import './semantic/semantic.min.css'
import './index.css'

import Url from './services/Url'
import FoodDetail from './views/FoodDetail'
import Order from './views/Order'
import BuyerOrders from './views/BuyerOrders'
import CookOrders from './views/CookOrders'
import OrderSuccess from './views/OrderSuccess'
import CognitoCallback from './services/Cognito/CognitoCallback'
import CognitoSignout from './services/Cognito/CognitoSignout'
import StripeCallback from './services/Stripe/StripeCallback'
import ProfileEdit from './views/Profile/ProfileEdit'
import ProfileView from './views/Profile/ProfileView'
import Home from './views/Home'
import NotFoundPage from './views/NotFoundPage'
import Login from './views/Login'
import Search from './views/Search'
import ScrollToTop from './components/ScrollToTop'
import configureStore from './store/configureStore'
import Config from './Config'
import { unregister } from './registerServiceWorker'
import isAuth from './hoc/AuthCheckHoc'
import withTracker from './hoc/WithTrackerHoc'
import About from './views/Info/About'
import Cookies from './views/Info/Cookies'
import Help from './views/Info/Help'
import Policies from './views/Info/Policies'
import Privacy from './views/Info/Privacy'
import Terms from './views/Info/Terms'
import Safety from './views/Info/Safety'
import WhyCook from './views/Info/WhyCook'
import HowTo from './views/Info/HowTo'
import Community from './views/Info/Community'
import Cooks from './views/Info/Cooks'

// import Map2 from './views/map2'
//import temp from 'temp'

unregister();

ReactGA.initialize(Config.GoogleAnalytics.TrackingId);

const { store, persistor } = configureStore({ includeLogger: true });

const appPage = (page) => {
    return isAuth(withTracker(page));
}

render(
    <StripeProvider apiKey={Config.Stripe.PublicApiKey}>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <BrowserRouter>
                    <ScrollToTop>
                        <Switch>
                            <Route exact path='/' component={appPage(Home)} />
                            <Route exact path='/search' component={appPage(Search)} />
                            <Route exact path='/foods/:id/orderSuccess' component={appPage(OrderSuccess)} />
                            <Route exact path='/foods/:id/order' component={appPage(Order)} />
                            <Route exact path='/foods/:id' component={appPage(FoodDetail)} />
                            <Route exact path='/profile/view/:userId' component={appPage(ProfileView)} />
                            <Route exact path='/profile/edit' component={appPage(ProfileEdit)} />
                            <Route exact path='/buyerOrders' component={appPage(BuyerOrders)} />
                            <Route exact path='/cookOrders' component={appPage(CookOrders)} />
                            <Route exact path='/login' component={appPage(Login)} />
                            <Route exact path='/cognitoCallback' component={withTracker(CognitoCallback)} />
                            <Route exact path='/cognitoSignout' component={withTracker(CognitoSignout)} />
                            <Route exact path='/stripeCallback' component={withTracker(StripeCallback)} />

                            <Route exact path={Url.about()} component={appPage(About)} />
                            <Route exact path={Url.cookies()} component={appPage(Cookies)} />
                            <Route exact path={Url.help()} component={appPage(Help)} />
                            <Route exact path={Url.policies()} component={appPage(Policies)} />
                            <Route exact path={Url.privacy()} component={appPage(Privacy)} />
                            <Route exact path={Url.terms()} component={appPage(Terms)} />
                            <Route exact path={Url.safety()} component={appPage(Safety)} />
                            <Route exact path={Url.whycook()} component={appPage(WhyCook)} />
                            <Route exact path={Url.community()} component={appPage(Community)} />
                            <Route exact path={Url.howto()} component={appPage(HowTo)} />
                            <Route exact path={Url.cooks()} component={appPage(Cooks)} />

                            <Route component={withTracker(NotFoundPage)} />

                            {/* <Route path='/temp' component={temp} /> */}
                            {/* <Route exact path='/map2' component={Map2} /> */}
                        </Switch>
                    </ScrollToTop>
                </BrowserRouter>
            </PersistGate>
        </Provider>
    </StripeProvider>,
    document.getElementById('root')
)
