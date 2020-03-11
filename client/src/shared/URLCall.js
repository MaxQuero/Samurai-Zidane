import axios from 'axios';

const baseURL = "http://localhost:4000";
export default axios.create( {
    baseURL
})