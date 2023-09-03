import axios from "axios";
import { BASE_URL } from "../Constants";

const ShipprAxios = axios.create({
    baseURL:BASE_URL,
    headers:{
        Authorization:
        localStorage.getItem('access-token') ? 
        'Bearer ' + localStorage.getItem('access-token')
        :
        null,
        'Content-Type':'application/json',
        accept:'application/json',
    }
    
})


ShipprAxios.interceptors.request.use(config => {

    let userData = localStorage.getItem('logged_user')

     if (!config.headers['Authorization'] && userData) {
        
        const token = localStorage.getItem('access-token');
        if (token) {
          config.headers.Authorization = "Bearer " + token;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);    
    })


export default ShipprAxios