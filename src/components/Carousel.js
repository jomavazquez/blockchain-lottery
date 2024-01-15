import React, { Component } from "react";
import Carousel from "react-bootstrap/Carousel";
import img1 from "../assets/tokens.jpg";
import img2 from "../assets/tickets.jpg";
import img3 from "../assets/winner.jpg";

class MyCarousel extends Component {
    render() {
        return (
            <Carousel>
                <Carousel.Item>
                    <img className="d-block w-100" src={ img1 } alt="Tokens" />
                </Carousel.Item>
                <Carousel.Item>
                    <img className="w-100" src={img2 } alt="Tickets" />
                </Carousel.Item>
                <Carousel.Item>
                    <img className="w-100"src={ img3 } alt="Winners" />
                </Carousel.Item>
            </Carousel>

        );
    }
}

export default MyCarousel;