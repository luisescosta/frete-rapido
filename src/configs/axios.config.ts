import axios from 'axios';

export const freteRapidoApi = axios.create({
  baseURL: 'https://sp.freterapido.com',
});
