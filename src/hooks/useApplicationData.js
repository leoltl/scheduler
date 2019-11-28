import { useEffect, useReducer } from 'react';
import { getDayByAppointmentID } from '../helpers/selectors';
import axios from "axios";

import 'components/Application.scss';

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";
const NEW = "NEW";
const REMOVE = "REMOVE";

const reducers = {
  SET_APPLICATION_DATA: (prevState, action) => ({ ...prevState, ...action.payload }),
  SET_DAY: (prevState, action) => ({ ...prevState, day: action.payload }),
  SET_INTERVIEW: (prevState, action) => {
    const { id, appointments, updateType } = action.payload
    const daysID = Math.floor((id - 1) / 5);
    const intermediateState = { ...prevState, appointments };
    // mutates the copied state
    updateType === NEW && intermediateState.days[daysID].spots--;
    updateType === REMOVE && intermediateState.days[daysID].spots++;
    return intermediateState
    }
};

const reducer = (prevState, action) => {
  const { type } = action;
  return reducers[type](prevState, action) || prevState;
};

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
      dispatch({type: SET_APPLICATION_DATA, payload: { days, appointments, interviewers }});
    })
  }, []);

  const setDay = day => dispatch({ type: SET_DAY, payload: day });

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
              dispatch({ type: SET_INTERVIEW, payload: { updateType: NEW, appointments, id } })
              return res;
            })
  };

  const cancelInterview = (id) => {
    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        const copyOfAppointments = state.appointments
        copyOfAppointments[id].interview = null;
        dispatch({ type: SET_INTERVIEW, payload: { updateType: REMOVE, appointments: copyOfAppointments, id } })
      })
  };

  return { state, setDay, bookInterview, cancelInterview };
}