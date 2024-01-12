/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios'
const baseUrl = `${process.env.REACT_APP_BACKEND_URL}/persons`
//const baseUrl = 'http://localhost:3001/api/persons'
//const baseUrl = 'https://phonebook-backend-ntn5.onrender.com/api/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const remove = id => {
  return axios.delete(`${baseUrl}/${id}`)
}

export default { 
  getAll: getAll, 
  create: create,
  remove: remove, 
}