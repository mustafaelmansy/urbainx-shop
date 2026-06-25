import axios from 'axios'

const client = axios.create({
  baseURL: 'https://ecommerce.routemisr.com/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

export const getCategories = () => client.get('/categories')
export const getProducts = (params = {}) => client.get('/products', { params })
export const getProduct = (id) => client.get(`/products/${id}`)

export default client
