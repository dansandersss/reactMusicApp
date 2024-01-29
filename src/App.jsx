import { useState } from "react";
import MainPage from "./pages/MainPgae/MainPage";
import style from "./global.module.scss";
import Playbar from "./components/Playbar/Playbar";

export default function App() {
  return (
    <>
      <div className={style.wrapper}>
        <MainPage />
        <Playbar />
      </div>
    </>
  );
}
