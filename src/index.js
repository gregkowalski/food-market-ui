import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { StripeProvider } from 'react-stripe-elements'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import 'whatwg-fetch'
import './semantic/semantic.min.css'
import FoodDetail from './FoodDetail'
import Order from './Order'
import OrderSuccess from './OrderSuccess'
import OrderError from './OrderError'
import { unregister } from './registerServiceWorker'
import CognitoCallback from './Cognito/CognitoCallback'
import CognitoSignout from './Cognito/CognitoSignout'
import StripeCallback from './Stripe/StripeCallback'
import ProfileEdit from './ProfileEdit'
import ProfileView from './ProfileView'
import ProfileLink from './ProfileLink'
import NotFoundPage from './NotFoundPage'
import Login from './Login'
import Config from './Config'
import Pricing from './Pricing'
// import Map2 from './map2'
import MobileSearch from './MobileSearch'
import Home from './Home'
import configureStore from './store/configureStore'

//import temp from 'temp'

unregister();

const store = configureStore({ includeLogger: true });

render(
    <StripeProvider apiKey={Config.Stripe.PublicApiKey}>
        <Provider store={store}>
            <BrowserRouter>
                <Switch>
                    <Route exact path='/' component={Home} />
                    {/* <Route path='/temp' component={temp} /> */}
                    <Route path='/foods/:id/orderSuccess' component={OrderSuccess} />
                    <Route path='/foods/:id/orderError' component={OrderError} />
                    <Route path='/foods/:id/order' component={Order} />
                    <Route path='/foods/:id' exact component={FoodDetail} />
                    <Route path='/cognitoCallback' exact component={CognitoCallback} />
                    <Route path='/cognitoSignout' exact component={CognitoSignout} />
                    <Route path='/stripeCallback' exact component={StripeCallback} />
                    <Route path='/profile/view/:userId' exact component={ProfileView} />
                    <Route path='/profile/edit/:userId' exact component={ProfileEdit} />
                    <Route path='/profilelink' exact component={ProfileLink} />
                    <Route path='/login' exact component={Login} />
                    <Route path='/pricing' exact component={Pricing} />
                    {/* <Route path='/map2' exact component={Map2} /> */}
                    <Route path='/mobilesearch' exact component={MobileSearch} />
                    <Route component={NotFoundPage} />
                </Switch>
            </BrowserRouter>
        </Provider>
    </StripeProvider>,
    document.getElementById('root')
)
