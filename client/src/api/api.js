import axios from "axios";

const API_BASE = "http://localhost:8080/api";

export const createLeague = (name) => {
  return axios.post(`${API_BASE}/league/create?name=${name}`);
};

export const joinLeague = (inviteCode, teamName) => {
  return axios.post(`${API_BASE}/league/join?inviteCode=${inviteCode}&teamName=${teamName}`);
};

export const getLeague = (inviteCode) => {
  return axios.get(`${API_BASE}/league?inviteCode=${inviteCode}`);
};
