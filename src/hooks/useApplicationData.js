import { useEffect, useReducer } from 'react';
import axios from "axios";

import 'components/Application.scss';

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

const reducers = {
  SET_DAY: (prevState, action) => {
    return {...prevState, day: action.payload}
  },
  SET_APPLICATION_DATA: (prevState, action) => {
    return {...prevState, ...action.payload};
  },
  SET_INTERVIEW: (prevState, action) => {
    return { ...prevState, appointments: action.payload }
  }
}

const reducer = (prevState, action) => {
  const { type } = action;
  return reducers[type](prevState, action) || prevState;
}

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
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
      dispatch({type: SET_APPLICATION_DATA, payload: {days, appointments, interviewers}});
    })
  }, []);

  const setDay = day => dispatch({type: SET_DAY, payload: day});

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
              dispatch({type: SET_INTERVIEW, payload: appointments})
              return res;
            })
  }

  const cancelInterview = (id) => {
    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        const copyOfAppointments = state.appointments
        copyOfAppointments[id].interview = null;
        dispatch({type: SET_INTERVIEW, payload: copyOfAppointments})
      })
  }

  return { state, setDay, bookInterview, cancelInterview };
}