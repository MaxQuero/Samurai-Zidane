import axios from 'axios';
import Constants from "./Constants";
const baseURL = Constants.BASE_URL;

export default axios.create( {
    baseURL
})