import { getAppointmentsForDay } from '../helpers/selectors';

const calculateSpots = myState => {
  return myState.days
    .map(day => day.name)
    .map(day => getAppointmentsForDay(myState, day))
    .map(slotsInOneday =>
      slotsInOneday.reduce(
        (count, slot) => (slot.interview ? count : count + 1),
        0
      )
    );
};

const handleAppointsmentUpdate = (myState, id, interview) => {
  let appointments = { ...myState.appointments };
  appointments[id].interview = interview || null;
  return appointments;
};

const reducers = {
  SET_APPLICATION_DATA: (prevState, action) => ({
    ...prevState,
    ...action.payload
  }),
  // SET_DAY: (prevState, action) => ({ ...prevState, day: action.payload }),
  SET_INTERVIEW: (prevState, action) => {
    const { id, interview } = action.payload;
    let intermediateState = {
      ...prevState,
      appointments: handleAppointsmentUpdate(prevState, id, interview)
    };
    let updatedDays = [...intermediateState.days];
    calculateSpots(intermediateState).map(
      (count, i) => (updatedDays[i].spots = count)
    );
    return { ...intermediateState, days: updatedDays };
  }
};

const reducer = (prevState, action) => {
  const { type } = action;
  if (!reducers[type]) {
    throw new Error('tried to reduce with unsupported action type');
  }
  return reducers[type](prevState, action) || prevState;
};

export default reducer;
