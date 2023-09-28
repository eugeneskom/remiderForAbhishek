import React, { useState, useRef, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { Accordion } from 'react-bootstrap';
import axios from 'axios';

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getContrastColor(hexColor) {
  // Convert hex color to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Calculate luminance (brightness)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return white or black text color based on luminance
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

function hasDueDatePassed(dueDate) {
  const currentDate = new Date();
  return new Date(dueDate) < currentDate;
}

function checkDueDateStatus(dueDate) {
  if (dueDate === null) {
    // Return null when dueDate is null
    return null;
  }

  const currentDate = new Date();
  const dueDateObj = new Date(dueDate);

  // Check if the due date is overdue
  if (dueDateObj < currentDate) {
    return "border-danger";
  }

  // Calculate the date for tomorrow
  const tomorrow = new Date(currentDate);
  tomorrow.setDate(currentDate.getDate() + 1);

  // Check if the due date is tomorrow or in the future
  if (dueDateObj >= tomorrow) {
    return "border-warning";
  }

  // If none of the above conditions are met, the due date is today
  return "border-success";
}


function checkDueDateStatuses(reminders) {
  const currentDate = new Date();
  const statuses = [];

  reminders.forEach((reminder) => {
    if (reminder.scheduledEnd !== null) {
      const dueDateObj = new Date(reminder.scheduledEnd);

      // Check if the due date is overdue
      if (dueDateObj < currentDate) {
        statuses.push("bg-danger");
      }
      // Calculate the date for tomorrow
      const tomorrow = new Date(currentDate);
      tomorrow.setDate(currentDate.getDate() + 1);

      // Check if the due date is tomorrow or in the future
      if (dueDateObj >= tomorrow) {
        statuses.push("bg-warning");
      }
      // If none of the above conditions are met, the due date is today
      else {
        statuses.push("bg-success");
      }
    }
    // If scheduledEnd is null, do nothing for this reminder.
  });

  return statuses;
}





function ReminderList({ remindersList, fetchTasks }) {

  async function sendUpdateTaskRequest(task) {
    const { id, statusCode } = task;
    try {
      const requestConfig = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'x-user-token': 'PKH8Q~XnWPU1GPYAXJgDFRgEeTqLEjzfvt7XrbWI',
        },
        data: [
          {
            Id: String(id),
            StatusCode: String(statusCode),
          },
        ],
        url: 'https://nlr.azurewebsites.net/api/CRMPlatform/Sales/Appointment/V1/UpdateTask',
      };

      const response = await axios(requestConfig);

      // Handle the response here
      const responseObject = JSON.parse(response.data)
      if (responseObject.SuccessResponse == true) {
        console.log('API call was successful');
        fetchTasks();
        // Handle success here
      } else {
        console.error('API call was not successful');
        // Handle failure here
      }
      console.log('Response:', response.data);
    } catch (error) {
      // Handle errors here
      console.error('Error:', error.message);
    }
  }

  return (
    <Accordion>
      {Object.keys(remindersList).map((subject, index) => {


        {
          const statusCircles = checkDueDateStatuses(remindersList[subject]);
        }
        return (
          <Accordion.Item eventKey={index} key={index}
          >

            <Accordion.Header className='position-relative'>
              {subject} ({remindersList[subject]?.length})
              <div className="circles position-absolute d-flex gap-1"
                style={{ right: "3rem" }}
              >
                {

                  console.log(remindersList[subject], subject)
                }
                {
                  checkDueDateStatuses(remindersList[subject]).map((status, index) => (
                    <div key={index} className={`rounded-circle ${status} border-danger p-2`}></div>
                  ))}
              </div>
            </Accordion.Header>
            <Accordion.Body
              className='d-flex gap-3 flex-wrap'>
              {remindersList[subject].map((reminder) => (
                <div key={reminder.id}
                  className={`p-2 rounded border border-2 ${checkDueDateStatus(reminder.scheduledEnd)}`}
                  style={{
                    // backgroundColor: getRandomColor(), color: getContrastColor(getRandomColor()),
                    // backgroundBlendMode: 'overlay',
                    // color: '#fff',
                  }}
                >
                  <Form.Check // prettier-ignore
                    type="switch"
                    id="custom-switch"
                    label="Complete"
                    onChange={() => sendUpdateTaskRequest(reminder)}
                  />
                  <h6>
                    {reminder.description}
                  </h6>
                  <p>{reminder.scheduledEnd}</p>
                </div>
              ))}
            </Accordion.Body>
          </Accordion.Item>
        )
      })}
    </Accordion>
  );
}


export default ReminderList;
