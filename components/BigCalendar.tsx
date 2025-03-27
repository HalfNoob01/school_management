'use client'

import "react-big-calendar/lib/css/react-big-calendar.css";

import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar'
import moment from 'moment'
import { calendarEvents } from '@/lib/data';
import { useState } from "react";

const localizer = momentLocalizer(moment)

const BigCalendar = () => {
  const [view,setView] = useState<View>(Views.WEEK);

  const handleOnChangeView = (selectedView : View) => {
    setView(selectedView);
  };

  console.log(Views.WEEK[1])
  console.log(Views.WEEK[2])
   return (
    <Calendar
      localizer={localizer}
      events={calendarEvents}
      startAccessor="start"
      endAccessor="end"
      views={["week","day"]}
      view={view}
      style={{ height: "98%"}}
      onView={handleOnChangeView}
      min={new Date(2025, 1, 0, 8, 0, 0)}
      max={new Date(2025, 1, 0, 17, 0, 0)}
    />
   )
}

export default BigCalendar;