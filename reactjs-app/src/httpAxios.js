import axios from "axios";
import { urlAPI } from "./config";

const httpAxios = axios.create({
  baseURL: urlAPI,
  headers: {
    "X-Custom-Header": "foobar"
  },
});
httpAxios.interceptors.request.use(config => {
  const UserAdmin = sessionStorage.getItem('useradmin');
  if (UserAdmin) {
    const token = JSON.parse(UserAdmin).token;
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    const User = sessionStorage.getItem('user');
    if (User) {
      const token = JSON.parse(User).token;
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  // console.log(config.headers.Authorization);
  return config;
});

httpAxios.interceptors.response.use((response) => {
  return response.data;
});

export default httpAxios;