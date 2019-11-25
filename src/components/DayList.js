import React from 'react';
import DayListItem from './DayListItem'

export default function DayList({days, day: propsDay, setDay}) {
  return (
    <ul>
      {days.map(day => (
        <DayListItem 
          key={day.id}
          name={day.name} 
          spots={day.spots} 
          selected={day.name === propsDay}
          setDay={setDay}  />
          )
        )}
    </ul>
  )
}