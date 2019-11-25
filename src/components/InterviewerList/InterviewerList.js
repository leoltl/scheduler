import React from 'react';

import InterviewerListItem from '../InterviewerListItem/InterviewerListItem';
import './InterviewerList.scss'

export default function InterviewerList({interviewers, value, onChange}) {
  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {interviewers.map(({id, name, avatar}) => (
          <InterviewerListItem 
            {...{name, avatar}}
            key={id}
            setInterviewer={() => onChange(id)}
            selected={value === id}
          />))}
      </ul>
    </section>
  )
}