import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { getAppointmentsForDay, getInterviewersByDay, getInterview } from 'helpers/selectors'
import DayList from 'components/DayList';
import Appointment from 'components/Appointment';

import 'components/Application.scss';


export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday", 
    days: [],
    appointments: [],
    interviewers: {}
  });

  
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ])
    .then(res => {
      const days = res[0].data;
      const appointments = res[1].data;
      const interviewers = res[2].data;
      setState(prevState => ({...prevState, days, appointments, interviewers}));
    })
  }, [])
  
  const setDay = day => setState({...state, day});
  const interviewers = getInterviewersByDay(state, state.day);
  const appointments = getAppointmentsForDay(state, state.day);
  
  const bookInterview = (id, interview) => {
    return axios.put(`/api/appointments/${id}`, {
              interview
            }).then((res) => {
              const appointment = {
                ...state.appointments[id],
                interview: { ...interview }
              };
              const appointments = {
                ...state.appointments,
                [id]: appointment
              };
              setState({
                ...state,
                appointments
              });
              return res;
            })
  }

  const cancelInterview = (id) => {
    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        const copyOfState = {...state}
        copyOfState.appointments[id].interview = null;
        setState(copyOfState);
      })
  }

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList 
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {state.appointments && 
          appointments.map(appointment => {
              return (
              <Appointment
                  key={appointment.id}
                  id={appointment.id}
                  time={appointment.time}
                  interview={getInterview(state, appointment.interview)}
                  interviewers={interviewers}
                  bookInterview={bookInterview}
                  cancelInterview={cancelInterview}
              />
            );
        })}
      </section>
    </main>
  );
}
