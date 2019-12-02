import React from 'react';

import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  getByText,
  prettyDOM,
  getAllByTestId,
  getByPlaceholderText,
  getByAltText,
  queryByText,
  waitForElementToBeRemoved
} from '@testing-library/react';

import Application from 'components/Application';
import Appointment from 'components/Appointment';

afterEach(cleanup);

describe('Application', () => {
  it('defaults to Monday and changes the schedule when a new day is selected', () => {
    const { getByText } = render(<Application />);
    return waitForElement(() => getByText('Monday'));
  });

  it('changes the schedule when a new day is selected', async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText('Monday'));

    fireEvent.click(getByText('Tuesday'));

    expect(getByText('Leopold Silvers')).toBeInTheDocument();
  });

  it('loads data, books an interview and reduces the spots remaining for the first day by 1', async () => {
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointment = getAllByTestId(container, 'appointment')[0];

    fireEvent.click(getByAltText(appointment, 'Add'));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: 'Lydia Miller-Jones' }
    });

    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));

    fireEvent.click(getByText(appointment, 'Save'));

    expect(
      getByText(appointment, 'Saving your appointment...')
    ).toBeInTheDocument();

    await waitForElementToBeRemoved(() =>
      getByText(appointment, 'Saving your appointment...')
    );
    expect(getByAltText(appointment, 'Edit')).toBeInTheDocument();
    expect(getByAltText(appointment, 'Delete')).toBeInTheDocument();
    expect(getByText(appointment, 'Lydia Miller-Jones')).toBeInTheDocument();

    const day = getAllByTestId(container, 'day').find(day =>
      queryByText(day, 'Monday')
    );

    expect(getByText(day, 'no spots remaining')).toBeInTheDocument();
  });
});
