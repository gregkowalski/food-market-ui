import React from 'react'
import { Grid, Rating } from 'semantic-ui-react'
import './index.css'

const FoodRatingSection = ({ food }) => {
    return (
        <Grid stackable columns={2} className='detail-rating'>
            <Grid.Row>
                <Grid.Column>
                    <div>
                        <div>Accuracy</div>
                        <Rating disabled={true} maxRating={5} rating={food.rating} />
                    </div>
                </Grid.Column>
                <Grid.Column>
                    <div>
                        <div>Quality</div>
                        <Rating disabled={true} maxRating={5} rating={food.rating} />
                    </div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    <div>
                        <div>Communication</div>
                        <Rating disabled={true} maxRating={5} rating={food.rating} />
                    </div>
                </Grid.Column>
                <Grid.Column>
                    <div>
                        <div>Taste</div>
                        <Rating disabled={true} maxRating={5} rating={food.rating} />
                    </div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    <div>
                        <div>Freshness</div>
                        <Rating disabled={true} maxRating={5} rating={food.rating} />
                    </div>
                </Grid.Column>
                <Grid.Column>
                    <div>
                        <div>Value</div>
                        <Rating disabled={true} maxRating={5} rating={food.rating} />
                    </div>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}

export default FoodRatingSection;