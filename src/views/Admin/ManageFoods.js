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
import { Divider, Button, List, Image } from 'semantic-ui-react'


class ManageFoods extends React.Component {

    componentWillMount() {
        const { foods, actions } = this.props;
        if (!foods) {
            actions.getFoods()
                .then(() => {
                    // const cook_ids = this.props.foods.map(x => x.user_id);
                    // return actions.getCooks(cook_ids);
                });
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
                food.cook = {
                    id: '1234',
                    name: 'Johann',
                    email: 'johannkao@gmail.com'
                }
                return (
                    <div className='managefoods-indent'>
                        <List divided verticalAlign='middle'>
                            <List.Item>
                                <List.Content floated='right'>
                                    {/* <Button>Edit</Button> */}
                                    <Button content='Edit' icon='edit outline' labelPosition='left' onClick={() => this.editFood(food.food_id)} />
                                    {/* <Button content='Delete' icon='trash alternate outline' labelPosition='right' /> */}
                                </List.Content>
                                <div className='managefoods-fooditem' key={food.food_id} onClick={() => this.editFood(food.food_id)}>
                                    {/* <div>{food.imageUrls}</div> */}
                                    <Image floated='left' verticalAlign='middle' size='tiny' src={food.imageUrls[0]} rounded />
                                    <div className='managefoods-bold-title'>{food.title}</div>
                                    <div className='managefoods-ID-number'>ID: {food.food_id}</div>
                                    <div>Cook: {food.cook.name}</div>
                                </div>
                            </List.Item>
                        </List>
                        <Divider />
                    </div>
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
                {foodItems}
            </div >
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
