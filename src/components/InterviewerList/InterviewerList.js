import React from 'react';

import InterviewerListItem from '../InterviewerListItem/InterviewerListItem';
import './InterviewerList.scss'

export default function InterviewerList({interviewers, interviewer:propInterviewer, onChange}) {
  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {interviewers.map(interviewer => {
          const {id, name, avatar} = interviewer
          return <InterviewerListItem 
            {...{name, avatar}}
            key={id}
            setInterviewer={() => onChange(interviewer)}
            selected={propInterviewer ? id === propInterviewer.id : false}
        />})}
      </ul>
    </section>
  )
}