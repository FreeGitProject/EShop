import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "../../../styles/styles.js";
import EventCardSlider from "./EventCardSlider.jsx";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Events = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);

  // Slider settings for autoplay and custom buttons
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,        // Shows next/prev buttons
    autoplay: true,      // Enables auto-sliding
    autoplaySpeed: 3000, // Sets the auto-slide interval to 3 seconds (3000 ms)
    pauseOnHover: true,  // Pauses sliding when hovered over
  };

  return (
    <div>
      {!isLoading && (
        <div className={`${styles.section}`}>
          <div className={`${styles.heading}`}>
            <h1>Popular Events</h1>
          </div>
          <div className="w-full"  style={{ height: "500px" }}>
            {allEvents.length !== 0 ? (
              <Slider {...sliderSettings}>
                {allEvents?.map((event) => (
                  <EventCardSlider key={event._id} data={event} />
                ))}
              </Slider>
            ) : (
              <h4>No Events available!</h4>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
