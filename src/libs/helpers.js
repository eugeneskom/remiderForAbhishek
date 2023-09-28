export function getCurrentFormattedDate() {
  const now = new Date();
  const userLocale = navigator.language; // Get the user's browser locale

  // Create a DateTimeFormat object with the user's locale
  const dateTimeFormatter = new Intl.DateTimeFormat(userLocale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Format the date and time based on the user's locale
  const formattedDate = dateTimeFormatter.format(now);

  return formattedDate;
}


export function refactorToAMPM(dateTimeString) {
  const dateParts = dateTimeString.split(' ');
  const timePart = dateParts[1];
  const timeParts = timePart.split(':');
  let hours = parseInt(timeParts[0], 10);
  const minutes = timeParts[1];

  // Check if the time is already in AM/PM format
  if (hours >= 0 && hours <= 11) {
    return dateTimeString + ':00 AM';
  } else if (hours >= 12 && hours <= 23) {
    if (hours > 12) {
      hours -= 12; // Convert to 12-hour format
    }
    return dateTimeString + ':00 PM';
  } else {
    // Handle invalid input here
    throw new Error('Invalid time format');
  }
}


export function formatTime(inputTime) {
  // Check if the input time contains AM or PM
  if (inputTime.includes('AM') || inputTime.includes('PM')) {
    return inputTime; // Time is already in the desired format with AM/PM
  }

  // Split the input time into date and time parts
  const [datePart, timePart] = inputTime.split(' ');

  // Split the time part into hours and minutes
  const [hours, minutes] = timePart.split(':').map(Number);

  // Determine if it's AM or PM
  const period = hours >= 12 ? 'PM' : 'AM';

  // Convert hours to 12-hour format if needed
  const formattedHours = hours > 12 ? hours - 12 : hours;

  // Format the time with AM/PM
  return `${datePart} ${formattedHours}:${minutes.toString().padStart(2, '0')}:00 ${period}`;
}

export function convertToUTC(inputTime) {
  console.log('inputTime:', inputTime)
  try {
    let date;
    
    // Check if the inputTime is in the format "YYYY/MM/DD HH:mm"
    if (/\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}/.test(inputTime)) {
      date = new Date(inputTime);
    } 
    // Check if the inputTime is in the format "MM/DD/YYYY HH:mm"
    else if (/\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}/.test(inputTime)) {
      // Parse the input time string into a Date object
      const [dateStr, timeStr] = inputTime.split(' ');
      const [month, day, year] = dateStr.split('/');
      const [hours, minutes] = timeStr.split(':');
      date = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00Z`);
    } 
    else {
      throw new Error('Invalid date or time format');
    }

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date or time format');
    }

    // Use the toISOString method to get the UTC time in ISO 8601 format
    const utcTime = date.toISOString();

    return utcTime;
  } catch (error) {
    console.error('Error converting to UTC:', error.message);
    return null; // Return null to indicate an error
  }
}

export const mapTasks = (tasks) => {
  const remindersBySubject = {};

  tasks.forEach((reminder) => {
    const subject = reminder.subject;
    if (!remindersBySubject[subject]) {
      remindersBySubject[subject] = [];
    }
    remindersBySubject[subject].push(reminder);
  });

  return remindersBySubject;
};