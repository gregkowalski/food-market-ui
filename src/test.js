import React from 'react'
import './test.css'
import { Image } from 'semantic-ui-react'
import FoodItems from './data/FoodItems'
import Carousel from 'nuka-carousel'

class mytest extends React.Component {

    state = {
        rows: [
            {
                id: 1,
                name: 'Loading, please wait...'
            }
        ]
    }

    componentDidMount() {
        fetch('https://01rdlz5p50.execute-api.us-west-2.amazonaws.com/api/messages', {
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => {
                return response.json();
            })
            .then(jsonData => {
                console.log(jsonData);
                this.setState({ rows: jsonData.rows });
            });
    }

    render() {
        let pets = '';
        if (this.state.rows) {
            pets = this.state.rows.map(row =>
                <div key={row.id}>{row.name}</div>
            );
        }
        return (
            <div>
                {pets}
            </div>
        );
    }
}

export default mytest;
