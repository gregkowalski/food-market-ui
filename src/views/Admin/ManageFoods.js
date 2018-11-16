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
import { Button, List, Image } from 'semantic-ui-react'

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

    render() {
        const { isLoadingFoods, foods } = this.props;

        let foodItems;
        if (foods) {
            foodItems = foods.map(food => {
                return (
                    <List.Item key={food.food_id}>
                        <List.Content floated='right'>
                            <Button content='Edit' icon='edit outline' labelPosition='right' onClick={() => this.editFood(food.food_id)} />
                            {/* <Button content='Delete' icon='trash alternate outline' labelPosition='right' /> */}
                        </List.Content>
                        <div className='managefoods-fooditem' key={food.food_id} onClick={() => this.editFood(food.food_id)}>
                            <div className='managefoods-mobile'>
                                <Image floated='left' verticalAlign='middle' src={food.imageUrls[0]} rounded />
                            </div>
                            <div className='managefoods-desktop'>
                                <Image floated='left' verticalAlign='middle' size='tiny' src={food.imageUrls[0]} rounded />
                            </div>
                            <div className='managefoods-title'>{food.title}</div>
                            {food.cook &&
                                <div className='managefoods-small-font'>Cook: {food.cook_name}</div>
                            }
                        </div>
                    </List.Item>
                );
            });
        }

        return (
            <div className='managefoods' >
                <AppHeader fixed />
                <h2>Food Management</h2>
                {isLoadingFoods &&
                    <LoadingIcon size='large' />
                }
                <div className='managefoods-indent'>
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
