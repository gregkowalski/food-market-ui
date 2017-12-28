import React, { Component } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import './FoodDetail.css'
import { Button, Card, Image, Icon, Rating, Modal } from 'semantic-ui-react'
import { Grid, Header, Divider, Feed, Popup } from 'semantic-ui-react'
import FoodItems from './data/FoodItems'
import Suppliers from './data/Suppliers'
import Reviews from './data/Reviews'
import Scroll from 'react-scroll'; // Imports all Mixins
import AppHeader from './components/AppHeader'
import Carousel from 'nuka-carousel'
import Util from './Util'
import { Constants } from './Constants'
import ShowMore from 'react-show-more'

var ScrollLink = Scroll.Link;
var ScrollElement = Scroll.Element;

export default class FoodDetail extends Component {

    state = {};

    getFoodItemId() {
        return parseInt(this.props.match.params.id, 10);
    }

    componentDidMount() {
        let id = this.getFoodItemId();
        let item = FoodItems.find(x => x.id === id);
        document.title = item.header;

        Scroll.scrollSpy.update();
    }

    getFoodPrepSafetyMessage(food) {
        let prep = '';
        if (food.prep === 'frozen') {
            prep = 'Frozen products must be fully cooked for food safety and quality.';
        }
        else if (food.prep === 'ready-to-eat') {
            prep = '';
        }
        return prep;
    }

