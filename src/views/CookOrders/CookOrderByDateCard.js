import React from 'react'
import moment from 'moment'
import { Segment, Icon, Accordion } from 'semantic-ui-react'
import './CookOrderByDateCard.css'
import PriceCalc from '../../services/PriceCalc'
import CookOrderCard from './CookOrderCard'

class CookOrderByDateCard extends React.Component {

    state = { showDetails: false }

    updateDayTotal(orders) {
        const daySummary = orders.reduce(({ total, count }, order) => {
            return {
                total: total + PriceCalc.getTotalOrderPrice(order),
                count: count + 1
            };
        }, { total: 0, count: 0 });
        this.setState({ daySummary });
    }

    componentWillMount() {
        this.updateDayTotal(this.props.orders);
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.orders !== nextProps.orders) {
            this.updateDayTotal(nextProps.orders);
        }
    }

    render() {
        const { orders, day, onAccept, onDecline, onCancel } = this.props;
        const date = moment(day);

        const { showDetails, daySummary } = this.state;

        const orderCards = orders.map(order => {
            return (<CookOrderCard
                key={order.order_id}
                order={order}
                onAccept={onAccept}
                onDecline={onDecline}
                onCancel={onCancel}
            />);
        });

        return (
            <Segment className='cookorderbydatecard'>
                <Accordion>
                    <Accordion.Title active={showDetails} onClick={() => this.setState({ showDetails: !showDetails })}>
                        <div className='cookorderbydatecard-summary'>
                            <div className='cookorderbydatecard-summary-day'>
                                <Icon name='dropdown' />
                                <div>{date.format('dddd, MMMM D')}</div>
                            </div>
                            <div className='cookorderbydatecard-summary-order'>
                                <div>{daySummary.count} order{daySummary.count > 1 ? 's' : ''}</div>
                                <div>Total ${daySummary.total}</div>
                            </div>
                        </div>
                    </Accordion.Title>
                    <Accordion.Content active={showDetails}>
                        {orderCards}
                    </Accordion.Content>
                </Accordion>
            </Segment>
        )
    }
}

export default CookOrderByDateCard;