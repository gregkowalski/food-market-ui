import React from 'react'
import { Link } from 'react-router-dom'
import './test.css'
import { Image } from 'semantic-ui-react'
var Carousel = require('nuka-carousel');

class mytest extends React.Component {

    render() {
        return (
            <Carousel>
        <img src="http://placehold.it/1000x400/ffffff/c0392b/&text=slide1"/>
        <img src="http://placehold.it/1000x400/ffffff/c0392b/&text=slide2"/>
        <img src="http://placehold.it/1000x400/ffffff/c0392b/&text=slide3"/>
        <img src="http://placehold.it/1000x400/ffffff/c0392b/&text=slide4"/>
        <img src="http://placehold.it/1000x400/ffffff/c0392b/&text=slide5"/>
        <img src="http://placehold.it/1000x400/ffffff/c0392b/&text=slide6"/>
      </Carousel>
        )
      }
}

export default mytest;