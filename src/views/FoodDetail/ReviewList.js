import React from 'react'
import { Feed, Divider, Image, Icon } from 'semantic-ui-react'
import ShowMore from 'react-show-more'
import './index.css'

const ReviewList = ({ reviews }) => {

    if (!reviews || reviews.length === 0)
        return null;

    const reviewComponentList = reviews.map(review => (
        <div key={review.review_id}>
            <Feed>
                <Feed.Event>
                    <Feed.Content>
                        <Image src={review.imageUrl} size='mini' floated='left' circular />
                        <div style={{ float: 'right', color: '#5e5d5d' }}>
                            <a href='url' style={{ color: '#5e5d5d' }}> <Icon name='flag outline' /></a></div>
                        <Feed.Summary className='detail-body-text'>{review.summary} </Feed.Summary>
                        <Feed.Date content={review.date} style={{ fontSize: '1.1em', fontWeight: '600', marginTop: '-1px' }} />
                        <Feed.Extra style={{ marginTop: '0.8em', maxWidth: '100%' }} >
                            <div className='detail-body-text'>
                                <ShowMore
                                    lines={4}
                                    more={<div style={{ color: '#189da7' }}>Read more</div>}
                                    less=''>
                                    {review.comment}
                                </ShowMore>
                            </div>
                        </Feed.Extra>
                    </Feed.Content>
                </Feed.Event>
            </Feed>
            <Divider section />
        </div>
    ));

    return (
        <div>
            {reviewComponentList}
        </div>
    );
}

export default ReviewList;