import axios from 'axios'

const BASE_URL = 'http://localhost:5000/api'

const getAuthHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
})

export const loginUser = async (email, password) => {
  const { data } = await axios.post(`${BASE_URL}/auth/login`, {
    email,
    password,
  })
  return data
}

export const registerUser = async (name, email, password) => {
  const { data } = await axios.post(`${BASE_URL}/auth/register`, {
    name,
    email,
    password,
  })
  return data
}

export const getApplications = async (token) => {
  const { data } = await axios.get(`${BASE_URL}/applications`, getAuthHeader(token))
  return data
}

export const createApplication = async (token, applicationData) => {
  const { data } = await axios.post(
    `${BASE_URL}/applications`,
    applicationData,
    getAuthHeader(token)
  )
  return data
}

export const updateApplication = async (token, id, applicationData) => {
  const { data } = await axios.put(
    `${BASE_URL}/applications/${id}`,
    applicationData,
    getAuthHeader(token)
  )
  return data
}

export const deleteApplication = async (token, id) => {
  const { data } = await axios.delete(
    `${BASE_URL}/applications/${id}`,
    getAuthHeader(token)
  )
  return data
}