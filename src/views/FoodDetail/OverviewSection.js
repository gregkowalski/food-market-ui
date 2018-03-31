import React from 'react'
import { Header, Divider, Icon } from 'semantic-ui-react'
import Scroll from 'react-scroll'
import ShowMore from 'react-show-more'
import './index.css'
import FoodOptions from './FoodOptions'
import FoodPrepSafetyMessage from './FoodPrepSafetyMessage'
import './OverviewSection.css'

const OverviewSection = ({ food, cook }) => {
    return (
        <div>

            <Header className='detail-main-header' as='h2'>
                ${food.price} · {food.title}
            </Header>
            <div style={{ display: 'inline-block', verticalAlign: 'middle', color: '#4e4e4e', margin: '5px 0px 3px 2px', fontSize: '1.2em' }}>
                locally handcrafted by
                <Scroll.Link className='author-link' to='cook'
                    spy={true} smooth={true} container={document}
                    offset={-85} duration={500}>
                    {cook ? cook.name : '...'}
                </Scroll.Link>
            </div>
            <div style={{ clear: 'both' }}></div>
            <div style={{ color: '#5e5d5d', marginTop: '20px' }}>
                <FoodOptions food={food} />
            </div>

            <Header as='h3' className='food-detail-header'>The Food</Header>
            <div className='detail-body-text'>
                <ShowMore
                    lines={3}
                    more={<div style={{ color: '#189da7' }}>Read more about this food <Icon name='angle down' /></div>}
                    less={<div style={{ color: '#189da7' }}>Hide <Icon name='angle up' /></div>}
                    anchorClass='showmore-text'>

                    <div className='user-text'>{food.short_description} </div>
                    <div>{food.long_desciption}</div>
                </ShowMore>  </div>
            <Divider section />

            <Header as='h3' className='food-detail-header'>Ingredients</Header>
            <div className='detail-body-text'>{food.title}.</div>

            <Divider section />

            <Header as='h3' className='food-detail-header'>Allergy Information</Header>
            <div className='detail-body-text'>
                <div className='user-text'>
                    <div className='user-text-weight'>
                        May contain one or more of the following allergens:
                    </div>
                </div>
                <div style={{ marginLeft: '15px', marginTop: '15px' }}>{food.allergies.join(',')}.</div>
                <div style={{ marginTop: '15px' }}>
                    <Icon color='teal' name='angle double right' />
                    For any questions regarding allergens or other specific contents, please contact your neighbourhood cook directly.
                </div>
            </div>

            <Divider section />

            <Header as='h3' className='food-detail-header'>Prep + Storage</Header>
            <div className='detail-body-text'>
                <ShowMore
                    more={<div style={{ color: '#189da7' }}>Get more details <Icon name='angle down' /></div>}
                    less={<div style={{ color: '#189da7' }}>Hide <Icon name='angle up' /></div>}
                    anchorClass='showmore-text'>
                    <div className='user-text'>
                        {food.instruction}
                    </div>
                </ShowMore>
                <div style={{ marginTop: '15px' }}>
                    <FoodPrepSafetyMessage food={food} />
                </div>
            </div>
            <Divider section />

            <Header as='h3' className='food-detail-header'>Bite Sizes</Header>
            <div className='detail-body-text'><span className='user-text-weight'>{food.unit} </span> per order.  Feeds approximately {food.feed} people. </div>
            <Divider section />

            <Header as='h3' className='food-detail-header'>Special Features</Header>
            <div className='detail-body-text'>{food.features.join(', ')}</div>

            <Divider section hidden />

        </div>
    );
}

export default OverviewSection;