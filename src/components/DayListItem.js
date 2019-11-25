import React from 'react';
import classnames from 'classnames';

import './DayListItem.scss';

export default function DayListItem({name, spots, selected, setDay}) {
  const dayListItemClass = classnames("day-list__item", {
    "day-list__item--selected": selected,
    "day-list__item--full": spots === 0,
  });

  const formatSpots = (spots) => (
    spots ? 
      spots === 1 ? '1 spot' : `${spots} spots`:
     "no spots"
  )

  return (
    <li className={dayListItemClass} onClick={() => setDay(name)}>
      <h2 className="text--regular">{name}</h2> 
      <h3 className="text--light">{formatSpots(spots)} remaining</h3>
    </li>
  );
}