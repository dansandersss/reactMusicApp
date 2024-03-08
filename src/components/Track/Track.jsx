// Track.js
import { useContext } from "react";
import { AudioContext } from "../../context/AudioContext";
import style from "./track.module.scss";
import { IconButton } from "@mui/material";
import { PlayArrow, Pause } from "@mui/icons-material";
import secondsToMMSS from "../../utils/secondsToMMSS";
import cn from "classnames";

const Track = ({ id, preview, title, artists, duration, albumId }) => {
  const { handleToggleAudio, currentTrack, isPlaying } =
    useContext(AudioContext);
  const isCurrentTrack = currentTrack && currentTrack.id === id;

  const formattedDuration = secondsToMMSS(duration);

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

  return (
    <div
      className={cn(style.track, albumStyle, {
        [style.playing]: isCurrentTrack && isPlaying,
      })}
    >
      <IconButton
        onClick={() =>
          handleToggleAudio({ id, preview, title, artists, duration })
        }
      >
        {isCurrentTrack && isPlaying ? <Pause /> : <PlayArrow />}
      </IconButton>
      <img className={style.preview} src={preview} alt="" />
      <div className={style.credits}>
        <b>{title}</b>
        <p>{artists}</p>
      </div>
      <p>{formattedDuration}</p>
    </div>
  );
};

export default Track;
