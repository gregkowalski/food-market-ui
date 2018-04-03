import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { StripeProvider } from 'react-stripe-elements'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import 'whatwg-fetch'
import './semantic/semantic.min.css'
import FoodDetail from './views/FoodDetail'
import Order from './views/Order'
import BuyerOrders from './views/BuyerOrders'
import CookOrders from './views/CookOrders'
import OrderSuccess from './views/OrderSuccess'
import CognitoCallback from './services/Cognito/CognitoCallback'
import CognitoSignout from './services/Cognito/CognitoSignout'
import StripeCallback from './services/Stripe/StripeCallback'
import ProfileEdit from './views/ProfileEdit'
import ProfileView from './views/ProfileView'
import NotFoundPage from './views/NotFoundPage'
import Login from './views/Login'
// import Map2 from './views/map2'
import Search from './views/Search'
import ScrollToTop from './components/ScrollToTop'

import configureStore from './store/configureStore'
import Config from './Config'
import { unregister } from './registerServiceWorker'
//import temp from 'temp'

import { PersistGate } from 'redux-persist/integration/react'

import isAuth from './AuthCheckHoc'

unregister();

const { store, persistor } = configureStore({ includeLogger: true });

render(
    <StripeProvider apiKey={Config.Stripe.PublicApiKey}>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <BrowserRouter>
                    <ScrollToTop>
                        <Switch>
                            <Route exact path='/' component={isAuth(Search)} />
                            {/* <Route path='/temp' component={temp} /> */}
                            <Route exact path='/foods/:id/orderSuccess' component={isAuth(OrderSuccess)} />
                            <Route exact path='/foods/:id/order' component={isAuth(Order)} />
                            <Route exact path='/foods/:id' component={isAuth(FoodDetail)} />
                            <Route exact path='/cognitoCallback' component={CognitoCallback} />
                            <Route exact path='/cognitoSignout' component={CognitoSignout} />
                            <Route exact path='/stripeCallback' component={StripeCallback} />
                            <Route exact path='/profile/view/:userId' component={isAuth(ProfileView)} />
                            <Route exact path='/profile/edit/:userId' component={isAuth(ProfileEdit)} />
                            <Route exact path='/buyerOrders' component={isAuth(BuyerOrders)} />
                            <Route exact path='/cookOrders' component={isAuth(CookOrders)} />
                            <Route exact path='/login' component={isAuth(Login)} />

                            {/* <Route exact path='/map2' component={Map2} /> */}
                            <Route component={NotFoundPage} />
                        </Switch>
                    </ScrollToTop>
                </BrowserRouter>
            </PersistGate>
        </Provider>
    </StripeProvider>,
    document.getElementById('root')
)
