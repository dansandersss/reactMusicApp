import style from "./global.module.scss";
import Thundering2Clouds from "./components/CloudsBg/Thundering2Clouds";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPgae/MainPage";
import AudioProvider from "./context/AudioContext";

export default function App() {
  return (
    <>
      <AudioProvider>
        <div className={style.wrapper}>
          <Router>
            <Routes>
              <Route path="/mainPage/:albumId" element={<MainPage />} />
              <Route path="/" element={<Thundering2Clouds />} />
            </Routes>
          </Router>
        </div>
      </AudioProvider>
    </>
  );
}
