import React from "react";
import styles from "../../../styles/styles";
import Carousel from "./carousel.component";

const Hero = () => {
  const HeroData = [
    {
        url: "https://themes.rslahmed.dev/rafcart/assets/images/banner-1.jpg",
        title: "Best Collection for home Decoration",
        description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae,assumenda? Quisquam itaque",
        btnTitle: "Shop Now"
    },
    {
        url: "https://themes.rslahmed.dev/rafcart/assets/images/banner-2.jpg",
        title: "Another Title",
        description: "Another Description",
        btnTitle: "Shop Now1"
    },
    {
        url: "https://themes.rslahmed.dev/rafcart/assets/images/banner-3.jpg",
        title: "Yet Another Title",
        description: "Yet Another Description",
        btnTitle: "Shop Now2"
    }
];

  return (
    <div>
      <Carousel slides={HeroData} />
    </div>
  );
};

export default Hero;
