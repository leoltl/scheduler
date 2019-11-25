import React from 'react';
import classnames from 'classnames';

import './InterviewerListItem.scss'

export default function InterviewerListItem ({id, name, avatar, selected, setInterviewer}) {
  const componentClass = classnames("interviewers__item", {
    "interviewers__item--selected": selected
    }
  )
  return (
    <li onClick={setInterviewer} className={componentClass}>
      <img
        className="interviewers__item-image"
        src={avatar}
        alt={name}
      />
        {selected && name}
    </li>
  )
}