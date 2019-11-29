export const getAppointmentsForDay = (state, dayName) => {
  const [filteredDay] = state.days.filter(day => day.name === dayName);
  const appointmentIDs = filteredDay ? filteredDay.appointments : [];
  return appointmentIDs.map(id => state.appointments[id]);
};

export const getInterviewersByDay = (state, dayName) => {
  const [filteredDay] = state.days.filter(day => day.name === dayName);
  const interviewersID = filteredDay ? filteredDay.interviewers : [];
  return interviewersID.map(id => state.interviewers[id]);
};

export const getInterview = (state, interview) => {
  if (interview) {
    return {
      ...interview,
      interviewer: state.interviewers[interview.interviewer]
    };
  }
  return null;
};
