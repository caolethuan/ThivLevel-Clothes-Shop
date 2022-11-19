import Slider from "react-slick";
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import Slider1 from './slide-images/slider-1.png'

function MySlider() {
  function NextArrow(props) {
    const { style, onClick } = props;
    return (
      <button style={{
        ...style,
        display: "block", position: "absolute", zIndex: 1, top: "50%", right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: '3px',
        padding: 5,
        transform: 'translateY(-50%)'
      }}
        onClick={onClick}>
        <FontAwesomeIcon icon={faChevronRight} size="2x" className="slick-arrow-icon-right" />
      </button>
    );
  }

  function PrevArrow(props) {
    const { style, onClick } = props;
    return (
      <button style={{
        ...style,
        display: "block", position: "absolute", zIndex: 1, top: "50%",
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: '3px',
        padding: 5,
        transform: 'translateY(-50%)'
      }}
        onClick={onClick}>
        <FontAwesomeIcon icon={faChevronLeft} size="2x" className="slick-arrow-icon-left" />
      </button>
    );
  }
  const images = [
    "https://media.coolmate.me/cdn-cgi/image/width=1920,quality=100,format=auto/uploads/October2022/Hero-BST-Dong-ppp_21.jpeg",
    Slider1,
    "https://media.coolmate.me/cdn-cgi/image/width=1920,quality=100,format=auto/uploads/July2022/Banner-Coolmate-Active-opt-1.jpeg",
  ]
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    centerPadding: '50px',
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />

  }
  return (
    <Slider {...settings} className="slider-container">
      {
        images.map((image, index) => (
          <div key={index} className="slider-img">
            <img src={image} alt="" />
          </div>
        ))
      }
    </Slider>
  )
}

export default MySlider