    render() {
        let id = this.getFoodItemId();
        let food = FoodItems.find(x => x.id === id);
        let supplier = Suppliers.find(x => x.id === food.supplierId);

        let reviews = Reviews
            .filter(x => x.foodItemId === id);


        reviews = reviews
            .map(x => (
                <div key={x.id}>
                    <Feed>
                        <Feed.Event>
                            <Feed.Content>
                                <Image src={x.image} size='mini' floated='left' shape='circular' />
                                <div style={{ float: 'right', color: '#5e5d5d' }}>
                                    <a href="url" style={{ color: '#5e5d5d' }}> <Icon name='flag outline' /></a></div>
                                <Feed.Summary content={x.summary} />
                                <Feed.Date content={x.date} style={{ marginTop: '-1px' }} />
                                <Feed.Extra content={x.extraText} style={{ marginTop: '0.8em', maxWidth: '100%' }} />
                            </Feed.Content>
                        </Feed.Event>
                    </Feed>
                    <Divider section />
                </div>
            ));

        let prep = this.getFoodPrepSafetyMessage(food);
        let foodPrepIcon = Util.getFoodPrepTypeIcon(food);

        const content = (
            <div className='detail-content'>

                <ScrollElement name="overview">

                    <Header as='h2'>
                        <div style={{ fontSize: '1.1em' }}> ${food.price} · {food.header}</div></Header>
                    <div style={{ display: 'inline-block', verticalAlign: 'middle', color: '#4e4e4e', marginTop: '10px', fontSize: '1.1em' }}>
                        {food.availability} available · by
                        <ScrollLink className="author-link" to="cook"
                            spy={true} smooth={true} container={document}
                            offset={-85} duration={500}>
                            {supplier.name}
                        </ScrollLink>
                    </div>
                    <div style={{ clear: 'both' }}></div>
                    <div style={{ marginTop: '20px' }}>

                        <Icon name={foodPrepIcon} /> {food.prep}
                    </div>

                    <Header as='h3' className='food-detail-header'>The Food</Header>
                    <ShowMore>
                        <div className='user-text'>{food.description}</div>
                    </ShowMore>
                    <Divider section />

                    <Header as='h3' className='food-detail-header'>Ingredients</Header>
                    <div>{food.meta}</div>

                    <Divider section />

                    <Header as='h3' className='food-detail-header'>Allergy Information</Header>
                    <div className='user-text'><strong>Dishes may contain one or more of the following allergens: </strong> {food.allergy}.</div>

                    <div style={{ marginTop: '15px' }}>For any questions regarding allergens or other specific contents, please contact your neighbourhood cook directly. </div>

                    <Divider section />

                    <Header as='h3' className='food-detail-header'>Additional Cooking Instructions</Header>
                    <ShowMore>
                        <div className='user-text'>
                            {food.instruction}
                        </div>
                        <div style={{ marginTop: '15px' }}>{prep}</div>
                    </ShowMore>
                    <Divider section />

                    <Header as='h3' className='food-detail-header'>Bite Sizes</Header>
                    <div><strong>{food.unit} </strong> per order.  Feeds approximately {food.feed} people. </div>

                    <Divider section />

                    <Header as='h3' className='food-detail-header'>Special Features</Header>

                    <div>{food.feat}</div>

                    <Divider section />
                </ScrollElement>

                <ScrollElement name="reviews">
                    <Header as='h2'>
                        <div style={{ display: 'flex', marginTop: '2px', marginBottom: '10px' }}>
                            {food.ratingCount} Reviews
                                    <Rating disabled={true} maxRating={5} rating={food.rating} size='huge'
                                style={{ marginTop: '4px', marginLeft: '14px' }} />
                        </div>
                    </Header>

                    <Divider section />

                    <Grid columns={2} className='rating-grid' stackable>
                        <Grid.Row>
                            <Grid.Column className='detail-rating'>
                                <span className='detail-rating-label'>Accuracy</span>
                                <Rating className='detail-rating-stars' disabled={true} maxRating={5} rating={food.rating} />
                            </Grid.Column>
                            <Grid.Column className='detail-rating'>
                                <span className='detail-rating-label'>Quality</span>
                                <Rating className='detail-rating-stars' disabled={true} maxRating={5} rating={food.rating} />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column className='detail-rating'>
                                <span className='detail-rating-label'>Communication</span>
                                <Rating className='detail-rating-stars' disabled={true} maxRating={5} rating={food.rating} />
                            </Grid.Column>
                            <Grid.Column className='detail-rating'>
                                <span className='detail-rating-label'>Taste</span>
                                <Rating className='detail-rating-stars' disabled={true} maxRating={5} rating={food.rating} />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column className='detail-rating'>
                                <span className='detail-rating-label'>Freshness</span>
                                <Rating className='detail-rating-stars' disabled={true} maxRating={5} rating={food.rating} />
                            </Grid.Column>
                            <Grid.Column className='detail-rating'>
                                <span className='detail-rating-label'>Value</span>
                                <Rating className='detail-rating-stars' disabled={true} maxRating={5} rating={food.rating} />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Divider section />
                    {reviews}

                </ScrollElement>
                <ScrollElement name="cook">
                    <Header as='h2'>Meet {supplier.name}</Header>
                    <div style={{ float: 'left', color: '#60b0f4', fontWeight: 'bold', fontSize: '1em' }}>
                        {supplier.city}  ·<span style={{ color: '#0fb5c3' }}> Joined in {supplier.join}</span>
                    </div>
                    <div style={{ clear: 'both' }}></div>
                    <div style={{ marginTop: '15px' }}>{supplier.info}</div>
                    <div style={{ marginTop: '15px' }}> Languages: <strong> {supplier.lang}</strong></div>
                    <div style={{ marginTop: '15px' }}><Image size='small' shape='circular' src={supplier.image} /></div>
                </ScrollElement>
                <Divider section />

                <div className='report-listing-mobile'>
                    {/* style={{ color: '#5e5d5d' }} */}
                    <Modal dimmer='inverted' size='mini' trigger={<Button basic><Icon name='flag outline' /> Report this listing
                                    </Button>} closeIcon>
                        <Header icon='lock' content='Do you want to anonymously report this listing?' />
                        <Modal.Content>
                            <p>Please choose one of the following reasons. This won't be shared with the cook. <a href='url'>Learn more</a></p>
                        </Modal.Content>

                        <Modal.Actions>
                            <div className='report-listing-item'>
                                <Button fluid >
                                    This shouldn’t be on {Constants.AppName}.
                                                </Button>
                                <div>
                                    <Button fluid >
                                        I think I got sick from this food.
                                    </Button>
                                </div>
                                <div>
                                    <Button fluid >
                                        This is not a real food product.
                                    </Button>
                                </div>
                                <div>
                                    <Button fluid >
                                        It's offensive or scam.
                                    </Button>
                                </div>
                                <div style={{ marginBottom: '10px' }}>
                                    <Button fluid >
                                        It's something else.
                                    </Button>
                                </div>
                            </div>
                        </Modal.Actions>
                    </Modal>
                    <Divider section />
                </div>

            </div>
        );

        let imageElement;
        if (food.images && food.images.length > 1) {
            const images = food.images.map((current, index) =>
                <Image key={index} className='food-image' src={current} />
            );
            imageElement =
                <Carousel dragging={true} cellSpacing={15} edgeEasing="linear">
                    {images}
                </Carousel>
        }
        else {
            imageElement =
                <Image className='food-image' src={food.image} />
        }

        return (
            <div>
                <AppHeader />
                <div>
                    {imageElement}

                    <div className='detail-head-main'>
                        <div className="flex-container">
                            <div className="flex-item-main">
                                <ScrollLink activeClass="content-link-active" className='content-link' to="overview"
                                    spy={true} smooth={true} container={document}
                                    offset={-85} duration={500}>
                                    Overview
                                </ScrollLink>

                                <ScrollLink activeClass="content-link-active" className='content-link' to="reviews"
                                    spy={true} smooth={true} container={document}
                                    offset={-85} duration={500}>
                                    Reviews
                                </ScrollLink>

                                <ScrollLink activeClass="content-link-active" className='content-link' to="cook"
                                    spy={true} smooth={true} container={document}
                                    offset={-85} duration={500}>
                                    The Cook
                                </ScrollLink>
                            </div>
                            <div className="flex-item-right">
                            </div>
                            <div className='detail-head-right'>
                            </div>
                        </div>
                    </div>
                    <div className="flex-container">
                        <div className="flex-item-main">
                            {content}
                        </div>
                        <div className="flex-item-right">
                            <div className='detail-head-right'>
                                <Card>
                                    <Card.Content>
                                        <Card.Header className='OrderHeader'>
                                            <div style={{ float: 'left' }}>${food.price} CAD</div>
                                            <div style={{ clear: 'left' }}></div>
                                            <div style={{ display: 'flex', marginTop: '2px', marginBottom: '10px' }}>
                                                <Rating disabled={true} maxRating={5} rating={food.rating} size='small'
                                                    style={{ marginTop: '4px', marginLeft: '-2px' }} />
                                                <div style={{ fontSize: 'small', color: 'black' }}>{food.ratingCount}</div>
                                            </div>
                                        </Card.Header>
                                        <Divider section />

                                        <RouterLink to={'/foods/' + this.getFoodItemId() + '/order'}>
                                            <Button animated='fade' fluid color='teal' className='detail-desktop-button'>
                                                <Button.Content visible>
                                                    Order Now
                                            </Button.Content>
                                                <Button.Content hidden>
                                                    ${food.price} CAD
                                                </Button.Content>
                                            </Button>
                                        </RouterLink>

                                        <div style={{ textAlign: 'center', marginTop: '10px', color: 'gray' }}>You won't be charged yet</div>
                                    </Card.Content>
                                </Card>
                                <div style={{ textAlign: 'center', color: '#5e5d5d' }}>
                                    {/* style={{ color: '#5e5d5d' }} */}

                                    <Modal dimmer='inverted' size='mini' trigger={<Button basic><Icon name='flag outline' /> Report this listing
                                    </Button>} closeIcon>
                                        <Header icon='lock' content='Do you want to anonymously report this listing?' />
                                        <Modal.Content>
                                            <p>Please choose one of the following reasons. This won't be shared with the cook. <a href='url'>Learn more</a></p>
                                        </Modal.Content>

                                        <Modal.Actions>
                                            <div className='report-listing-item'>
                                                <Button>
                                                    This shouldn’t be on {Constants.AppName}.
                                                </Button>
                                                <Popup
                                                    trigger={<Icon size='large' name='question circle outline' />}
                                                    content='This contains false/misleading information or may be a fake listing.'
                                                    on={['click', 'hover']}
                                                    hideOnScroll />
                                                <div>
                                                    <Button >
                                                        I think I got sick from this food.
                                                </Button>
                                                    <Popup
                                                        trigger={<Icon size='large' name='question circle outline' />}
                                                        content='This may have unlisted allergens or be unsafe to eat. *Call 9-1-1 if you feel your life may be in danger.'
                                                        on={['click', 'hover']}
                                                        hideOnScroll />
                                                </div>
                                                <div>
                                                    <Button >
                                                        This is not a food product.
                                                </Button>
                                                    <Popup
                                                        trigger={<Icon size='large' name='question circle outline' />}
                                                        content='This is promoting a service, and not an actual product.'
                                                        on={['click', 'hover']}
                                                        hideOnScroll />
                                                </div>
                                                <div>
                                                    <Button >
                                                        Inappropriate content or spam.
                                                </Button>
                                                    <Popup
                                                        trigger={<Icon size='large' name='question circle outline' />}
                                                        content='The description of this listing contain violent, graphic, promotional, or other offensive content.'
                                                        on={['click', 'hover']}
                                                        hideOnScroll />
                                                </div>
                                                <div>
                                                    <Button >
                                                        Inappropriate or deceptive photo.
                                                </Button>
                                                    <Popup
                                                        trigger={<Icon size='large' name='question circle outline' />}
                                                        content='Photos doesn’t match description or it contains violent, graphic, promotional or other offensive content.'
                                                        on={['click', 'hover']}
                                                        hideOnScroll />
                                                </div>
                                            </div>
                                        </Modal.Actions>
                                    </Modal>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='detail-footer'>
                    <RouterLink to={'/foods/' + this.getFoodItemId() + '/order'}>
                        <Button fluid color='teal' className='detail-footer-button'>Order Now</Button>
                    </RouterLink>
                    <div className='detail-footer-text'>You won't be charged yet</div>
                </div>
            </div>
        )
    }
}