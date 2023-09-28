import axios from "axios";
export async function getTaskTypes({ownerId,patientId, token}) {
  try {
    const response = await axios.get('https://nlr.azurewebsites.net/api/CRMPlatform/Sales/Appointment/V1/GetTaskType', {
      headers: {
        'accept': 'text/plain',
        'x-user-token': 'PKH8Q~XnWPU1GPYAXJgDFRgEeTqLEjzfvt7XrbWI',
      },
      params: {
        ownerId: 'bcbfcbe5-5b6b-e911-a9c1-000d3a3abdb6',
        patientId: 'e5c18358-6564-ed11-9561-0022480813af',
      },
    });

    // Check if the request was successful
    if (response.status === 200) {
      // Parse and return the data
      return response.data;
    } else {
      // Handle the error here
      console.error('Request failed with status:', response.status);
      return null;
    }
  } catch (error) {
    // Handle any network or other errors
    console.error('Error:', error);
    return null;
  }
}