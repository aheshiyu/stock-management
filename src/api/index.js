import axios from 'axios'

const gasApi = axios.create({
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
  }
})

const apiUrl = localStorage.getItem('api_url')
// const apiUrl = ''

const fetch_func = (data) => {
  console.log(data)
  return fetch(apiUrl, {
    "method": "POST",
    "mode": "no-cors",
    "Content-Type": "application/x-www-form-urlencoded",
    "body": JSON.stringify(data)
  })
}

const fetch_data = () => {
  return gasApi.get(apiUrl)
}

const delete_data = (item) => {
  const data = {
    method: "DELETE",
    params: {
      item
    }
  }
  return fetch_func(data)
}

const update_data = (item) => {
  const data = {
    method: "UPDATE",
    params: {
      item
    }
  }
  return fetch_func(data)
}

const update_list = (items) => {
  const data = {
    method: "UPDATE_LIST",
    params: {
      items
    }
  }
  return fetch_func(data)
}

export default {
  fetch_func,
  fetch_data,
  delete_data,
  update_data,
  update_list,
}