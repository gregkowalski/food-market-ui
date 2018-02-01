import React from 'react'
import { Image, Button } from 'semantic-ui-react'
import Lightbox from 'react-images'
import './FoodLightbox.css'
import ApiClient from '../Api/ApiClient'

export default class FoodLightbox extends React.Component {

    state = {
        currentImage: 0,
        lightboxIsOpen: false,
        food: {}
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

    componentWillMount() {
        let apiClient = new ApiClient();
        apiClient.getFood(this.props.foodItemId)
            .then(response => {
                this.setState({food: response.data});
            })
            .catch(err => {
                console.error(err);
            });
    }

    render() {
        if (!Object.keys(this.state.food).length) {
            return null;
        }

        const photos = this.state.food.imageUrls.map(image => {
            return {
                src: image
            };
        });

        return (
            <div className='foodlightbox-image-wrap'>
                <Image className='foodlightbox-food-image' src={this.state.food.imageUrls[0]} onClick={() => this.openLightbox()} />
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