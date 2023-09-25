import { useState, useRef } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
// import Container from 'react-bootstrap/Container';
import Header from './components/Header';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Form from "react-bootstrap/Form";
import { ButtonToolbar, ToggleButtonGroup, ToggleButton, FloatingLabel, Container } from 'react-bootstrap';
import Box from '@mui/material/Box';
import Dropdown from 'react-bootstrap/Dropdown'
const recurrenceOptions = [
  { label: "Weekly" },
  { label: "Biweekly" },
  { label: "Triweekly" },
  { label: "Monthly" },
];

const reminderOptions = [
  { label: "Follow up" },
  { label: "Call back" },
  { label: "Review" },
  { label: "Meeting" },
  { label: "Deadline" },
];

function App() {

  const minDate = new Date()
  const dateObj = new Date();
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
  const currentDate = new Date();

  const [isAddReminder, setIsAddReminder] = useState(false)
  const [dateTime, setDateTime] = useState(null);
  const [isRecurence, setIsRecurence] = useState(false)
  const [reminderType, setReminderType] = useState('')
  const [reminder, setReminder] = useState({
    date: null,
    type: '',
    recurrence: isRecurence ? recurrenceOptions[0].label : "",
    description: ''
  })
  const [isReminderValid, setIsReminderValid] = useState({
    date: true,
    type: true,
    description: true
  })

  console.log('isReminderValid',isReminderValid)
  // Handle the change event to update the selected value
  const toggleAddReminder = () => {
    setIsAddReminder(!isAddReminder)
    setReminder({ ...reminder, recurrence: recurrenceOptions[0].label })
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

  const submitReminder = async () => {
    const validatedReminder = {
      date: reminder.date ? true : false,
      type: reminder.type ? true : false,
      description: reminder.description ? true : false
    }
    setIsReminderValid(validatedReminder)
    const isReminderValid = areAllValuesValid(validatedReminder)
    if (isReminderValid) {
      console.log('if', isReminderValid)
    } else {
      console.log('else', isReminderValid)
    }
    console.log('submitReminder', reminder, 'isReminderValid', isReminderValid)
  }
  const areAllValuesValid = (validatedReminder) => {
    return Object.values(validatedReminder).every((isValid) => isValid);
  };

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
                {/* <p style={{ visibility: `${isReminderValid.date ? "hidden" : "visible"}` }} className='text-danger m-0 mt-1'>Please select the date</p> */}
              </LocalizationProvider>
              <div className="col-md-6">

                <Form.Select
                  className={`mt-5 ${isReminderValid.type ? '' : 'border-danger'}`}
                  aria-label="Please select a reminder type"
                  value={reminder.type} // Bind the selected value to the state variable
                  onChange={handleSelectReminder} // Set the state variable to the value selected by the user
                >
                  <option value="">Please select a reminder type</option>
                  {reminderOptions.map((option, index) => (
                    <option key={option.label} value={option.label}>{option.label}</option>
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
                    recurrenceOptions.map((option, index) => (
                      <Form.Check
                        key={option.label}
                        inline
                        label={option.label}
                        name="recurrence"
                        type={'radio'}
                        checked={reminder.recurrence === option.label}
                        // checked={reminder.recurrence === option.label}
                        onClick={() => handleSetRecurrence(option.label)}
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
                  <Button className='my-auto' onClick={submitReminder}>Submit</Button>
                </Form>
              </div>
            </div>
          )}


          <div className="reminders-list">
            <h5>List of reminders</h5>

            <Dropdown className='mb-3'>
              <Dropdown.Toggle variant="outline-danger" id="dropdown-basic" className='w-100 text-start'>
                Follow up
              </Dropdown.Toggle>

              <Dropdown.Menu className='w-100 text-start'>
                <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown className='mb-3'>
              <Dropdown.Toggle variant="outline-warning" id="dropdown-basic" className='w-100 text-start'>
                Call back
              </Dropdown.Toggle>

              <Dropdown.Menu className='w-100 text-start'>
                <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown className='mb-3'>
              <Dropdown.Toggle variant="outline-success" id="dropdown-basic" className='w-100 text-start'>
                Check Patent
              </Dropdown.Toggle>

              <Dropdown.Menu className='w-100 text-start'>
                <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>


        </Container>

      </main>
    </>
  );
}

export default App;
