import axios from "axios";

const BASE_URL = import.meta.env.VITE_AUTH_BASE_URL;
// = http://localhost:3000/auth

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export async function login(payload) {
  return (await api.post("/login", payload)).data;
}

export async function register(payload) {
  const res = await api.post("/register", payload);
  return { status: res.status, data: res.data };
}
