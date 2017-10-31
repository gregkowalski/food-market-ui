import React from 'react'
import Scroll from 'react-scroll'
import './test.css'

var Link = Scroll.Link;
var DirectLink = Scroll.DirectLink;
var Element = Scroll.Element;
var Events = Scroll.Events;
var scroll = Scroll.animateScroll;
var scrollSpy = Scroll.scrollSpy;
var scroller = Scroll.scroller;

class mytest extends React.Component {

    componentDidMount() {

        Events.scrollEvent.register('begin', function (to, element) {
            console.log("begin", arguments);
        });

        Events.scrollEvent.register('end', function (to, element) {
            console.log("end", arguments);
        });

        scrollSpy.update();
    }

    componentWillUnmount() {
        Events.scrollEvent.remove('begin');
        Events.scrollEvent.remove('end');
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-default navbar-fixed-top">
                    <div className="container-fluid">
                        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                            <ul className="nav navbar-nav">
                                <li><Link container={window.document} activeClass="active" className="test1" to="test1" spy={true} smooth={true} duration={500}>Test 1</Link></li>
                                <li><Link container={window.document} activeClass="active" className="test2" to="test2" spy={true} smooth={true} duration={500}>Test 2</Link></li>
                                <li><Link container={window.document} activeClass="active" className="test3" to="test3" spy={true} smooth={true} duration={500}>Test 3</Link></li>
                                <li><Link container={window.document} activeClass="active" className="test4" to="test4" spy={true} smooth={true} duration={500}>Test 4</Link></li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <Element name="test1" className="element" >
                    test 1
                </Element>

                <Element name="test2" className="element">
                    test 2
                </Element>

                <Element name="test3" className="element">
                    test 3
                </Element>

                <Element name="test4" className="element">
                    test 4
                </Element>

            </div>
        );
    }
}

export default mytest;