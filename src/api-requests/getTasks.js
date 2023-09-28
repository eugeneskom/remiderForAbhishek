import axios from "axios";
export async function getTasks(ownerId, patientId, token) {
  const url = `https://nlr.azurewebsites.net/api/CRMPlatform/Sales/Appointment/V1/GetTasks?ownerId=${ownerId}&patientId=${patientId}`;

  const headers = {
    accept: "text/plain",
    "x-user-token": token,
  };

  const axiosConfig = {
    method: "get",
    url: url,
    headers: headers,
  };

  try {
    const response = await axios(axiosConfig);

    if (response.status !== 200) {
      // Handle non-successful responses here
      throw new Error(`Request failed with status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    // Handle any errors that occurred during the request
    throw error;
  }
}