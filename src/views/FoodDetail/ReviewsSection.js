import React from 'react'
import { Header, Divider, Rating } from 'semantic-ui-react'
import './index.css'
import FoodRatingSection from './FoodRatingSection'
import ReviewList from './ReviewList'

const ReviewsSection = ({ food, reviews }) => {
    return (
        <div>
            <Header className='detail-sub-header' as='h2'>
                <div style={{ display: 'flex', marginTop: '2px', marginBottom: '10px' }}>
                    {food.ratingCount} Reviews
                    <Rating disabled={true} maxRating={5} rating={food.rating} size='huge' style={{ marginTop: '10px', marginLeft: '14px' }} />
                </div>
            </Header>
            <Divider section />
            <FoodRatingSection food={food} />
            <Divider section />
            <ReviewList reviews={reviews} />
        </div>
    );
}

export default ReviewsSection;