import { useState } from "react";
import tracksList from "../../assets/tracksList";
import Track from "../../components/Track/Track";
import style from "./mainPage.module.scss";
import { Input } from "@mui/material";

const runSearch = (query) => {
  if (!query) {
    return tracksList;
  }

  const lowerCaseQuery = query.toLowerCase();

  return tracksList.filter(
    (track) =>
      track.title.toLowerCase().includes(lowerCaseQuery) ||
      track.artists.toLowerCase().includes(lowerCaseQuery)
  );
};

export default function MainPage() {
  const [tracks, setTracks] = useState(tracksList);
  function handleChange(event) {
    const foundTracks = runSearch(event.target.value);

    setTracks(foundTracks);
  }

  return (
    <>
      <div className={style.header}>
        <img
          src="https://github.com/dansandersss/reactMusicApp/blob/master/src/assets/images/500x500.jpg?raw=true"
          alt=""
        />
        <div className={style.textElements}>
          <h1>Midnights (The Till Dawn Edition)</h1>
          <p>Taylor Swift</p>
          <div className={style.headerText}>
            <p>POP</p>
            <p>2022</p>
            <p>Lossless</p>
          </div>
        </div>
      </div>
      <div className={style.search}>
        <Input
          className={style.input}
          placeholder="Поиск трека"
          onChange={handleChange}
        />
        <div className={style.list}>
          {tracks.map((track) => (
            <Track key={track.id} {...track} />
          ))}
        </div>
      </div>
    </>
  );
}
