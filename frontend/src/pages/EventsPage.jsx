import React from "react";
import { useSelector } from "react-redux";
import EventCard from "../components/Route/Events/EventCard";
import Header from "../components/Layout/Header";
//import Loader from "../components/Layout/Loader";

const EventsPage = () => {
  //const { allEvents, isLoading } = useSelector((state) => state.events);
  return (
    <>
   
        <div>
          <Header activeHeading={4} />
          <EventCard active={true} />
          <EventCard active={true} />
        </div>
    
    </>
  );
};

export default EventsPage;
