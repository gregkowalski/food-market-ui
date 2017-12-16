import React from 'react'
import { Link } from 'react-router-dom'
import './test.css'
import { Image } from 'semantic-ui-react'
import FoodItems from './data/FoodItems'
import Carousel from 'nuka-carousel'

class mytest extends React.Component {

    render() {
        // style={{width: '600px', height:'400px', textAlign: 'center'}}>
        const images = FoodItems.map((item) =>
            <Image key={item.id} style={{ marginLeft: 'auto', marginRight: 'auto', display: 'block' }} src={item.images} />
        );

        

        return (
            <Carousel dragging={true} cellSpacing={15} edgeEasing="linear">
                {images}
            </Carousel>
        )
    }
}

{/* <div key={item.id} >
<Image style={{marginLeft: 'auto', marginRight: 'auto', display: 'block'}} src={item.image} />
</div> */}

export default mytest;