import React from "react";
import UpcomingListItem from "../Events/EventsList/UpcomingListItem.jsx";

export const UpcomingEventsList = ({ upcomingEvents }) => {
  return (
    <div className="flex justify-center w-full box-border">
      <div className="grid items-start grid-cols-1 md:grid-cols-2 gap-x-[25x] gap-y-[50px] max-w-[1300px] w-full px-4">
        {upcomingEvents?.map((event) => (
          <UpcomingListItem key={event._id} event={event} />
        ))}
      </div>
    </div>
  );
};