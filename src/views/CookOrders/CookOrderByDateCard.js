import React from 'react'
import moment from 'moment'
import { Segment, Divider, Icon, Accordion, Grid } from 'semantic-ui-react'
import './CookOrderByDateCard.css'
import PriceCalc from '../../services/PriceCalc'
import OrderFilters from '../../store/cookOrders/orderFilters'
import CookOrderCard from './CookOrderCard'

class CookOrderByDateCard extends React.Component {

    state = { showDetails: false }

    updateDayTotal(orders) {
        const daySummary = orders.reduce((summary, order) => {
            let statusSummary = summary[order.status];
            if (!statusSummary) {
                summary[order.status] = {
                    total: 0,
                    count: 0
                };
                statusSummary = summary[order.status];
            };

            statusSummary.total += PriceCalc.getTotalOrderPrice(order);
            statusSummary.count++;
            return summary;
        }, {});
        this.setState({ daySummary });
    }

    componentWillMount() {
        this.updateDayTotal(this.props.orders);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.orders !== nextProps.orders) {
            this.updateDayTotal(nextProps.orders);
        }
    }

    render() {
        const { orders, day, orderFilter, onAccept, onDecline, onCancel } = this.props;
        const date = moment(day);

        const { showDetails, daySummary } = this.state;

        const orderCards = orders.map(order => {
            return (
                <div key={order.order_id}>
                    <Divider />
                    <CookOrderCard
                        order={order}
                        onAccept={onAccept}
                        onDecline={onDecline}
                        onCancel={onCancel}
                    />
                </div>
            );
        });

        let summaries = [];
        for (const key in daySummary) {
            summaries.push([key, daySummary[key]]);
        }

        const summaryContent = summaries.map(([status, summary]) => {
            return (
                <div key={status} className='cookorderbydatecard-summary-order'>
                    <div>{status}: {summary.count} order{summary.count > 1 ? 's' : ''}</div>
                    <div>Total ${summary.total}</div>
                </div>);
        });

        return (
            <Segment className='cookorderbydatecard'>
                <Accordion>
                    <Accordion.Title active={showDetails} onClick={() => this.setState({ showDetails: !showDetails })}>                        
                        <Grid stackable>
                            <Grid.Column width={6}>
                                <div className='cookorderbydatecard-summary'>
                                    <div className='cookorderbydatecard-summary-day'>
                                        <Icon color='purple' size='large' name='angle down' />
                                        <div>{date.format('dddd, MMMM D')}</div>
                                    </div>
                                    {/* {summaryContent} */}
                                </div>
                            </Grid.Column>
                            <Grid.Column width={5}>
                                <div className='cookorderbydatecard-summary-order'>
                                    {Math.random() > 0.5 &&
                                        <div>Pending: $150</div>
                                    }
                                </div>
                            </Grid.Column>
                            <Grid.Column width={5}>
                                <div className='cookorderbydatecard-summary-order'>
                                    {Math.random() > 0.5 &&
                                        <div>Accepted: $100</div>
                                    }
                                </div>
                            </Grid.Column>
                        </Grid>
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