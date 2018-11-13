import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { Field, reduxForm } from 'redux-form'
import PropTypes from 'prop-types'
import { Grid, Input, Checkbox, TextArea, Label } from 'semantic-ui-react'
import { Actions, Selectors } from '../../store/admin/foodManager'
import './ManageFood.css'
import { ValidatedAutocomplete, ValidatedDropdown, ValidatedField, ValidatedTextArea } from '../../components/Validation'
import { FoodPrepType, FoodPrepTypeLabels } from '../../Enums';
import AppHeader from '../../components/AppHeader'
import LoadingIcon from '../../components/LoadingIcon';

class ManageFood extends React.Component {

    componentWillMount() {
        const { foods, actions } = this.props;
        if (!foods) {
            actions.getFoods()
                .then(() => {
                    const cook_ids = this.props.foods.map(x => x.user_id);
                    // return actions.getCooks(cook_ids);
                });
        }
    }

    render() {
        const { isLoadingFoods, foods, match } = this.props;

        let foodEditor;
        if (foods) {
            const food = foods.find(x => x.food_id === match.params.food_id);
            if (food) {
                foodEditor = <FoodEditor food={food} />
            }
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

const foodPrepTypeOptions = [
    {
        key: FoodPrepType.frozen,
        value: FoodPrepType.frozen,
        text: FoodPrepTypeLabels.frozen,
    },
    {
        key: FoodPrepType.ready,
        value: FoodPrepType.ready,
        text: FoodPrepTypeLabels.ready,
    },
    {
        key: FoodPrepType.ingredient,
        value: FoodPrepType.ingredient,
        text: FoodPrepTypeLabels.ingredient,
    },
    {
        key: FoodPrepType.uncooked,
        value: FoodPrepType.uncooked,
        text: FoodPrepTypeLabels.uncooked,
    },
]


const validate = (values) => {
    const errors = {}
    if (!values.name) {
        errors.name = { header: 'Name is required', message: 'Please enter your name' };
    }

    if (!values.username) {
        errors.username = { header: 'Username is required', message: 'Please enter your username' };
    }

    if (!values.info) {
        errors.info = { header: 'Your bio is required', message: 'Please tell us about yourself' };
    }

    return errors;
}

class FoodEditorForm extends React.Component {

    componentWillMount() {
        const { food, actions } = this.props;
        actions.editFood(food);
    }

    render() {
        const { food } = this.props;

        return (
            <Grid>
                <Grid.Row>
                    <Input label='Title' value={food.title} />
                </Grid.Row>
                <Grid.Row>
                    <Input label='Cook' value={food.user_id} />
                </Grid.Row>
                <Grid.Row>
                    <Input label='Price' value={food.price} />
                </Grid.Row>
                <Grid.Row>
                    <Input label='Currency' value={food.price_currency} />
                </Grid.Row>
                <Grid.Row>
                    <Checkbox label='Delivery' checked={food.delivery} />
                </Grid.Row>
                <Grid.Row>
                    <Checkbox label='Pickup' checked={food.pickup} />
                </Grid.Row>
                <Grid.Row>
                    <Input label='Images' value={food.imageUrls.join(',')} />
                </Grid.Row>
                <Grid.Row>
                    <Input label='Ingredients' value={food.ingredients.join(',')} />
                </Grid.Row>
                <Grid.Row>
                    <Label>Category</Label>
                    <Field name='states' autoComplete='states' placeholder="What is the form of this food?"
                        options={foodPrepTypeOptions} component={ValidatedDropdown} />
                </Grid.Row>
                <Grid.Row>
                    <Input label='Features' value={food.features.join(',')} />
                </Grid.Row>
                <Grid.Row>
                    <Input label='Allergies' value={food.allergies.join(',')} />
                </Grid.Row>
                <Grid.Row>
                    <Input label='Feed' value={food.feed} />
                </Grid.Row>
                <Grid.Row>
                    <Input label='Unit' value={food.unit} />
                </Grid.Row>
                <Grid.Row>
                    <Input label='Position' value={food.position.lat + ' : ' + food.position.lng} />
                </Grid.Row>
                <Grid.Row>
                    <Input label='Delivery Regions' value={food.regions.join(',')} />
                </Grid.Row>
                <Grid.Row>
                    <div className='managefood-textarea'>
                        <Label attached='top left'>Long Description</Label>
                        <TextArea autoHeight rows={15} value={food.long_description} />
                    </div>
                </Grid.Row>
                <Grid.Row>
                    <div className='managefood-textarea'>
                        <Label attached='top left'>Short Description</Label>
                        <TextArea autoHeight rows={15} value={food.short_description} />
                    </div>
                </Grid.Row>
            </Grid>
        );
    }
}


const foodEditorMapStateToProps = (state) => {
    return {
        isLoadingFoods: Selectors.isLoadingFoods(state),
        foods: Selectors.foods(state),
        getFoodsResult: Selectors.getFoodsResult(state),
        initialValues: Selectors.food(state)
    };
};

const foodEditorMapDispatchToProps = (dispatch) => {
    return { actions: bindActionCreators(Actions, dispatch) };
};
const foodEditorForm = reduxForm({ form: 'manageFood', validate, enableReinitialize: true })(FoodEditorForm);
const FoodEditor = connect(foodEditorMapStateToProps, foodEditorMapDispatchToProps)(foodEditorForm);