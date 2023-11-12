import Axios from "axios";

const baseURL = "https://api.github.com/";
export const axios = Axios.create({
  baseURL,
  headers: {
    "X-GitHub-Api-Version": "2022-11-28"
  }
});

export default axios;
