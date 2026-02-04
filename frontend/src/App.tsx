import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import VisuospatialTest from "./pages/VisuospatialTest";
import NamingTest from "./pages/NamingTest";
import MemoryTest from "./pages/MemoryTest";
import AttentionTest from "./pages/AttentionTest";
import LanguageTest from "./pages/LanguageTest";
import AbstractionTest from "./pages/AbstractionTest";
import DelayedRecallTest from "./pages/DelayedRecallTest";
import OrientationTest from "./pages/OrientationTest";
import FinalReport from "./pages/FinalReport";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<div className="p-8 text-center text-slate-600">Login Page (WIP)</div>} />
      <Route path="/test/start" element={<div className="p-8 text-center text-slate-600">Start Test Page (WIP)</div>} />
      <Route path="/tests/:testId/visuospatial" element={<VisuospatialTest />} />
      <Route path="/tests/:testId/naming" element={<NamingTest />} />
      <Route path="/tests/:testId/memory" element={<MemoryTest />} />
      <Route path="/tests/:testId/attention" element={<AttentionTest />} />
      <Route path="/tests/:testId/language" element={<LanguageTest />} />
      <Route path="/tests/:testId/abstraction" element={<AbstractionTest />} />
      <Route path="/tests/:testId/delayed-recall" element={<DelayedRecallTest />} />
      <Route path="/tests/:testId/orientation" element={<OrientationTest />} />
      <Route path="/tests/:testId/report" element={<FinalReport />} />
    </Routes>
  );
}
