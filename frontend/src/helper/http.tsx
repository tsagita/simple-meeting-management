import axios from 'axios';

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API,
});

export default http;
