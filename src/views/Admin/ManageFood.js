import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { Field, reduxForm, getFormSyncErrors, isValid } from 'redux-form'
import PropTypes from 'prop-types'
import { Grid, Input, Segment, Header, Image, Button, Message } from 'semantic-ui-react'
import { Actions, Selectors } from '../../store/admin/foodManager'
import './ManageFood.css'
import { ValidatedDropdown, ValidatedField, ValidatedTextArea, ValidatedCheckbox } from '../../components/Validation'
import {
    FoodPrepTypes, FoodPrepTypeLabels,
    FoodFeatures, FoodFeatureLabels,
    FoodAllergies, FoodAllergyLabels,
} from '../../Enums';
import AppHeader from '../../components/AppHeader'
import LoadingIcon from '../../components/LoadingIcon';
import { all_boundaries, getRegionId } from '../../components/Map/AllRegions';
import ErrorCodes from '../../services/ErrorCodes';
import Util from '../../services/Util'

class ManageFood extends React.Component {

    componentWillMount() {
        const { foods, actions } = this.props;
        if (!foods) {
            actions.getFoods()
                .then(() => {
                    const cook_ids = Util.distinct(this.props.foods.map(x => x.user_id));
                    return actions.getCooks(cook_ids);
                });
        }
    }

