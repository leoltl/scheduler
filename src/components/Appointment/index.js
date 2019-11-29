import React, { useEffect } from 'react';

import './styles.scss';
import Header from './Header';
import Empty from './Empty';
import Form from './Form';
import Show from './Show';
import Status from './Status';
import Confirm from './Confirm';
import Error from './Error';

import useVisualMode from '../../hooks/useVisualMode';


const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const EDIT = "EDIT";
const SAVING = "SAVING";
const CONFIRM = "CONFIRM";
const DELETING = "DELETING";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment({ id, time, interview, interviewers, bookInterview, cancelInterview }) {
  const { mode, transition, back } = useVisualMode(interview ? SHOW : EMPTY);

  useEffect(() => {
    interview ? transition(SHOW) : transition(EMPTY)
  }, [interview])  

  const OnSave = (name, interviewer) => {
    transition(SAVING, true);
    bookInterview(id, { student: name, interviewer })
      .then((res) => transition(SHOW))
      .catch(error => transition(ERROR_SAVE, true))
  }

  const OnConfirmDelete = () => {
    transition(DELETING, true);
    cancelInterview(id).then(() => transition(EMPTY)).catch(() => transition(ERROR_DELETE), true)
  }

  const OnShowDelete = () => {
    transition(CONFIRM, true);
  }
  const OnShowEdit = () => {
    transition(EDIT);
  }
  return (
    <article className="appointment">
      <Header time={time} key={id}/>

      {mode === ERROR_SAVE && <Error onClose={back} message="Connection Error: Appoinment is not saved."/>}
      {mode === ERROR_DELETE && <Error onClose={back} message="Connection Error: Appoinment is not deleted."/>}
      {mode === CONFIRM && <Confirm onConfirm={OnConfirmDelete} onCancel={back} message="Confirm Deletion?"/>}
      {mode === SAVING && <Status message="Saving your appointment..." />}
      {mode === DELETING && <Status message="Deleting your appointment..." />}
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && interview && <Show student={interview.student} interviewer={interview.interviewer} onDelete={OnShowDelete} onEdit={OnShowEdit}/> }
      {mode === CREATE && <Form interviewers={interviewers} onCancel={back} onSave={OnSave} /> }
      {mode === EDIT && interview && <Form name={interview.student} interviewer={interview.interviewer} interviewers={interviewers} onCancel={back} onSave={OnSave} /> }
    </article>
  )
} 