import React, { useState } from 'react';

import InterviewerList from '../InterviewerList/InterviewerList';
import Button from '../Button';

export default function Form({
  name: propName,
  interviewer: propInterviewer,
  interviewers,
  onCancel,
  onSave
}) {
  const [name, setName] = useState(propName || '');
  const [interviewer, setInterviewer] = useState(propInterviewer || null);
  const [error, setError] = useState('');

  const validate = () => {
    if (name === '') {
      setError('Student name cannot be blank');
      return;
    }

    if (interviewer) {
      const interviewerID =
        typeof interviewer === 'number' ? interviewer : interviewer.id;
      setError('');
      onSave(name, interviewerID);
    }
  };

  const reset = () => {
    setName('');
    setInterviewer(null);
  };

  const cancel = () => {
    reset();
    onCancel();
  };

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={e => e.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={name}
            onChange={e => setName(e.target.value)}
            data-testid="student-name-input"
          />
          <section className="appointment__validation">{error}</section>
          <InterviewerList
            interviewers={interviewers}
            interviewer={interviewer}
            onChange={setInterviewer}
          />
        </form>
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>
            Cancel
          </Button>
          <Button confirm onClick={validate}>
            Save
          </Button>
        </section>
      </section>
    </main>
  );
}
