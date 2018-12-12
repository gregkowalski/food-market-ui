import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { Field, reduxForm, getFormSyncErrors, isValid, formValueSelector } from 'redux-form'
import PropTypes from 'prop-types'
import { Grid, Segment, Header, Image, Button, Message } from 'semantic-ui-react'
import { Actions, Selectors } from '../../store/admin/foodManager'
import './ManageFood.css'
import { ValidatedDropdown, ValidatedField, ValidatedTextArea, ValidatedCheckbox } from '../../components/Validation'
import {
    FoodPrepTypes, FoodPrepTypeLabels,
    FoodFeatures, FoodFeatureLabels,
    FoodAllergies, FoodAllergyLabels,
} from '../../Enums';
import AppHeader from '../../components/AppHeader'
import LoadingIcon from '../../components/LoadingIcon'
import { all_boundaries, getRegionId } from '../../components/Map/AllRegions'
import ErrorCodes from '../../services/ErrorCodes'
import Util from '../../services/Util'

import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

class ManageFood extends React.Component {

    componentWillMount() {
        const { foods, actions } = this.props;
        if (!foods) {
            actions.getFoods();
        }
    }

    render() {
        const { isLoadingFoods, foods, match } = this.props;

        let foodEditor;
        if (foods) {
            foodEditor = <FoodEditor food_id={match.params.food_id} />
        }

        return (
            <div>
                <AppHeader />
                <div className='managefood'>
                    <h2>Food Editor</h2>
                    {isLoadingFoods &&
                        <LoadingIcon size='large' />
                    }
                    {foodEditor}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoadingFoods: Selectors.isLoadingFoods(state),
        getFoodsResult: Selectors.getFoodsResult(state),
        foods: Selectors.foods(state),
        food: Selectors.food(state),
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

    if (values.pickup) {
        if (!values.position.lat) {
            if (!errors.position) {
                errors.position = {};
            }
            errors.position.lat = { header: 'Pickup location latitude is required', message: 'Please provide pickup location latitude' };
        }
        if (!values.position.lng) {
            if (!errors.position) {
                errors.position = {};
            }
            errors.position.lng = { header: 'Pickup location longitude is required', message: 'Please provide pickup location longitude' };
        }
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

    handleUploadImage = (imageUrl, imageBlob) => {
        const { change, imageUrls } = this.props;

        const updateFormValue = (assetUrl) => {
            const newImageUrls = [...imageUrls, assetUrl];
            change('imageUrls', newImageUrls);
        }

        this.props.actions.uploadImage(imageUrl, imageBlob, updateFormValue);
    }

    handleDeleteImage = () => {
        const { change, imageUrls, selectedImageUrl } = this.props;
        if (!selectedImageUrl)
            return;

        const updateFormValue = (assetUrl) => {
            const newImageUrls = [...imageUrls];
            Util.remove(newImageUrls, assetUrl);
            change('imageUrls', newImageUrls);
        }

        this.props.actions.deleteImage(selectedImageUrl, updateFormValue);
    }

    handleSelectImage = (imageUrl) => {
        this.props.actions.selectImage(imageUrl);
    }

    handleAddIngredientItem = (e, { value }) => {
        this.props.actions.addIngredientOption(value);
    }

    handleSaveClick = (food) => {
        this.props.actions.saveFood(food);
    }

    handleMessageClick = () => {
        this.props.actions.clearSaveFoodResult();
    }

    parseFloat = (val) => {
        return isNaN(parseFloat(val)) ? null : parseFloat(val);
    }

    render() {
        const { food, ingredientOptions, saveFoodResult } = this.props;
        if (!food) {
            return null;
        }

        const { handleSubmit, pristine, formSyncErrors, formIsValid, isSavingFood } = this.props;
        const errors = [];
        for (const key in formSyncErrors) {
            errors.push(formSyncErrors[key]);
        }

        const { pickup, delivery, imageUrls, selectedImageUrl, isUploadingImage, isDeletingImage } = this.props;
        return (
            <div>
                <div className='managefood-save'>
                    <Button color='purple'
                        disabled={pristine || !formIsValid}
                        loading={isSavingFood}
                        onClick={handleSubmit(this.handleSaveClick)}>Save</Button>

                    {saveFoodResult && saveFoodResult.code === ErrorCodes.ERROR &&
                        <Message error header='Error saving food' content={saveFoodResult.message} onClick={this.handleMessageClick} />
                    }
                    {saveFoodResult && saveFoodResult.code === ErrorCodes.SUCCESS &&
                        <Message success content='Food saved successfully' onClick={this.handleMessageClick} />
                    }
                </div>
                <div>
                    {!formIsValid && errors.map((error, key) => (
                        <Message key={key} error header={error.header} content={error.message} />
                    ))}
                </div>
                <Header block attached='top' as='h3'>Main</Header>
                <Segment attached padded>
                    <Grid stackable>
                        <Grid.Row>
                            <Grid.Column width={2}>
                                <label>Cook</label>
                            </Grid.Column>
                            <Grid.Column width={14}>
                                <Field disabled name='cook_name' autoComplete='cook_name' component={ValidatedField} type='text' />
                            </Grid.Column>
                        </Grid.Row>
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
                                <label>Price $({food.price_currency})</label>
                            </Grid.Column>
                            <Grid.Column width={14}>
                                <Field name='price' autoComplete='price' component={ValidatedField}
                                    type='number' placeholder='Enter food price' parse={this.parseFloat} />
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
                        <Grid.Row>
                            <Grid.Column width={2}>
                                <label>Hidden</label>
                            </Grid.Column>
                            <Grid.Column width={14}>
                                <div className='managefood-checkbox'>
                                    <Field id='hidden' name='hidden' component={ValidatedCheckbox} label='Hide this food from search' />
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
                <Header block attached='top' as='h3'>Pickup and Delivery</Header>
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
                        {pickup &&
                            <Grid.Row>
                                <Grid.Column width={2}>
                                    <label>Pickup Lat</label>
                                </Grid.Column>
                                <Grid.Column width={14}>
                                    <Field name='position.lat' autoComplete='position.lat' component={ValidatedField}
                                        type='number' placeholder='Enter position latitude' parse={this.parseFloat} />
                                </Grid.Column>
                                <Grid.Column width={2}>
                                    <label>Pickup Lng</label>
                                </Grid.Column>
                                <Grid.Column width={14}>
                                    <Field name='position.lng' autoComplete='position.lng' component={ValidatedField}
                                        type='number' placeholder='Enter position longitude' parse={this.parseFloat} />
                                </Grid.Column>
                            </Grid.Row>
                        }
                        {delivery &&
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
                        }
                    </Grid>
                </Segment>
                <Header block attached='top' as='h3'>Food Details</Header>
                <Segment attached padded>
                    <Grid stackable>
                        <Grid.Row>
                            <Grid.Column width={2}>
                                <label>Images</label>
                            </Grid.Column>
                            <Grid.Column width={14}>
                                <ImageManager
                                    imageUrls={imageUrls}
                                    selectedImageUrl={selectedImageUrl}
                                    isUploadingImage={isUploadingImage}
                                    isDeletingImage={isDeletingImage}
                                    onUploadImage={this.handleUploadImage}
                                    onDeleteImage={this.handleDeleteImage}
                                    onSelectImage={this.handleSelectImage}
                                />
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

const reduxFormName = 'manageFood';
const selector = formValueSelector(reduxFormName)
const foodEditorMapStateToProps = (state) => {
    return {
        food: Selectors.food(state),
        initialValues: Selectors.food(state),
        ingredientOptions: Selectors.ingredientOptions(state),
        selectedImageUrl: Selectors.selectedImageUrl(state),
        isSavingFood: Selectors.isSavingFood(state),
        saveFoodResult: Selectors.saveFoodResult(state),

        isUploadingImage: Selectors.isUploadingImage(state),
        isDeletingImage: Selectors.isDeletingImage(state),

        formSyncErrors: getFormSyncErrors(reduxFormName)(state),
        formIsValid: isValid(reduxFormName)(state),

        pickup: selector(state, 'pickup'),
        delivery: selector(state, 'delivery'),
        imageUrls: selector(state, 'imageUrls'),
    };
};

const foodEditorMapDispatchToProps = (dispatch) => {
    return { actions: bindActionCreators(Actions, dispatch) };
};
const foodEditorForm = reduxForm({ form: reduxFormName, validate, enableReinitialize: true })(FoodEditorForm);
const FoodEditor = connect(foodEditorMapStateToProps, foodEditorMapDispatchToProps)(foodEditorForm);

class ImageManagerComponent extends React.Component {

    onSelectFile = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                this.props.actions.loadImageFile(reader.result);
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    onImageLoaded = (image, pixelCrop) => {
        this.imageRef = image;
    };

    onCropComplete = async (crop, pixelCrop) => {
        const croppedImageUrl = await this.getCroppedImg(
            this.imageRef,
            pixelCrop,
            "newFile.jpeg"
        );
        this.props.actions.changeCroppedImageUrl(croppedImageUrl);
    };

    onCropChange = crop => {
        this.props.actions.changeImageCrop(crop);
    };

    getCroppedImg(image, pixelCrop, fileName) {
        const ImageWidth = 600;
        const ImageHeight = 400;

        const canvas = document.createElement("canvas");
        // canvas.width = pixelCrop.width;
        // canvas.height = pixelCrop.height;
        canvas.width = ImageWidth;
        canvas.height = ImageHeight;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            ImageWidth,
            ImageHeight
            // pixelCrop.width,
            // pixelCrop.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                blob.name = fileName;
                window.URL.revokeObjectURL(this.fileUrl);
                this.fileUrl = window.URL.createObjectURL(blob);
                this.fileBlob = blob;
                resolve(this.fileUrl);
            }, "image/jpeg");
        });
    }

    uploadImage = () => {
        this.props.onUploadImage(this.fileUrl, this.fileBlob);
    }

    deleteImage = () => {
        this.props.onDeleteImage();
    }

    selectImage = (imageUrl) => {
        this.props.onSelectImage(imageUrl);
    }

    render() {
        const { imageUrls, selectedImageUrl, isUploadingImage, isDeletingImage } = this.props;
        const { imageSource, imageCrop, croppedImageUrl } = this.props;

        return (
            <div className='imagemanager'>
                <div className='imagemanager-images'>
                    {imageUrls && imageUrls.map((imageUrl, index) => (
                        <Image key={index} src={imageUrl}
                            onClick={() => this.selectImage(imageUrl)}
                            style={{
                                border: (imageUrl === selectedImageUrl ? '2px solid blue' : '2px solid transparent')
                            }} />
                    ))}
                </div>
                <div>
                    <Button color='purple' onClick={this.uploadImage} disabled={!croppedImageUrl} loading={isUploadingImage}>Upload</Button>
                    <Button color='purple' onClick={this.deleteImage} disabled={!selectedImageUrl} loading={isDeletingImage}>Delete</Button>
                </div>
                <input type="file" onChange={this.onSelectFile} />
                <div>
                    {imageSource &&
                        <ReactCrop
                            src={imageSource}
                            crop={imageCrop}
                            onImageLoaded={this.onImageLoaded}
                            onComplete={this.onCropComplete}
                            onChange={this.onCropChange}
                        />
                    }
                    {croppedImageUrl &&
                        <img id='imagemanager-croppedimg' alt="Crop" src={croppedImageUrl} />
                    }
                </div>
            </div>
        );
    }
}

const mapImageManagerStateToProps = (state) => {
    return {
        isLoadingFoods: Selectors.isLoadingFoods(state),
        getFoodsResult: Selectors.getFoodsResult(state),
        foods: Selectors.foods(state),
        food: Selectors.food(state),
        imageSource: Selectors.imageSource(state),
        imageCrop: Selectors.imageCrop(state),
        croppedImageUrl: Selectors.croppedImageUrl(state),
    };
};

const mapImageManagerDispatchToProps = (dispatch) => {
    return { actions: bindActionCreators(Actions, dispatch) };
};

ImageManagerComponent.propTypes = {
    isLoadingFoods: PropTypes.bool,
    getFoodsResult: PropTypes.shape({
        code: PropTypes.string.isRequired,
        message: PropTypes.string
    }),

    actions: PropTypes.shape({
        getFoods: PropTypes.func.isRequired,
    }).isRequired
}

const ImageManager = connect(mapImageManagerStateToProps, mapImageManagerDispatchToProps)(ImageManagerComponent);