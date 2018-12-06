import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { Button, List, Image, Modal, Icon, Header, Divider, Input, Message } from 'semantic-ui-react'
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

    handleEditFood = (food) => {
        this.props.history.push(Url.admin.manageFood(food.food_id));
    }

    handleClose = (food) => {
        console.log(food);
    }

    handleDeleteFood = (food) => {
        this.props.actions.deleteFood(food.food_id);
    }

    handleToastDismiss = () => {
        this.props.actions.clearDeleteFoodResult();
    }

    render() {
        const { isLoadingFoods, foods, deletingFoodId, deleteFoodResult } = this.props;

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
                        <Button floated='right' content='Add food' icon='plus circle' labelPosition='right' />
                    </div>
                    {deletingFoodId &&
                        <LoadingIcon text='Deleting...' size='big' />
                    }
                    <Toast result={deleteFoodResult}
                        successMessage='Food deleted successfully'
                        errorHeader='Error deleting food'
                        onDismiss={this.handleToastDismiss}
                    />
                    <Divider />
                    <List divided verticalAlign='middle'>
                        {foods && foods.map(food => (
                            <FoodListItem key={food.food_id}
                                isDeleting={food.food_id === deletingFoodId}
                                food={food}
                                onDelete={this.handleDeleteFood}
                                onEdit={this.handleEditFood}
                                onClose={this.handleClose} />
                        ))
                        }
                    </List>
                </div>
            </div >
        );
    }
}

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

const mapStateToProps = (state) => {
    return {
        isLoadingFoods: Selectors.isLoadingFoods(state),
        foods: Selectors.foods(state),
        getFoodsResult: Selectors.getFoodsResult(state),
        deletingFoodId: Selectors.deletingFoodId(state),
        deleteFoodResult: Selectors.deleteFoodResult(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return { actions: bindActionCreators(Actions, dispatch) };
};

ManageFoods.propTypes = {
    isLoadingFoods: PropTypes.bool,
    getFoodsResult: PropTypes.shape({
        code: PropTypes.string.isRequired,
        message: PropTypes.string
    }),

    actions: PropTypes.shape({
        getFoods: PropTypes.func.isRequired,
    }).isRequired
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ManageFoods));



class FoodListItemComponent extends React.Component {

    state = {}

    handleEditClick = () => {
        if (this.props.isDeleting)
            return;

        this.props.onEdit(this.props.food);
    }

    handleDeleteClick = () => {
        if (this.props.isDeleting)
            return;

        this.setState({ open: true });
    }

    handleDelete = () => {
        if (this.props.isDeleting)
            return;

        // this.setState({ open: false });
        this.props.onDelete(this.props.food);
    }

    handleClose = () => {
        this.setState({ open: false });
    }

    render() {
        const { food, deletingFoodId } = this.props;
        const { open } = this.state;

        const isDeleting = (food.food_id === deletingFoodId);
        console.log(`deletingFoodId=${deletingFoodId}`);

        return (
            <List.Item>
                <List.Content floated='right'>
                    <div className='managefoods-buttons'>
                        <Button onClick={this.handleEditClick}><Icon name='edit outline' />Edit</Button>
                        <Button onClick={this.handleDeleteClick}><Icon name='trash alternate outline' />Delete</Button>
                        <DeleteFoodModal food={food} isDeleting={isDeleting} onDelete={this.handleDelete} onClose={this.handleClose} open={open} />
                    </div>
                </List.Content>
                <div className='managefoods-fooditem' key={food.food_id} onClick={this.handleEditClick}>
                    <div id='managefoods-image'>
                        <Image floated='left' verticalAlign='middle' src={food.imageUrls[0]} rounded />
                    </div>
                    <div className='managefoods-title'>{food.title}</div>
                    {food.cook &&
                        <div>by {food.cook_name}</div>
                    }
                </div>
            </List.Item>
        );
    }

    static mapStateToProps = (state) => {
        return {
            deletingFoodId: Selectors.deletingFoodId(state),
        };
    };

    static mapDispatchToProps = (dispatch) => {
        return { actions: bindActionCreators(Actions, dispatch) };
    };
}

const FoodListItem = connect(FoodListItemComponent.mapStateToProps, FoodListItemComponent.mapDispatchToProps)(FoodListItemComponent);

class DeleteFoodModalComponent extends React.Component {

    state = {
        confirm: '',
        allowDelete: false
    };

    handleConfirmChange = (e, data) => {
        this.setState({ confirm: data.value, allowDelete: data.value === 'DELETE' });
    }

    handleDelete = () => {
        if (this.props.isDeleting)
            return;

        this.setState({ confirm: '' });
        this.props.actions.deleteFood(this.props.food.food_id);
    }

    handleClose = () => {
        if (this.props.isDeleting)
            return;

        this.setState({ confirm: '' });
        this.props.onClose();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.isDeleting && !nextProps.isDeleting) {
            // this.props.onClose();
        }
    }

    render() {
        const { food, open, isDeleting } = this.props;
        const { confirm, allowDelete } = this.state;

        console.log(`isDeleting: ${isDeleting}`);

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
                        <Input placeholder='DELETE' disabled={isDeleting} value={confirm} onChange={this.handleConfirmChange} />
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button floated='left' basic disabled={isDeleting} onClick={this.handleClose}>Cancel</Button>
                    <Button disabled={!allowDelete || isDeleting} loading={isDeleting} onClick={this.handleDelete}>Delete</Button>
                </Modal.Actions>
            </Modal>
        );
    }

    static mapStateToProps = (state) => {
        return {
            deletingFoodId: Selectors.deletingFoodId(state),
        };
    };

    static mapDispatchToProps = (dispatch) => {
        return { actions: bindActionCreators(Actions, dispatch) };
    };
}

const DeleteFoodModal = connect(DeleteFoodModalComponent.mapStateToProps, DeleteFoodModalComponent.mapDispatchToProps)(DeleteFoodModalComponent);