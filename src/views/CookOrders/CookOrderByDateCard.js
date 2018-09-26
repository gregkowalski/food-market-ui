import React from 'react'
import moment from 'moment'
import { Segment, Divider, Icon, Accordion, Grid } from 'semantic-ui-react'
import './CookOrderByDateCard.css'
import PriceCalc from '../../services/PriceCalc'
import OrderFilters from '../../store/cookOrders/orderFilters'
import CookOrderCard from './CookOrderCard'
import * as Enums from '../../Enums'

class CookOrderByDateCard extends React.Component {

    state = { showDetails: false }

    updateDayTotal(orders) {
        const daySummary = orders.reduce((summary, order) => {
            let statusSummary = summary[order.status];
            if (!statusSummary) {
                summary[order.status] = {
                    total: 0,
                    count: 0,
                    status: order.status
                };
                statusSummary = summary[order.status];
            };

            statusSummary.total += PriceCalc.getTotalOrderPrice(order);
            statusSummary.count++;
            return summary;
        }, {});
        this.setState({ daySummary });
    }

    addDaySummaries(a, b) {
        return {
            total: a ? a.total : 0 + b ? b.total : 0,
            count: a ? a.count : 0 + b ? b.count : 0,
        };
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
        const { showDetails, daySummary } = this.state;
        const { orders, day, orderFilter, onAccept, onDecline, onCancel } = this.props;
        const date = moment(day);

        const orderCards = orders.map(order => {
            return (
                <div key={order.order_id}>
                    <Divider hidden />
                    <CookOrderCard
                        order={order}
                        onAccept={onAccept}
                        onDecline={onDecline}
                        onCancel={onCancel}
                    />
                </div>
            );
        });

        let summary1;
        let summary2;
        if (orderFilter === OrderFilters.UPCOMING) {
            summary1 = Object.assign({
                status: Enums.OrderStatus.Pending,
                total: 0
            }, daySummary[Enums.OrderStatus.Pending]);
            summary2 = Object.assign({
                status: Enums.OrderStatus.Accepted,
                total: 0
            }, daySummary[Enums.OrderStatus.Accepted]);
        }
        else {
            const declinedSummary = daySummary[Enums.OrderStatus.Declined];
            const cancelledSummary = daySummary[Enums.OrderStatus.Cancelled];
            const failedSummary = daySummary[Enums.OrderStatus.Failed];
            summary1 = this.addDaySummaries(declinedSummary, cancelledSummary);
            summary1 = this.addDaySummaries(summary1, failedSummary);
            summary1.status = Enums.OrderStatusLabels.missed;
            summary2 = daySummary[Enums.OrderStatus.Transferred];
            if (summary2) {
                summary2.status = Enums.OrderStatusLabels[Enums.OrderStatus.Transferred];
            }
        }

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
                                </div>
                            </Grid.Column>
                            <Grid.Column width={5}>
                                {summary1 && summary1.total > 0 &&
                                    < div className='cookorderbydatecard-summary-order'>
                                        <div>{summary1.status}: ${summary1.total}</div>
                                    </div>
                                }
                            </Grid.Column>
                            <Grid.Column width={5}>
                                {summary2 && summary2.total > 0 &&
                                    <div className='cookorderbydatecard-summary-order'>
                                        <div>{summary2.status}: ${summary2.total}</div>
                                    </div>
                                }
                            </Grid.Column>
                        </Grid>
                    </Accordion.Title>
                    <Accordion.Content active={showDetails}>
                        {orderCards}
                    </Accordion.Content>
                </Accordion>
            </Segment >
        )
    }
}

export default CookOrderByDateCard;