import axios from 'axios'

const client = axios.create({
  baseURL: 'https://ecommerce.routemisr.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const signIn = (body) => client.post('/auth/signin', body)
export const signUp = (body) => client.post('/auth/signup', body)
