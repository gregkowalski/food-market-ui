import React, { Suspense, lazy } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { StripeProvider } from 'react-stripe-elements'
import { Router, Switch, Route } from 'react-router-dom'
import { history } from './History'

import ReactGA from 'react-ga'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './semantic/semantic.min.css'
import './index.css'

import Url from './services/Url'
import ScrollToTop from './components/ScrollToTop'
import configureStore from './store/configureStore'
import Config from './Config'
import { unregister } from './registerServiceWorker'
import isAuth from './hoc/AuthCheckHoc'
import isAdmin from './hoc/AdminCheckHoc'
import withTracker from './hoc/WithTrackerHoc'

const Privacy = lazy(() => import('./views/Info/Privacy'));
const Terms = lazy(() => import('./views/Info/Terms'));
const About = lazy(() => import('./views/Info/About'));
const Cookies = lazy(() => import('./views/Info/Cookies'));
const Help = lazy(() => import('./views/Info/Help'));
const Policies = lazy(() => import('./views/Info/Policies'));
const Safety = lazy(() => import('./views/Info/Safety'));
const WhyCook = lazy(() => import('./views/Info/WhyCook'));
const HowTo = lazy(() => import('./views/Info/HowTo'));
const Community = lazy(() => import('./views/Info/Community'));
const Cooks = lazy(() => import('./views/Info/Cooks'));
const TermsAccept = lazy(() => import('./views/TermsAccept'));

const InviteUser = lazy(() => import('./views/Admin/InviteUser'));
const ManageFoods = lazy(() => import('./views/Admin/ManageFoods'));
const ManageFood = lazy(() => import('./views/Admin/ManageFood'));

const InvitesCallback = lazy(() => import('./views/Public/InvitesCallback'));
const ConfirmUser = lazy(() => import('./views/Public/ConfirmUser'));

const FoodDetail = lazy(() => import('./views/FoodDetail'));
const Order = lazy(() => import('./views/Order'));
const BuyerOrders = lazy(() => import('./views/BuyerOrders'));
const CookOrders = lazy(() => import('./views/CookOrders'));
const OrderSuccess = lazy(() => import('./views/OrderSuccess'));
const CognitoCallback = lazy(() => import('./services/Cognito/CognitoCallback'));
const CognitoSignout = lazy(() => import('./services/Cognito/CognitoSignout'));
const StripeCallback = lazy(() => import('./services/Stripe/StripeCallback'));
const ProfileEdit = lazy(() => import('./views/Profile/ProfileEdit'));
const ProfileView = lazy(() => import('./views/Profile/ProfileView'));
const Home = lazy(() => import('./views/Home'));
const Login = lazy(() => import('./views/Login'));
const Search = lazy(() => import('./views/Search'));
const NotFoundPage = lazy(() => import('./views/NotFoundPage'));

unregister();

ReactGA.initialize(Config.GoogleAnalytics.TrackingId);

const { store, persistor } = configureStore({ includeLogger: true, includePersistor: true });

const appPage = (page) => {
    return isAuth(withTracker(page));
}

const skipTermsAcceptedAppPage = (page) => {
    return isAuth(withTracker(page), { skipTermsAccepted: true });
}

const adminPage = (page) => {
    return isAdmin(appPage(page));
}

const publicPage = (page) => {
    return withTracker(page);
}

render(
    <Suspense fallback={<div></div>}>
        <StripeProvider apiKey={Config.Stripe.PublicApiKey}>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <ToastContainer
                        position={toast.POSITION.TOP_CENTER}
                        hideProgressBar={true}
                        draggablePercent={35}
                        bodyClassName='toast-body' />
                    <Router history={history}>
                        <ScrollToTop>
                            <Switch>
                                <Route exact path='/' component={appPage(Home)} />
                                <Route exact path='/search' component={appPage(Search)} />
                                <Route exact path='/foods/:id/orderSuccess' component={appPage(OrderSuccess)} />
                                <Route exact path='/foods/:id/order' component={appPage(Order)} />
                                <Route exact path='/foods/:id' component={appPage(FoodDetail)} />
                                <Route exact path={Url.profileView(':userId')} component={appPage(ProfileView)} />
                                <Route exact path={Url.profileEdit()} component={appPage(ProfileEdit)} />
                                <Route exact path='/buyerOrders' component={appPage(BuyerOrders)} />
                                <Route exact path='/cookOrders' component={appPage(CookOrders)} />
                                <Route exact path='/login' component={appPage(Login)} />
                                <Route exact path='/cognitoCallback' component={publicPage(CognitoCallback)} />
                                <Route exact path='/cognitoSignout' component={publicPage(CognitoSignout)} />
                                <Route exact path='/stripeCallback' component={publicPage(StripeCallback)} />
                                <Route exact path={Url.termsAccept()} component={publicPage(TermsAccept)} />
                                <Route exact path={'/invites/:invite_id'} component={publicPage(InvitesCallback)} />
                                <Route exact path={Url.confirmUser()} component={publicPage(ConfirmUser)} />

                                <Route exact path={Url.admin.inviteUser()} component={adminPage(InviteUser)} />
                                <Route exact path={Url.admin.manageFoods()} component={adminPage(ManageFoods)} />
                                <Route exact path={Url.admin.manageFood(':food_id')} component={adminPage(ManageFood)} />

                                <Route exact path={Url.about()} component={appPage(About)} />
                                <Route exact path={Url.cookies()} component={appPage(Cookies)} />
                                <Route exact path={Url.help()} component={appPage(Help)} />
                                <Route exact path={Url.policies()} component={appPage(Policies)} />
                                <Route exact path={Url.privacy()} component={skipTermsAcceptedAppPage(Privacy)} />
                                <Route exact path={Url.terms()} component={skipTermsAcceptedAppPage(Terms)} />
                                <Route exact path={Url.safety()} component={appPage(Safety)} />
                                <Route exact path={Url.whycook()} component={appPage(WhyCook)} />
                                <Route exact path={Url.community()} component={appPage(Community)} />
                                <Route exact path={Url.howto()} component={appPage(HowTo)} />
                                <Route exact path={Url.cooks()} component={appPage(Cooks)} />

                                <Route component={withTracker(NotFoundPage)} />
                            </Switch>
                        </ScrollToTop>
                    </Router>
                </PersistGate>
            </Provider>
        </StripeProvider>
    </Suspense>,
    document.getElementById('root')
)
