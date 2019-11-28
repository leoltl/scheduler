import { useState, useEffect } from 'react';
import axios from "axios";

import 'components/Application.scss';


export default function useApplicationData() {
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
  }, []);

  const setDay = day => setState({...state, day});

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

  return { state, setDay, bookInterview, cancelInterview};

}