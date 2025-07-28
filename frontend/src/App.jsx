import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "../components/Header";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import MediaGallery from "./pages/MediaGallery";
import UploadPage from "./pages/UploadPage";

export default function App() {

  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/media-gallery" element={<MediaGallery />} />
        <Route path="/upload" element={<UploadPage />} />
      </Routes>
    </BrowserRouter>
  );
}
