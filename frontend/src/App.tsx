import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import VisuospatialTest from "./pages/VisuospatialTest";
import NamingTest from "./pages/NamingTest";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<div className="p-8 text-center text-slate-600">Login Page (WIP)</div>} />
      <Route path="/test/start" element={<div className="p-8 text-center text-slate-600">Start Test Page (WIP)</div>} />
      <Route path="/tests/:testId/visuospatial" element={<VisuospatialTest />} />
      <Route path="/tests/:testId/naming" element={<NamingTest />} />
    </Routes>
  );
}
