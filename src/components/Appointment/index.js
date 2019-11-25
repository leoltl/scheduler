import React from 'react';

import './styles.scss';
import Header from './Header';
import Empty from './Empty';
import Show from './Show';
import Confirm from './Confirm';
import Status from './Status';
import { action } from '@storybook/addon-actions/dist/preview';

export default function Appointment({id, time, interview}) {
  return (
    <article className="appointment">
      <Header time={time} key={id}/>
      {interview ? 
        <Show 
          student={interview.student} 
          interviewer={interview.interviewer} 
          onEdit={action("onEdit")} 
          onDelete={action("onDelete")}
        /> : <Empty />}
    </article>
  )
}