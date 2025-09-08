import axios from "axios";

const BASE_URL = "http://localhost:8080/api/league";

export const createLeague = async (name) => {
  const res = await axios.post(`${BASE_URL}/create?name=${name}`);
  return res.data;
};

export const joinLeague = async (inviteCode, teamName) => {
  const res = await axios.post(`${BASE_URL}/join?inviteCode=${inviteCode}&teamName=${teamName}`);
  return res.data;
};

export const getLeague = async (inviteCode) => {
  const res = await axios.get(`${BASE_URL}?inviteCode=${inviteCode}`);
  return res.data;
};
