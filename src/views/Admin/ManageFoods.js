import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { Button, List, Image, Modal, Icon, Header, Divider, Input, Message, Dropdown } from 'semantic-ui-react'
import { Actions, Selectors } from '../../store/admin/foodManager'
import './ManageFoods.css'
import Url from '../../services/Url'
import ErrorCodes from '../../services/ErrorCodes'
import AppHeader from '../../components/AppHeader'
import LoadingIcon from '../../components/LoadingIcon'

class ManageFoods extends React.Component {

    componentWillMount() {
        const { foods, actions } = this.props;
        if (!foods) {
            actions.getFoods();
        }
    }

    handleToastDismiss = () => {
        this.props.actions.clearResult();
    }

    handleAddFood = () => {
        this.props.actions.openAddFoodModal();
    }

    render() {
        const { isLoadingFoods, foods, result } = this.props;

        return (
            <div className='managefoods' >
                <AppHeader fixed />
                {isLoadingFoods &&
                    <LoadingIcon size='large' />
                }
                <Divider hidden />
                <div className='managefoods-indent'>
                    <div className='managefoods-header'>
                        <span>Edit Foods</span>
                        <Button floated='right' content='Add food' icon='plus circle' labelPosition='right' onClick={this.handleAddFood} />
                    </div>
                    <Toast result={result}
                        successMessage='Food deleted successfully'
                        errorHeader='Error deleting food'
                        onDismiss={this.handleToastDismiss}
                    />
                    <AddFoodModal />
                    <Divider />
                    <List divided verticalAlign='middle'>
                        {foods && foods.map(food => (
                            <FoodListItem key={food.food_id} food={food} />
                        ))
                        }
                    </List>
                </div>
            </div>
        );
    }

    static mapStateToProps = (state) => {
        return {
            isLoadingFoods: Selectors.isLoadingFoods(state),
            foods: Selectors.foods(state),
            getFoodsResult: Selectors.getFoodsResult(state),
            result: Selectors.result(state),
        };
    };

    static mapDispatchToProps = (dispatch) => {
        return { actions: bindActionCreators(Actions, dispatch) };
    };

    static propTypes = {
        isLoadingFoods: PropTypes.bool,
        result: PropTypes.shape({
            code: PropTypes.string.isRequired,
            message: PropTypes.string
        }),

        actions: PropTypes.shape({
            getFoods: PropTypes.func.isRequired,
            clearResult: PropTypes.func.isRequired,
        }).isRequired
    }
}

export default withRouter(connect(ManageFoods.mapStateToProps, ManageFoods.mapDispatchToProps)(ManageFoods));

class AddFoodModalComponent extends React.Component {

    handleAdd = () => {
        this.props.actions.addFood(this.props.addFoodCookId);
    }

    handleClose = () => {
        if (this.props.isAddingFood)
            return;

        this.props.actions.closeAddFoodModal();
    }

    handleUserDropdownChange = (event, data) => {
        this.props.actions.addFoodModalSelectCook(data.value);
    }

    handleUserDropdownSelection = (event, data) => {
        this.props.actions.addFoodModalSelectCook(data.value);
    }

    render() {
        const { isAddFoodModalOpen, cookOptions, addFoodCookId, isAddingFood } = this.props;
        if (!cookOptions)
            return null;

        return (
            <Modal className='managefoods-add-modal' open={isAddFoodModalOpen} onClose={this.handleClose}>
                <Modal.Header><Icon name='plus circle' color='purple' />Add New Food</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Header>Select Cook</Header>
                        <Dropdown placeholder='Who is the cook?'
                            fluid search selection
                            disabled={isAddingFood}
                            options={cookOptions}
                            value={addFoodCookId}
                            onChange={this.handleUserDropdownSelection}
                            onBlur={this.handleUserDropdownSelection} />
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button floated='left' basic onClick={this.handleClose}>Cancel</Button>
                    <Button color='purple' disabled={!addFoodCookId} loading={isAddingFood} onClick={this.handleAdd}>Add</Button>
                </Modal.Actions>
            </Modal>
        );
    }

    static mapStateToProps = (state) => {
        return {
            isAddFoodModalOpen: Selectors.isAddFoodModalOpen(state),
            cookOptions: Selectors.cookOptions(state),
            addFoodCookId: Selectors.addFoodCookId(state),
            isAddingFood: Selectors.isAddingFood(state)
        };
    };

    static mapDispatchToProps = (dispatch) => {
        return { actions: bindActionCreators(Actions, dispatch) };
    };
}

const AddFoodModal = connect(AddFoodModalComponent.mapStateToProps, AddFoodModalComponent.mapDispatchToProps)(AddFoodModalComponent);

