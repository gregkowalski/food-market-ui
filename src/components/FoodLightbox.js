import React from 'react'
import { Image, Button } from 'semantic-ui-react'
import Lightbox from 'react-images'
import './FoodLightbox.css'
import FoodItems from 'data/FoodItems'

export default class FoodLightbox extends React.Component {

    state = {
        currentImage: 0,
        lightboxIsOpen: false
    };

    openLightbox(event, obj) {
        this.setState({
            currentImage: 0,//obj.index,
            lightboxIsOpen: true,
        });
    }

    closeLightbox() {
        this.setState({
            currentImage: 0,
            lightboxIsOpen: false,
        });

    }
    gotoPrevious() {
        this.setState({
            currentImage: this.state.currentImage - 1,
        });

    }
    gotoNext() {
        this.setState({
            currentImage: this.state.currentImage + 1,
        });
    }

    gotoImage(index) {
        this.setState({
            currentImage: index,
        });
    }

    render() {

        let foodItemId = this.props.foodItemId;
        let food = FoodItems.find(x => x.id === foodItemId);

        const photos = food.images.map(image => {
            return {
                src: image
            };
        });

        return (
            <div className='foodlightbox-image-wrap'>
                <Image className='foodlightbox-food-image' src={food.image} onClick={() => this.openLightbox()} />
                <Lightbox images={photos}
                    onClose={() => this.closeLightbox()}
                    onClickPrev={() => this.gotoPrevious()}
                    onClickNext={() => this.gotoNext()}
                    onClickThumbnail={(index) => this.gotoImage(index)}
                    currentImage={this.state.currentImage}
                    isOpen={this.state.lightboxIsOpen}
                    showThumbnails={true}
                />
                <div className='foodlightbox-position'>
                    <Button
                        compact
                        className='foodlightbox-button'
                        content='View Photos'
                        onClick={() => this.openLightbox()} />
                </div>
            </div>
        )
    }
}