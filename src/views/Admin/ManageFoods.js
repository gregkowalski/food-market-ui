import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { Actions, Selectors } from '../../store/admin/foodManager'
import './ManageFoods.css'
import Url from '../../services/Url'
import AppHeader from '../../components/AppHeader'
import LoadingIcon from '../../components/LoadingIcon'
import { Button, List, Image, Modal, Icon, Header, Divider, Form } from 'semantic-ui-react'

class ManageFoods extends React.Component {

    componentWillMount() {
        const { foods, actions } = this.props;
        if (!foods) {
            actions.getFoods();
        }
    }

    editFood = (food_id) => {
        this.props.history.push(Url.admin.manageFood(food_id));
    }

    deleteFood = (food_id) => {

    }

    render() {
        const { isLoadingFoods, foods, onClose } = this.props;

        let foodItems;
        if (foods) {
            foodItems = foods.map(food => {
                return (
                    <List.Item key={food.food_id}>
                        <List.Content floated='right'>
                            <div className='managefoods-button'>
                                <Button content='Edit' icon='edit outline' labelPosition='left' onClick={() => this.editFood(food.food_id)} />
                                <Modal className='managefoods-delete-modal' dimmer='inverted' centered={false} trigger={<Button><Icon name='trash alternate outline' />Delete</Button>}>
                                    <Modal.Header><Icon name='trash alternate outline' />Are you sure? </Modal.Header>
                                    <Modal.Content> <div className='managefoods-title'>You are about to delete this food listing.</div></Modal.Content>
                                    <Modal.Content image>
                                        <Image wrapped size='small' src={food.imageUrls[0]} />
                                        <Modal.Description>
                                            <Header>{food.title}</Header>
                                            <Form>
                                                <Form.Field>
                                                    <label>Type DELETE to confirm</label>
                                                    <input placeholder='DELETE' />
                                                </Form.Field>
                                                <div className='managefoods-delete-error-message'>Please enter the text exactly as it is displayed.</div>
                                            </Form>
                                        </Modal.Description>
                                    </Modal.Content>
                                    <Modal.Actions>
                                        <Button floated='left' basic onClick={onClose}>Cancel</Button>
                                        <Button content='Delete' onClick={() => this.deleteFood(food.food_id)} />
                                    </Modal.Actions>
                                </Modal>
                            </div>
                        </List.Content>
                        <div className='managefoods-fooditem' key={food.food_id} onClick={() => this.editFood(food.food_id)}>
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
            });
        }

        return (
            <div className='managefoods' >
                <AppHeader fixed />
                <div className='managefoods-indent'>
                <h2>Food Management
                <Button basic floated='right' content='Add new food' icon='plus' labelPosition='left' />


                </h2>
                {isLoadingFoods &&
                    <LoadingIcon size='large' />
                }
                
                    <Divider />
                    <List divided verticalAlign='middle'>
                        {foodItems}
                    </List>
                </div>
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
