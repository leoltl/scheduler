import { useEffect, useReducer } from 'react';
import { getAppointmentsForDay } from '../helpers/selectors';
import axios from "axios";

import 'components/Application.scss';

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

const calculateSpots = (myState) => {
  return myState.days.map(day => day.name)
          .map(day => getAppointmentsForDay(myState, day))
          .map(slotsInOneday => 
            slotsInOneday.reduce((count, slot) => slot.interview ? count : count + 1, 0));
}

const handleAppointsmentUpdate = (myState, id, interview) => {
  let { appointments } = myState;
  appointments[id].interview = interview || null;
  return appointments
}

const reducers = {
  SET_APPLICATION_DATA: (prevState, action) => ({ ...prevState, ...action.payload }),
  SET_DAY: (prevState, action) => ({ ...prevState, day: action.payload }),
  SET_INTERVIEW: (prevState, action) => {
    const { id, interview } = action.payload;
    let intermediateState = {...prevState, appointments: handleAppointsmentUpdate(prevState, id, interview)}
    let updatedDays = intermediateState.days
    calculateSpots(intermediateState).map((count, i) => updatedDays[i].spots = count);
    return {...intermediateState, days: updatedDays}
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

  useEffect(() => {
    const sock = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    sock.addEventListener('open', () => {
      sock.send('ping');
    })
    sock.addEventListener('message', (msg) => {
      const { id, interview } = JSON.parse(msg.data);
      if (id) {
        dispatch({ type: SET_INTERVIEW, payload: { id, interview }})
      };
    })

    return (() => {
      sock.close();
    })
  }, []);

  const setDay = day => dispatch({ type: SET_DAY, payload: day });

  const bookInterview = (id, interview) => {
    return axios.put(`/api/appointments/${id}`, { interview })
              .then((res) => {
                const resInterview = { ...interview }
                dispatch({ type: SET_INTERVIEW, payload: { id, interview: resInterview } })
                return res;
              })
  };

  const cancelInterview = (id) => {
    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        dispatch({ type: SET_INTERVIEW, payload: { id } })
      })
  };

  return { state, setDay, bookInterview, cancelInterview };
}