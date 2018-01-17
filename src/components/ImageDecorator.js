import React from 'react'
import { Icon } from 'semantic-ui-react'
import createReactClass from 'create-react-class';
import './ImageDecorator.css'

const CarouselDecorators = [
    {
        component: createReactClass({
            render() {
                return (
                    <button className='FoodImageHideDecorator'
                        style={this.getButtonStyles(this.props.currentSlide === 0 && !this.props.wrapAround)}
                        onClick={this.handleClick}><Icon size='huge' name='angle left' /></button>
                )
            },
            handleClick(e) {
                e.preventDefault();
                this.props.previousSlide();
            },
            getButtonStyles(disabled) {
                return {
                    border: 0,
                    background: 'linear-gradient(to left, rgba(0,0,0,0), rgba(0,0,0,0.05), rgba(0,0,0,0.1), rgba(0,0,0,0.15), rgba(0,0,0,0.2))',                    
                    color: 'white',
                    paddingRight: 10,
                    outline: 0,
                    opacity: disabled ? 0.3 : 1,
                    cursor: 'pointer',
                    height: '100%'
                }
            }
        }),
        position: 'CenterLeft'
    },
    {
        component: createReactClass({
            render() {
                return (
                    <button className='FoodImageHideDecorator'
                        style={this.getButtonStyles(this.props.currentSlide + this.props.slidesToScroll >= this.props.slideCount && !this.props.wrapAround)}
                        onClick={this.handleClick}><Icon size='huge' name='angle right' /></button>
                )
            },
            handleClick(e) {
                e.preventDefault();
                this.props.nextSlide();
            },
            getButtonStyles(disabled) {
                return {
                    border: 0,
                    background: 'linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,0.05), rgba(0,0,0,0.1), rgba(0,0,0,0.15), rgba(0,0,0,0.2))',
                    color: 'white',
                    paddingLeft: 10,
                    outline: 0,
                    opacity: disabled ? 0.3 : 1,
                    cursor: 'pointer',
                    height: '100%'
                }
            }
        }),
        position: 'CenterRight'
    },
    {
        component: createReactClass({
            render() {
                var self = this;
                var indexes = this.getIndexes(this.props.slideCount, this.props.slidesToScroll);
                return (
                    <ul style={self.getListStyles()}>
                        {
                            indexes.map(function (index) {
                                return (
                                    <li style={self.getListItemStyles()} key={index}>
                                        <button className='FoodImageHideDecorator'
                                            style={self.getButtonStyles(self.props.currentSlide === index)}
                                            onClick={(e) => self.handleClick(e, index)}>
                                            &bull;
                                        </button>
                                    </li>
                                )
                            })
                        }
                    </ul>
                )
            },
            handleClick(e, index) {
                e.preventDefault();
                this.props.goToSlide.bind(null, index);
            },
            getIndexes(count, inc) {
                var arr = [];
                for (var i = 0; i < count; i += inc) {
                    arr.push(i);
                }
                return arr;
            },
            getListStyles() {
                return {
                    position: 'relative',
                    margin: 0,
                    top: 8,
                    padding: 0
                }
            },
            getListItemStyles() {
                return {
                    listStyleType: 'none',
                    display: 'inline-block'
                }
            },
            getButtonStyles(active) {
                return {
                    border: 0,
                    background: 'transparent',
                    color: 'white',
                    cursor: 'pointer',
                    padding: 5,
                    outline: 10,
                    fontSize: 46,
                    opacity: active ? 1 : 0.5
                }
            }
        }),
        position: 'BottomCenter'
    }
];

export default CarouselDecorators;