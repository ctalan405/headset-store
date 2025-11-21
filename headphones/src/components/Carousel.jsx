import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import './Carousel.css';


import img1 from '../assets/img1.jpg';
import img2 from '../assets/img2.jpg';
import img3 from '../assets/img3.jpg';

function CarouselComponent() {
  return (
    <Carousel interval={2000} fade>
      <Carousel.Item>
        <img
          className="custom-carousel-img"
          src={img1}
          alt="First slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="custom-carousel-img"
          src={img2}
          alt="Second slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="custom-carousel-img"
          src={img3}
          alt="Third slide"
        />
      </Carousel.Item>
    </Carousel>
  );
}

export default CarouselComponent;
