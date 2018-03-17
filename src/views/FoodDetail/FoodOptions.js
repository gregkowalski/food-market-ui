import React from 'react'
import { Grid, Icon } from 'semantic-ui-react'
import './index.css'
import Util from '../../services/Util'

const FoodOptions = ({ food }) => {

    let foodPrepIcon = Util.getFoodPrepTypeIcon(food);
    return (
        <Grid doubling columns={5}>
            <Grid.Row>
                <Grid.Column>
                    <span className='food-detail-icon-tags'><Icon name={foodPrepIcon} /> {food.states[0]}</span>
                </Grid.Column>
                <Grid.Column>
                    {food.delivery && <span className='food-detail-icon-tags'><Icon name='shipping' /> delivery</span>}
                </Grid.Column>
                <Grid.Column>
                    {food.pickup && <span className='food-detail-icon-tags'><Icon name='hand rock' />pick-up</span>}
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}

export default FoodOptions;