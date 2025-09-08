import axios from "axios";

const BASE_URL = "http://localhost:8080/api/auth";

export const register = async (email, password) => {
  const res = await axios.post(`${BASE_URL}/register?email=${email}&password=${password}`);
  return res.data;
};

export const login = async (email, password) => {
  const res = await axios.post(`${BASE_URL}/login?email=${email}&password=${password}`);
  return res.data;
};
