import { useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL as string;

export default function App() {
  useEffect(() => {
    axios.get(`${API_URL}/health`).then((res) => console.log(res.data));
  }, []);

  return <h1>MoCA Platform</h1>;
}
