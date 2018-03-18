import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { StripeProvider } from 'react-stripe-elements'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import 'whatwg-fetch'
import './semantic/semantic.min.css'
import FoodDetail from './views/FoodDetail'
import Order from './views/Order'
import OrderSuccess from './views/OrderSuccess'
import CognitoCallback from './services/Cognito/CognitoCallback'
import CognitoSignout from './services/Cognito/CognitoSignout'
import StripeCallback from './services/Stripe/StripeCallback'
import ProfileEdit from './views/ProfileEdit'
import ProfileView from './views/ProfileView'
import NotFoundPage from './views/NotFoundPage'
import Login from './views/Login'
// import Map2 from './views/map2'
import SearchContainer from './views/SearchContainer'
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
                            <Route exact path='/' component={SearchContainer} />
                            {/* <Route path='/temp' component={temp} /> */}
                            <Route path='/foods/:id/orderSuccess' component={isAuth(OrderSuccess)} />
                            <Route path='/foods/:id/order' component={isAuth(Order)} />
                            <Route path='/foods/:id' exact component={isAuth(FoodDetail)} />
                            <Route path='/cognitoCallback' exact component={CognitoCallback} />
                            <Route path='/cognitoSignout' exact component={CognitoSignout} />
                            <Route path='/stripeCallback' exact component={StripeCallback} />
                            <Route path='/profile/view/:userId' exact component={isAuth(ProfileView)} />
                            <Route path='/profile/edit/:userId' exact component={isAuth(ProfileEdit)} />
                            <Route path='/login' exact component={Login} />
                            {/* <Route path='/map2' exact component={Map2} /> */}
                            <Route component={NotFoundPage} />
                        </Switch>
                    </ScrollToTop>
                </BrowserRouter>
            </PersistGate>
        </Provider>
    </StripeProvider>,
    document.getElementById('root')
)
