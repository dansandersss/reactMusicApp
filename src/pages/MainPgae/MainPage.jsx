import { useState, useContext, useEffect } from "react";
import { Input } from "@mui/material";
import { useParams } from "react-router-dom";
import Track from "../../components/Track/Track";
import style from "./mainPage.module.scss";
import {
  midnightsAlbum,
  folkloreAlbum,
  evermoreAlbum,
} from "../../assets/tracksList";
import { AudioContext } from "../../context/AudioContext";
import Playbar from "../../components/Playbar/Playbar";

const runSearch = (query, tracks) => {
  if (!query) {
    return tracks;
  }

  const lowerCaseQuery = query.toLowerCase();

  return tracks.filter(
    (track) =>
      track.title.toLowerCase().includes(lowerCaseQuery) &&
      (!track.artists.toLowerCase().includes(lowerCaseQuery) ||
        track.title.toLowerCase().includes(lowerCaseQuery))
  );
};

export default function MainPage() {
  const { albumId } = useParams();
  const { setCurrentAlbum } = useContext(AudioContext);
  const [tracks, setTracks] = useState([]);
  const [currentAlbum, setCurrentAlbumState] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    switch (albumId) {
      case "midnights":
        setCurrentAlbumState(midnightsAlbum);
        break;
      case "folklore":
        setCurrentAlbumState(folkloreAlbum);
        break;
      case "evermore":
        setCurrentAlbumState(evermoreAlbum);
        break;
      default:
        setCurrentAlbumState(midnightsAlbum);
    }
  }, [albumId, setCurrentAlbumState]);

  useEffect(() => {
    setCurrentAlbum(currentAlbum);
    setTracks(currentAlbum?.tracks || []);
  }, [currentAlbum, setCurrentAlbum]);

  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredTracks = runSearch(searchQuery, tracks);

  let headerStyle = "";

  switch (albumId) {
    case "midnights":
      headerStyle = style.midnightsHeader;
      break;
    case "folklore":
      headerStyle = style.folkloreHeader;
      break;
    case "evermore":
      headerStyle = style.evermoreHeader;
      break;
    default:
      headerStyle = "";
  }

  return (
    <>
      <div className={`${style.header} ${headerStyle}`}>
        {" "}
        <img src={currentAlbum?.albumCover} alt="" />
        <div className={style.textElements}>
          <h1>{currentAlbum?.title}</h1>
          <p>{currentAlbum?.author}</p>
          <div className={style.headerText}>
            <p>{currentAlbum?.genre}</p>
            <p>{currentAlbum?.year}</p>
            <p>{currentAlbum?.quality}</p>
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
          {filteredTracks.map((track) => (
            <Track albumId={albumId} key={track.id} {...track} />
          ))}
        </div>
      </div>
      <Playbar albumId={albumId} />
    </>
  );
}