class Toast extends React.Component {

    style = {
        cursor: 'pointer'
    }

    render() {
        const { result, onDismiss, successHeader, successMessage, errorMessage, errorHeader } = this.props;
        if (!result)
            return null;

        if (result.code === ErrorCodes.ERROR) {
            return (<Message error style={this.style} header={errorHeader} content={errorMessage || result.message} onClick={onDismiss} />);
        }

        if (result.code === ErrorCodes.SUCCESS) {
            return (<Message success style={this.style} header={successHeader} content={successMessage || result.message} onClick={onDismiss} />);
        }

        return null;
    }
}

class FoodListItemComponent extends React.Component {

    handleEditClick = () => {
        this.props.history.push(Url.admin.manageFood(this.props.food.food_id));
    }

    handleDeleteClick = () => {
        this.props.actions.openDeleteFoodModal(this.props.food.food_id);
    }

    render() {
        const { food } = this.props;

        return (
            <List.Item>
                <List.Content floated='right'>
                    <div className='managefoods-buttons'>
                        <Button onClick={this.handleEditClick}><Icon name='edit outline' />Edit</Button>
                        <Button onClick={this.handleDeleteClick}><Icon name='trash alternate outline' />Delete</Button>
                        <DeleteFoodModal food={food} />
                    </div>
                </List.Content>
                <div className='managefoods-fooditem' onClick={this.handleEditClick}>
                    <div id='managefoods-image'>
                        <Image floated='left' verticalAlign='middle' src={food.imageUrls[0]} rounded />
                    </div>
                    {food.hidden &&
                        <div className='managefoods-hidden'>HIDDEN</div>
                    }
                    <div className='managefoods-title'>{food.title}</div>
                    {food.cook &&
                        <div>by {food.cook_name}</div>
                    }
                </div>
            </List.Item>
        );
    }

    static mapDispatchToProps = (dispatch) => {
        return { actions: bindActionCreators(Actions, dispatch) };
    };
}

const FoodListItem = withRouter(connect(null, FoodListItemComponent.mapDispatchToProps)(FoodListItemComponent));

class DeleteFoodModalComponent extends React.Component {

    handleConfirmTextChange = (e, data) => {
        this.props.actions.changeDeleteFoodConfirmText(data.value);
    }

    handleDelete = () => {
        const { deletingFoodId, food } = this.props;
        const isDeleting = food.food_id === deletingFoodId;
        if (isDeleting)
            return;

        this.props.actions.deleteFood(food.food_id);
    }

    handleClose = () => {
        const { deletingFoodId, food } = this.props;
        const isDeleting = food.food_id === deletingFoodId;
        if (isDeleting)
            return;

        this.props.actions.closeDeleteFoodModal();
    }

    render() {
        const { food, deleteModalFoodId, deletingFoodId, deleteFoodConfirmText } = this.props;

        const open = (food.food_id === deleteModalFoodId);
        const isDeleting = (food.food_id === deletingFoodId);
        const allowDelete = (deleteFoodConfirmText === 'DELETE');

        return (
            <Modal className='managefoods-delete-modal' open={open} onClose={this.handleClose}>
                <Modal.Header><Icon name='trash alternate outline' />Are you sure?</Modal.Header>
                <Modal.Content>
                    <div className='managefoods-title'>You are about to delete this food listing.</div>
                </Modal.Content>
                <Modal.Content image>
                    <Image wrapped src={food.imageUrls[0]} />
                    <Modal.Description>
                        <Header>{food.title}</Header>
                        <div>Type DELETE to confirm</div>
                        <Input placeholder='DELETE' disabled={isDeleting} value={deleteFoodConfirmText} onChange={this.handleConfirmTextChange} />
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button floated='left' basic onClick={this.handleClose}>Cancel</Button>
                    <Button disabled={!allowDelete} loading={isDeleting} onClick={this.handleDelete}>Delete</Button>
                </Modal.Actions>
            </Modal>
        );
    }

    static mapStateToProps = (state) => {
        return {
            deletingFoodId: Selectors.deletingFoodId(state),
            deleteModalFoodId: Selectors.deleteModalFoodId(state),
            deleteFoodConfirmText: Selectors.deleteFoodConfirmText(state)
        };
    };

    static mapDispatchToProps = (dispatch) => {
        return { actions: bindActionCreators(Actions, dispatch) };
    };
}

const DeleteFoodModal = connect(DeleteFoodModalComponent.mapStateToProps, DeleteFoodModalComponent.mapDispatchToProps)(DeleteFoodModalComponent);