import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "../../../styles/styles.js";
import EventCard from "./EventCard.jsx";

const Events = () => {
  return (
    <div>
      <div className={`${styles.section}`}>
        <div className={`${styles.heading}`}>
          <h1>Popular Events</h1>
        </div>

        <div className="w-full grid">
          <EventCard />
        </div>
      </div>
    </div>
  );
};

export default Events;
