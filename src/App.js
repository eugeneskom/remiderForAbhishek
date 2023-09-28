import { useState, useRef, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import Header from './components/Header';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Form from "react-bootstrap/Form";
import { Container } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown'
import axios from 'axios';
import { getCurrentFormattedDate, refactorToAMPM, formatTime, convertToUTC, mapTasks } from './libs/helpers';
import { getTaskTypes } from './api-requests/getTaskTypes';
import { getTasks } from './api-requests/getTasks';

import ReminderList from './components/ReminderList';


const token = 'PKH8Q~XnWPU1GPYAXJgDFRgEeTqLEjzfvt7XrbWI';
const ownerId = 'bcbfcbe5-5b6b-e911-a9c1-000d3a3abdb6';
const patientId = 'e5c18358-6564-ed11-9561-0022480813af';

function App() {

  const minDate = new Date()
  const dateObj = new Date();
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const formattedDate = `${year}/${month}/${day} ${hours}:${minutes}`;
  const currentDate = new Date();

  const [isAddReminder, setIsAddReminder] = useState(false)
  const [isRecurence, setIsRecurence] = useState(false)
  const [reminder, setReminder] = useState({
    date: null,
    type: '',
    recurrence: isRecurence ? reccuurenceTypes[0]?.recurrenceType : "",
    description: ''
  })
  const [isReminderValid, setIsReminderValid] = useState({
    date: true,
    type: true,
    description: true
  })

  const [remindersList, setRemindersList] = useState([])
  const [reccuurenceTypes, setReccuurenceTypes] = useState([])
  const [taskTypes, setTaskTypes] = useState([])



  console.log('isReminderValid', isReminderValid)
  // Handle the change event to update the selected value
  const toggleAddReminder = () => {
    setIsAddReminder(!isAddReminder)
    setReminder({ ...reminder, recurrence: reccuurenceTypes[0]?.recurrenceType })
  }

  const handleSelectReminder = (e) => {
    setReminder({ ...reminder, type: e.target.value })
    setIsReminderValid({ ...isReminderValid, type: e.target.value !== '' })
  };

  const handleDateTimeChange = (newDateTime) => {
    console.log('newDateTime', newDateTime)
    const formattedDate = dayjs(newDateTime.$d).format("MM/DD/YYYY HH:mm");
    setReminder({ ...reminder, date: formattedDate })
    setIsReminderValid({ ...isReminderValid, date: formattedDate !== null })
  };

  const handleSetRecurrence = (value) => {
    setReminder({ ...reminder, recurrence: value })
  }

  const handleDescription = (e) => {
    setReminder({ ...reminder, description: e.target.value })
    setIsReminderValid({ ...isReminderValid, description: e.target.value !== '' })
  }

  const areAllValuesValid = (validatedReminder) => {
    return Object.values(validatedReminder).every((isValid) => isValid);
  };


  async function sendPostTaskRequest() {
    const url = "https://nlr.azurewebsites.net/api/CRMPlatform/Sales/Appointment/V1/PostTask";

    const headers = {
      accept: "application/json",
      "x-user-token": "PKH8Q~XnWPU1GPYAXJgDFRgEeTqLEjzfvt7XrbWI",
      "Content-Type": "application/json", // Set Content-Type to application/json
    };
    const validatedReminder = {
      date: reminder.date ? true : false,
      type: reminder.type ? true : false,
      description: reminder.description ? true : false
    }



    const params = [
      {
        "StartTime": "9/26/2023 1:00:00 PM",
        "DueDate": reminder.date,
        "Subject": reminder.type,
        "Description": reminder.description,
        "CreatedBy": "bcbfcbe5-5b6b-e911-a9c1-000d3a3abdb6",
        "TaskType": reminder.type,
        "Recurrence": isRecurence,
        "RecurringType": isRecurence ? reminder.recurrence : "None",
        "Patient": "e5c18358-6564-ed11-9561-0022480813af"
      }
    ];
    console.log('params', params)
    setIsReminderValid(validatedReminder)
    const isReminderValid = areAllValuesValid(validatedReminder)
    if (!isReminderValid) return;
    console.log('if', isReminderValid)
    setIsAddReminder(false)
    setIsRecurence(false)
    setReminder(prev => ({ ...prev, date: null, type: '', recurrence: "None", description: '' }))

    const startTime = getCurrentFormattedDate()
    const requestBody = [
      {
        "StartTime": convertToUTC(formattedDate),
        // StartTime: "9/26/2023 1:00:00 PM",
        // DueDate: reminder.date,
        "DueDate": convertToUTC(reminder.date),
        "Subject": reminder.type,
        "Description": reminder.description,
        "CreatedBy": "bcbfcbe5-5b6b-e911-a9c1-000d3a3abdb6",
        "TaskType": reminder.type,
        "Recurrence": String(isRecurence),
        "RecurringType": isRecurence ? reminder.recurrence : "None",
        "Patient": "e5c18358-6564-ed11-9561-0022480813af"
      }
    ];


    const axiosConfig = {
      method: "post",
      url: url,
      headers: headers,
      data: requestBody,
    };

    try {
      const response = await axios(axiosConfig);

      if (response.status !== 200) {
        // Handle non-successful responses here
        throw new Error(`Request failed with status: ${response.status}`);
      }
      fetchTasks()
      return response.data;
    } catch (error) {
      // Handle any errors that occurred during the request
      throw error;
    }
  }


  // Usage example:
  async function submitNewTask() {
    try {
      const responseData = await sendPostTaskRequest();
      console.log("Response Data:", responseData);
      // Handle the response data as needed
    } catch (error) {
      console.error("Error:", error);
      // Handle errors
    }
  }

  // Call submitNewTask when needed, e.g., in a button click event handler


  async function getRecurrenceType(token) {
    try {
      const url = 'https://nlr.azurewebsites.net/api/CRMPlatform/Sales/Appointment/V1/GetRecurrenceType';
      const headers = {
        'accept': 'text/plain',
        'x-user-token': token,
        'Prefer': 'odata.include-annotations="OData.Community.Display.V1.FormattedValue"'
      };

      const response = await fetch(url, {
        method: 'GET',
        headers: headers
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  // Usage example:
  async function fetchTasks() {
    try {
      const tasks = await getTasks(ownerId, patientId, token);

      const mappedTasks = mapTasks(tasks);
      console.log(mappedTasks, 'mappedTasks')
      setRemindersList(mappedTasks)
      console.log("Tasks:", tasks);
      return mappedTasks;
      // Handle the tasks data as needed
    } catch (error) {
      console.error("Error:", error);
      // Handle errors
    }
  }

  console.log('remindersList', remindersList)


  useEffect(() => {
    fetchTasks()
    getRecurrenceType(token)
      .then(reccTypes => {
        setReccuurenceTypes(reccTypes)
        console.log('dataRecurrence', reccTypes)
      })
      .catch(error => console.log('error', error))

    getTaskTypes({ ownerId, patientId, token })
      .then(taskTypes => {
        setTaskTypes(taskTypes)
      })
      .catch(error => console.log('error', error))
    return () => {

    }
  }, [])


  console.log(taskTypes, 'taskTypes')


  return (
    <>
      <Header onBtnClick={toggleAddReminder} />
      <main>
        <Container>
          {isAddReminder && (
            <div className="add-reminder-wrapper">
              <LocalizationProvider dateAdapter={AdapterDayjs}
              >
                <DateTimePicker
                  value={reminder.date}
                  onChange={handleDateTimeChange}
                  ampm={false}
                  minDate={dayjs(currentDate)}
                  referenceDate={dayjs(formattedDate)}
                  className={`${isReminderValid.date ? '' : 'border-danger'}`}
                />
              </LocalizationProvider>
              <div className="col-md-6">

                <Form.Select
                  className={`mt-5 ${isReminderValid.type ? '' : 'border-danger'}`}
                  aria-label="Please select a reminder type"
                  value={reminder.type} // Bind the selected value to the state variable
                  onChange={handleSelectReminder} // Set the state variable to the value selected by the user
                >
                  <option value="">Please select a reminder type</option>
                  {taskTypes.map((option, index) => (
                    <option key={option.taskType} value={option.taskType}>{option.taskType}</option>
                  ))}

                </Form.Select>
              </div>

              <Form className='mt-5 mb-5'>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label="Recurrence"
                  checked={isRecurence}
                  onChange={(e) => setIsRecurence(e.target.checked)}
                />
              </Form>

              {isRecurence && (
                <div className="radio-btns d-flex flex-column gap-3 mb-5">
                  {
                    reccuurenceTypes.map((option, index) => (
                      <Form.Check
                        key={option.recurrenceType}
                        inline
                        label={option.recurrenceType}
                        name="recurrence"
                        type={'radio'}
                        checked={reminder.recurrence === option.recurrenceType}
                        onClick={() => handleSetRecurrence(option.recurrenceType)}
                      />
                    ))
                  }
                </div>
              )}

              <div className="description mb-5 col-md-6">
                <Form>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Description</Form.Label>
                    <Form.Control className={`${isReminderValid.description ? '' : 'border-danger'}`} as="textarea" rows={5} value={reminder.description} onChange={handleDescription} />
                  </Form.Group>
                  <Button className='my-auto' onClick={submitNewTask}>Submit</Button>
                  {/* <Button className='my-auto' onClick={submitReminder}>Submit</Button> */}
                </Form>

              </div>
            </div>
          )}


          <div className="reminders-list">
            <h5>List of reminders</h5>
            <ReminderList remindersList={remindersList} fetchTasks={fetchTasks} />
          </div>


        </Container>

      </main>
    </>
  );
}

export default App;
