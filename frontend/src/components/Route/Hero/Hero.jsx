import React from "react";
import styles from "../../../styles/styles";
import Carousel from "./carousel.component";

const Hero = () => {
  const imageUrls = [
    "https://themes.rslahmed.dev/rafcart/assets/images/banner-1.jpg",
    "https://themes.rslahmed.dev/rafcart/assets/images/banner-2.jpg",
    "https://themes.rslahmed.dev/rafcart/assets/images/banner-3.jpg",
  ];

  return (
    <div>
      <Carousel slides={imageUrls} />
    </div>
  );
};

export default Hero;
