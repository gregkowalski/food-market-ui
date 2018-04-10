import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { Segment, Divider } from 'semantic-ui-react'
import AppHeader from '../components/AppHeader'
import Url from '../services/Url'
import { Actions, Selectors } from '../store/order'
import './OrderSuccess.css'

class OrderSuccess extends React.Component {

    componentWillMount() {
        let food_id = this.props.match.params.id;

        if (!this.props.order_id) {
            this.props.history.push(Url.foodDetail(food_id));
            return;
        }

        if (!this.props.food) {
            this.props.actions.loadFood(food_id)
                .then(() => {
                    document.title = this.props.food.title;
                    return this.props.actions.loadCook(this.props.food.user_id);
                });
        }
        else {
            document.title = this.props.food.title;
        }
    }

    render() {
        const { food, order_id } = this.props;
        if (!food || !order_id) {
            return null;
        }

        return (
            <div>
                <AppHeader />
                <Segment padded='very' style={{ width: '80%', margin: '40px auto' }}>
                    <h1 style={{ color: '#b61095' }}>Success!!!</h1>
                    <Divider hidden />                    
                    <div>A delicious order request for <span style={{ color: '#b61095' }}> <strong>{food.title}</strong> </span>has been sent.</div>
                    <Divider hidden />
                    <div>Your cook will respond to your request within 24 hours or sooner.
                    </div>
                </Segment >
            </div >
        );
    }
}


const mapStateToProps = (state) => {
    return {
        food: Selectors.food(state),
        cook: Selectors.cook(state),
        isFoodLoading: Selectors.isFoodLoading(state),
        isCookLoading: Selectors.isCookLoading(state),
        pickup: Selectors.pickup(state),
        date: Selectors.date(state),
        time: Selectors.time(state),
        quantity: Selectors.quantity(state),
        buyerAddress: Selectors.buyerAddress(state),
        order_id: Selectors.order_id(state)
    };
};

const mapDispatchToProps = (dispatch) => {
    return { actions: bindActionCreators(Actions, dispatch) };
};

OrderSuccess.propTypes = {
    food: PropTypes.shape({
        food_id: PropTypes.string.isRequired,
    }),
    cook: PropTypes.shape({
        user_id: PropTypes.string.isRequired,
    }),
    isFoodLoading: PropTypes.bool.isRequired,
    isCookLoading: PropTypes.bool.isRequired,
    pickup: PropTypes.bool.isRequired,
    date: PropTypes.object,
    time: PropTypes.number,
    quantity: PropTypes.number.isRequired,
    buyerAddress: PropTypes.string,
    order_id: PropTypes.string,

    actions: PropTypes.shape({
        loadFood: PropTypes.func.isRequired,
        loadCook: PropTypes.func.isRequired,
    }).isRequired
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OrderSuccess));