    render() {
        const { isLoadingFoods, foods, match } = this.props;

        let foodEditor;
        if (foods) {
            foodEditor = <FoodEditor food_id={match.params.food_id} />
        }

        return (
            <div className='managefood'>
                <AppHeader fixed />
                <h2>Food Editor</h2>
                {isLoadingFoods &&
                    <LoadingIcon size='large' />
                }
                {foodEditor}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoadingFoods: Selectors.isLoadingFoods(state),
        foods: Selectors.foods(state),
        food: Selectors.food(state),
        getFoodsResult: Selectors.getFoodsResult(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return { actions: bindActionCreators(Actions, dispatch) };
};

ManageFood.propTypes = {
    isLoadingFoods: PropTypes.bool,
    getFoodsResult: PropTypes.shape({
        code: PropTypes.string.isRequired,
        message: PropTypes.string
    }),

    actions: PropTypes.shape({
        getFoods: PropTypes.func.isRequired,
    }).isRequired
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ManageFood));


const createOptions = (keys, labels) => {
    const options = [];
    for (const key in keys) {
        const option = {
            key,
            value: key,
            text: labels[key]
        };
        options.push(option);
    }
    return options;
}

const foodPrepTypeOptions = createOptions(FoodPrepTypes, FoodPrepTypeLabels);
const featureOptions = createOptions(FoodFeatures, FoodFeatureLabels);
const allergyOptions = createOptions(FoodAllergies, FoodAllergyLabels);

let regionOptions;
if (!regionOptions) {
    regionOptions = all_boundaries.features.map(feature => {
        const id = getRegionId(feature);
        return { key: id, value: id, text: id };
    }).sort((a, b) => {
        if (a.key < b.key) { return -1; }
        if (a.key > b.key) { return 1; }
        return 0;
    });
}

const isEmpty = (array) => {
    return !array || array.length <= 0;
}

const validate = (values) => {
    const errors = {}
    if (!values.title) {
        errors.title = { header: 'Title is required', message: 'Please enter your food\'s title' };
    }

    if (!values.user_id) {
        errors.user_id = { header: 'Cook is required', message: 'Please select cook for this food' };
    }

    if (!values.price) {
        errors.price = { header: 'Price is required', message: 'Please enter the price' };
    }
    else if (values.price <= 0) {
        errors.price = { header: 'Price must be a positive number', message: 'Please a positive number' };
    }
    else if (values.price > 100) {
        errors.price = { header: 'Price must not be greater than $100', message: 'Price must not be greater than $100' };
    }

    if (!values.feed) {
        errors.feed = { header: 'Feed description is required', message: 'Please let your customers know how many people can be fed per portion' };
    }

    if (!values.feed) {
        errors.feed = { header: 'Feed description is required', message: 'Please let your customers know how many people can be fed per portion' };
    }

    if (!values.pickup && !values.delivery) {
        errors.delivery = { header: 'Pickup and/or delivery option must be selected', message: 'Please make the food available for pickup or delivery' };
    }

    if (values.delivery && isEmpty(values.regions)) {
        errors.regions = { header: 'Delivery regions are required', message: 'When the food is available for delivery, please select delivery regions' };
    }

    if (isEmpty(values.imageUrls)) {
        errors.imageUrls = { header: 'Food images are required', message: 'Please provide at least one image of the food' };
    }

    if (isEmpty(values.ingredients)) {
        errors.ingredients = { header: 'Food ingredients are required', message: 'Please enter the food ingredients' };
    }

    if (isEmpty(values.states)) {
        errors.states = { header: 'Food category is required', message: 'Please enter the food category' };
    }

    if (!values.short_description && !values.long_description) {
        errors.short_description = { header: 'Food description is required', message: 'Please let your customers know more about the food' };
    }

    return errors;
}

class FoodEditorForm extends React.Component {

    componentWillMount() {
        const { food_id, actions } = this.props;
        actions.editFood(food_id);
    }

    handleAddIngredientItem = (e, { value }) => {
        this.props.actions.addIngredientOption(value);
    }

    handleAddImageUrlItem = (e, { value }) => {
        this.props.actions.addImageUrlOption(value);
    }

    handleSaveClick = (food) => {
        this.props.actions.saveFood(food);
    }

    handleMessageClick = () => {
        this.props.actions.clearSaveFoodResult();
    }

    render() {
        const { food, ingredientOptions, imageUrlOptions, saveFoodResult, formSyncErrors, formIsValid } = this.props;
        if (!food) {
            return null;
        }

        const { handleSubmit, pristine, isSavingFood } = this.props;
        const errors = [];
        for (const key in formSyncErrors) {
            errors.push(formSyncErrors[key]);
        }

        return (
            <div>
                <div className='managefood-save'>
                    <Button color='purple' disabled={pristine || !formIsValid} loading={isSavingFood} onClick={handleSubmit(this.handleSaveClick)}>Save</Button>

                    {!formIsValid && errors.map(x => (
                        <Message error header={x.header} content={x.message} />
                    ))}

                    {saveFoodResult && saveFoodResult.code === ErrorCodes.ERROR &&
                        <Message error header='Error saving food' content={saveFoodResult.message} onClick={this.handleMessageClick} />
                    }
                    {saveFoodResult && saveFoodResult.code === ErrorCodes.SUCCESS &&
                        <Message success content='Food saved successfully' onClick={this.handleMessageClick} />
                    }
                </div>
                <Header block attached='top' as='h3'>Main</Header>
                <Segment attached padded>
                    <Grid stackable>
                        <Grid.Row>
                            <Grid.Column width={2}>
                                <label>Title</label>
                            </Grid.Column>
                            <Grid.Column width={14}>
                                <Field name='title' autoComplete='title' component={ValidatedField} type='text' placeholder='Enter food title' />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={2}>
                                <label>Cook</label>
                            </Grid.Column>
                            <Grid.Column width={14}>
                                <Field name='cook_name' autoComplete='cook_name' component={ValidatedField} type='text' placeholder='Enter cook id' />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={2}>
                                <label>Price $({food.price_currency})</label>
                            </Grid.Column>
                            <Grid.Column width={14}>
                                <Field name='price' autoComplete='price' component={ValidatedField}
                                    type='number' placeholder='Enter food price'
                                    parse={val => isNaN(parseFloat(val)) ? null : parseFloat(val)}
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={2}>
                                <label>Feed</label>
                            </Grid.Column>
                            <Grid.Column width={14}>
                                <Field name='feed' autoComplete='feed' component={ValidatedField} type='text' placeholder='Please enter how many people each portion can feed' />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={2}>
                                <label>Unit</label>
                            </Grid.Column>
                            <Grid.Column width={14}>
                                <Field name='unit' autoComplete='unit' component={ValidatedField} type='text' placeholder='Please enter how many people each portion can feed' />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
                <Header block attached='top'>Pickup and Delivery</Header>
                <Segment attached padded>
                    <Grid stackable>
                        <Grid.Row>
                            <Grid.Column width={2}>
                                <label>Pickup</label>
                            </Grid.Column>
                            <Grid.Column width={14}>
                                <div className='managefood-checkbox'>
                                    <Field id='pickup' name='pickup' component={ValidatedCheckbox} label='Pickup availability' />
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={2}>
                                <label>Delivery</label>
                            </Grid.Column>
                            <Grid.Column width={14}>
                                <div className='managefood-checkbox'>
                                    <Field id='delivery' name='delivery' component={ValidatedCheckbox} label='Delivery availability' />
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={2}>
                                <label>Location Lat</label>
                            </Grid.Column>
                            <Grid.Column width={14}>
                                <Input disabled value={food.position.lat} />
                            </Grid.Column>
                            <Grid.Column width={2}>
                                <label>Location Lng</label>
                            </Grid.Column>
                            <Grid.Column width={14}>
                                <Input disabled value={food.position.lng} />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={2}>
                                <label>Delivery Regions</label>
                            </Grid.Column>
                            <Grid.Column width={14}>
                                <Field name='regions' autoComplete='regions' placeholder="What are the delivery regions?"
                                    fluid multiple search selection
                                    options={regionOptions} component={ValidatedDropdown} />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
                <Header block attached='top'>Food Details</Header>
                <Segment attached padded>
                    <Grid stackable>
                        <Grid.Row>
                            <Grid.Column width={2}>
                                <label>Image URLs</label>
                            </Grid.Column>
                            <Grid.Column width={14}>
                                <Field name='imageUrls' autoComplete='imageUrls' component={ValidatedDropdown}
                                    placeholder="Enter image URLs for this food"
                                    fluid multiple search selection allowAdditions
                                    onAddItem={this.handleAddImageUrlItem}
                                    options={imageUrlOptions} />
                                <div className='managefood-images'>
                                    {food.imageUrls && food.imageUrls.map((imageUrl, index) => (
                                        <Image key={index} src={imageUrl} />
                                    ))}
                                </div>
                            </Grid.Column>

                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={2}>
                                <label>Ingredients</label>
                            </Grid.Column>
                            <Grid.Column width={14}>
                                <Field name='ingredients' autoComplete='ingredients' component={ValidatedDropdown}
                                    placeholder="What are this food's ingredients?"
                                    fluid multiple search selection allowAdditions
                                    onAddItem={this.handleAddIngredientItem}
                                    options={ingredientOptions} />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={2}>
                                <label>Category</label>
                            </Grid.Column>
                            <Grid.Column width={14}>
                                <Field name='states' autoComplete='states' placeholder="What is the form of this food?"
                                    fluid multiple search selection
                                    options={foodPrepTypeOptions} component={ValidatedDropdown} />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={2}>
                                <label>Features</label>
                            </Grid.Column>
                            <Grid.Column width={14}>
                                <Field name='features' autoComplete='features' placeholder="What are the features?"
                                    fluid multiple search selection
                                    options={featureOptions} component={ValidatedDropdown} />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={2}>
                                <label>Allergies</label>
                            </Grid.Column>
                            <Grid.Column width={14}>
                                <Field name='allergies' autoComplete='allergies' placeholder="What are the allergies?"
                                    fluid multiple search selection
                                    options={allergyOptions} component={ValidatedDropdown} />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={2}>
                                <label>Long Description</label>
                            </Grid.Column>
                            <Grid.Column width={14}>
                                <Field name='long_description' autoComplete='long_description' component={ValidatedTextArea}
                                    autoHeight type='text' placeholder='Please describe your food' />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={2}>
                                <label>Short Description</label>
                            </Grid.Column>
                            <Grid.Column width={14}>
                                <Field name='short_description' autoComplete='short_description' component={ValidatedTextArea}
                                    autoHeight type='text' placeholder='Please describe your food' />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </div >
        );
    }
}


const foodEditorMapStateToProps = (state) => {
    return {
        food: Selectors.food(state),
        initialValues: Selectors.food(state),
        ingredientOptions: Selectors.ingredientOptions(state),
        imageUrlOptions: Selectors.imageUrlOptions(state),
        isSavingFood: Selectors.isSavingFood(state),
        saveFoodResult: Selectors.saveFoodResult(state),

        formSyncErrors: getFormSyncErrors('manageFood')(state),
        formIsValid: isValid('manageFood')(state),
    };
};

const foodEditorMapDispatchToProps = (dispatch) => {
    return { actions: bindActionCreators(Actions, dispatch) };
};
const foodEditorForm = reduxForm({ form: 'manageFood', validate, enableReinitialize: true })(FoodEditorForm);
const FoodEditor = connect(foodEditorMapStateToProps, foodEditorMapDispatchToProps)(foodEditorForm);