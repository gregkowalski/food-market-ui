import React from 'react'
import { Header, Divider, Icon } from 'semantic-ui-react'
import Scroll from 'react-scroll'
import ShowMore from 'react-show-more'
import './index.css'
import FoodOptions from './FoodOptions'
import FoodPrepSafetyMessage from './FoodPrepSafetyMessage'
import './OverviewSection.css'
import RegionUtil from '../../components/Map/RegionUtil'
import { FoodFeatureLabels, FoodAllergyLabels } from '../../Enums'
import withGoogle from '../../hoc/WithGoogleHoc'

class OverviewSection extends React.Component {

    render() {
        const { food, cook, google } = this.props;

        return (
            <div>
                <Header className='detail-main-header' as='h2'>
                    {food.title}
                </Header>
                <div style={{ display: 'inline-block', verticalAlign: 'middle', color: '#4e4e4e', margin: '5px 0px 3px 2px', fontSize: '1.2em' }}>
                    locally handcrafted by
                <Scroll.Link className='detail-cook-link' to='cook'
                        spy={true} smooth={true} container={document}
                        offset={-85} duration={500}>
                        {cook ? cook.name : '...'}
                    </Scroll.Link>
                </div>
                <div style={{ clear: 'both' }}></div>
                <Header as='h3' className='food-detail-header'>Location</Header>
                {google &&
                    <div className='detail-body-text'>
                        {food.regions.length > 0 &&
                            <div>Available for delivery to these neighbourhoods:
                        <ul>
                                    {food.regions.map((regionId, index) => {
                                        return (<li key={index}>{RegionUtil.getRegionNameById(google, regionId)}</li>);
                                    })}
                                </ul>
                            </div>
                        }
                        <div>Available for pickup from: {RegionUtil.getRegionNameByPosition(google, food.position)}</div>
                    </div>
                }
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

                        <div className='user-text' dangerouslySetInnerHTML={{ __html: food.short_description.replace(/\\n|\n/g, "<br />") }}></div>
                        <div dangerouslySetInnerHTML={{ __html: food.long_description.replace(/\\n|\n/g, "<br />") }}></div>
                    </ShowMore>  </div>
                <Divider section />

                <Header as='h3' className='food-detail-header'>Ingredients</Header>
                <div className='detail-body-text'>
                    <ul>
                        {food.ingredients.map((ingredient, index) => {
                            return (<li key={index}>{ingredient}</li>);
                        })}
                    </ul>
                </div>

                <Divider section />

                <Header as='h3' className='food-detail-header'>Allergy Information</Header>
                <div className='detail-body-text'>
                    <div className='user-text'>
                        {food.allergies && food.allergies.length > 0 &&
                            <div className='user-text-weight'>
                                May contain one or more of the following allergens:
                            </div>
                        }
                        {(!food.allergies || food.allergies.length <= 0) &&
                            <div className='user-text-weight'>
                                This food does not contain any allergens.
                            </div>
                        }
                    </div>
                    <div style={{ marginLeft: '15px', marginTop: '15px' }}>
                        <ul>
                            {food.allergies.map((allergy, index) => {
                                const allergyText = FoodAllergyLabels[allergy] ? FoodAllergyLabels[allergy] : allergy;
                                return (<li key={index}>{allergyText}</li>);
                            })}
                        </ul>
                    </div>
                    <div style={{ marginTop: '15px' }}>
                        <Icon color='teal' name='angle double right' />
                        For any questions regarding allergens or other specific contents, please contact your
                        neighbourhood cook directly.
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
                <div className='detail-body-text'>
                    <ul>
                        {food.features.map((feature, index) => {
                            const featureText = FoodFeatureLabels[feature] ? FoodFeatureLabels[feature] : feature;
                            return (<li key={index}>{featureText}</li>);
                        })}
                    </ul>
                </div>

                <Divider section hidden />

            </div>
        );
    }
}

export default withGoogle(OverviewSection);