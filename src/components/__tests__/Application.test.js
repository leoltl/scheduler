import React from 'react';

import axios from 'axios';

import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  getByText,
  getAllByTestId,
  getByPlaceholderText,
  getByAltText,
  queryByText,
  queryByAltText,
  waitForElementToBeRemoved
} from '@testing-library/react';

import Application from 'components/Application';

afterEach(cleanup);

describe('Application', () => {
  it('defaults to Monday and changes the schedule when a new day is selected', async () => {
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

  it('loads data, cancels an interview and increases the spots remaining for Monday by 1', async () => {
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointment = getAllByTestId(
      container,
      'appointment'
    ).find(appointment => queryByText(appointment, 'Archie Cohen'));

    fireEvent.click(queryByAltText(appointment, 'Delete'));

    expect(getByText(appointment, 'Confirm Deletion?')).toBeInTheDocument();

    fireEvent.click(getByText(appointment, 'Confirm'));

    expect(
      getByText(appointment, 'Deleting your appointment...')
    ).toBeInTheDocument();

    await waitForElementToBeRemoved(() =>
      getByText(appointment, 'Deleting your appointment...')
    );

    const day = getAllByTestId(container, 'day').find(day =>
      queryByText(day, 'Monday')
    );

    expect(getByAltText(appointment, 'Add')).toBeInTheDocument();
    expect(getByText(day, '1 spot remaining')).toBeInTheDocument();
  });

  it('loads data, edit an interview and update the appointment', async () => {
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, 'Lydia Miller-Jones'));

    const appointment = getAllByTestId(
      container,
      'appointment'
    ).find(appointment => queryByText(appointment, 'Lydia Miller-Jones'));

    fireEvent.click(queryByAltText(appointment, 'Edit'));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: 'Leo Lee' }
    });

    fireEvent.click(getByText(appointment, 'Save'));

    expect(
      getByText(appointment, 'Saving your appointment...')
    ).toBeInTheDocument();

    await waitForElementToBeRemoved(() =>
      getByText(appointment, 'Saving your appointment...')
    );
    expect(getByText(appointment, 'Leo Lee')).toBeInTheDocument();

    const day = getAllByTestId(container, 'day').find(day =>
      queryByText(day, 'Monday')
    );

    expect(getByText(day, '1 spot remaining')).toBeInTheDocument();
  });

  it('shows the save error when failing to save an appointment', async () => {
    axios.put.mockRejectedValueOnce();

    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, 'Leo Lee'));

    const appointment = getAllByTestId(
      container,
      'appointment'
    ).find(appointment => queryByText(appointment, 'Leo Lee'));

    fireEvent.click(queryByAltText(appointment, 'Edit'));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: 'Leo' }
    });

    fireEvent.click(getByText(appointment, 'Save'));

    expect(
      getByText(appointment, 'Saving your appointment...')
    ).toBeInTheDocument();

    await waitForElementToBeRemoved(() =>
      getByText(appointment, 'Saving your appointment...')
    );

    expect(
      queryByText(appointment, 'Connection Error: Appointment is not saved.')
    ).toBeInTheDocument();
    fireEvent.click(getByAltText(appointment, 'Close'));
    expect(queryByText(appointment, 'Leo Lee')).toBeInTheDocument();

    const day = getAllByTestId(container, 'day').find(day =>
      queryByText(day, 'Monday')
    );

    expect(getByText(day, '1 spot remaining')).toBeInTheDocument();
  });

  it('shows the delete error when failing to delete an existing appointment', async () => {
    axios.delete.mockRejectedValueOnce();

    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, 'Leo Lee'));

    const appointment = getAllByTestId(
      container,
      'appointment'
    ).find(appointment => queryByText(appointment, 'Leo Lee'));

    fireEvent.click(queryByAltText(appointment, 'Delete'));

    expect(getByText(appointment, 'Confirm Deletion?')).toBeInTheDocument();

    fireEvent.click(getByText(appointment, 'Confirm'));

    expect(
      getByText(appointment, 'Deleting your appointment...')
    ).toBeInTheDocument();

    await waitForElementToBeRemoved(() =>
      getByText(appointment, 'Deleting your appointment...')
    );

    expect(
      queryByText(appointment, 'Connection Error: Appointment is not deleted.')
    ).toBeInTheDocument();
    fireEvent.click(getByAltText(appointment, 'Close'));
    expect(queryByText(appointment, 'Leo Lee')).toBeInTheDocument();

    const day = getAllByTestId(container, 'day').find(day =>
      queryByText(day, 'Monday')
    );

    expect(getByText(day, '1 spot remaining')).toBeInTheDocument();
  });
});
