import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
const TOKEN_B = process.env.EXPO_PUBLIC_TOKEN_B;

const bibleUrl = "https://www.abibliadigital.com.br/api";

const api = axios.create({
  baseURL: BASE_URL,
});

const bible = axios.create({
  baseURL: bibleUrl,
  headers: {
    Authorization: `Bearer ${TOKEN_B}`,
  },
});

export { api, bible };
