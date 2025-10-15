// src/api/api.js
import axios from "axios";

// Base URL for your backend
const API = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true, // if your backend uses cookies for auth
});

// --- User Auth ---
export const registerUser = async (email, password) => {
  try {
    const response = await API.post("/auth/register", null, {
      params: { email, password }, // send as query parameters
    });
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Registration failed" };
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await API.post("/auth/login", null, {
      params: { email, password }, // send as query parameters
    });
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Login failed" };
  }
};

// --- League Management ---
export const createLeague = async (name) => {
  try {
    const response = await API.post("/league/create", null, {
      params: { name }, // query param for backend
    });
    return response.data; // LeagueDTO
  } catch (err) {
    throw err.response?.data || { message: "Failed to create league" };
  }
};

export const joinLeague = async (inviteCode, teamName, userId) => {
  try {
    const response = await API.post("/league/join", null, {
      params: { inviteCode, teamName, userId }, // query params for backend
    });
    return response.data; // TeamDTO
  } catch (err) {
    throw err.response?.data || { message: "Failed to join league" };
  }
};

export const getLeagueByInviteCode = async (inviteCode) => {
  try {
    const response = await API.get("/league", { params: { inviteCode } });
    return response.data; // LeagueDTO
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch league" };
  }
};

export const getAllLeagues = async () => {
  try {
    const response = await API.get("/league/all");
    return response.data; // array of LeagueDTO
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch all leagues" };
  }
};

// --- Draft API ---
export const startDraft = async (leagueId) => {
  try {
    const response = await API.post("/draft/start", null, { params: { leagueId } });
    return response.data; // will be "Draft started" string
  } catch (err) {
    throw err.response?.data || { message: "Failed to start draft" };
  }
};

export const getAvailablePlayers = async (leagueId) => {
  try {
    const response = await API.get("/draft/available", { params: { leagueId } });
    return response.data; // array of DraftPickDTO
  } catch (err) {
    throw err.response?.data || { message: "Failed to get available players" };
  }
};

export const draftPlayer = async (leagueId, teamId, playerId) => {
  try {
    const response = await API.post(
      "/draft/pick",
      null,
      { params: { leagueId, teamId, playerId } }
    );
    return response.data; // DraftPickDTO for the drafted player
  } catch (err) {
    throw err.response?.data || { message: "Failed to draft player" };
  }
};

export const getTeamRoster = async (leagueId, teamId) => {
  try {
    const response = await API.get("/draft/team", { params: { leagueId, teamId } });
    return response.data; // array of DraftPickDTO for the team
  } catch (err) {
    throw err.response?.data || { message: "Failed to get team roster" };
  }
};

export const getDraftStatus = async (leagueId) => {
  try {
    const response = await API.get("/draft/status", { params: { leagueId } });
    return response.data; // draft status object
  } catch (err) {
    throw err.response?.data || { message: "Failed to get draft status" };
  }
};

// --- Player Management ---
export const assignPlayerRole = async (teamId, playerId, role) => {
  try {
    const response = await API.post(
      `/team-players/${teamId}/${playerId}/assign-captain`,
      null,
      { params: { role } } // role must match backend value exactly ("CAPTAIN")
    );
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to assign player role" };
  }
};
