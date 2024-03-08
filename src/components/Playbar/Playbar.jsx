import React, { useContext, useState, useEffect } from "react";
import { AudioContext } from "../../context/AudioContext";
import style from "./playbar.module.scss";
import { Slider, IconButton } from "@mui/material";
import {
  NotInterested,
  Pause,
  PlayArrow,
  Shuffle,
  SkipNext,
  SkipPrevious,
} from "@mui/icons-material";
import secondsToMMSS from "../../utils/secondsToMMSS";

const TimeControls = () => {
  const { audio, currentTrack } = useContext(AudioContext);

  const duration = currentTrack ? currentTrack.duration : 0;

  const [currentTime, setCurrentTime] = useState(0);
  const formattedCurrentTime = secondsToMMSS(currentTime);
  const sliderCurrentTime = Math.round((currentTime / duration) * 100);

  const handleChangeCurrentTime = (_, value) => {
    const time = Math.round((value / 100) * duration);
    setCurrentTime(time);
    audio.currentTime = time;
  };

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(audio.currentTime);
    }, 1000);

    return () => clearInterval(timeInterval);
  }, [audio]);

  return (
    <>
      <p>{formattedCurrentTime}</p>
      <Slider
        step={1}
        min={0}
        max={100}
        value={sliderCurrentTime}
        onChange={handleChangeCurrentTime}
      />
    </>
  );
};

const Playbar = ({ albumId }) => {
  const {
    handlePrevTrack,
    handleToggleAudio,
    handleNextTrack,
    toggleShuffle,
    isShuffled,
    currentTrack,
    setCurrentTrack,
    isPlaying,
    defaultTrack,
  } = useContext(AudioContext);

  let albumStyle = "";
  switch (albumId) {
    case "midnights":
      albumStyle = style.midnightsAlbumStyle;
      break;
    case "folklore":
      albumStyle = style.folkloreAlbumStyle;
      break;
    case "evermore":
      albumStyle = style.evermoreAlbumStyle;
      break;
    default:
      albumStyle = "";
  }

  const { title, artists, preview, duration } =
    currentTrack || defaultTrack || {};
  const formattedDuration = secondsToMMSS(duration || 0);

  const [currentTime, setCurrentTime] = React.useState(0);

  return (
    <div className={`${style.playbar} ${albumStyle}`}>
      <div className={style.creditDiv}>
        <div>
          <img className={style.preview} src={preview} alt="" />
        </div>
        <div className={style.credits}>
          <h4>{title}</h4>
          <p>{artists}</p>
        </div>
      </div>

      <div className={style.slider}>
        <TimeControls
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
        />
        <p>{formattedDuration}</p>
      </div>

      <div className={style.playbarButtons}>
        <IconButton onClick={handlePrevTrack}>
          <SkipPrevious />
        </IconButton>
        <IconButton
          onClick={() => handleToggleAudio(currentTrack || defaultTrack)}
        >
          {isPlaying ? <Pause /> : <PlayArrow />}
        </IconButton>
        <IconButton onClick={handleNextTrack}>
          <SkipNext />
        </IconButton>
        <IconButton onClick={toggleShuffle}>
          {isShuffled ? <Shuffle /> : <NotInterested />}
        </IconButton>
      </div>
    </div>
  );
};

export default Playbar;
