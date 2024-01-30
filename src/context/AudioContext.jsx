import { createContext, useState, useEffect } from "react";
import tracksList from "../assets/tracksList";

const defaultTrack = tracksList[0];

const audio = new Audio(defaultTrack.src);

export const AudioContext = createContext({});

const AudioProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(defaultTrack);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setPlaying] = useState(false);

  const handleNextTrack = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex >= tracksList.length) {
        // Если достигнут конец списка треков, переключаемся на первый трек
        setCurrentTrack(tracksList[0]);
        return 0;
      } else {
        // Переключаемся на следующий трек
        setCurrentTrack(tracksList[nextIndex]);
        return nextIndex;
      }
    });
  };

  useEffect(() => {
    audio.addEventListener("ended", handleNextTrack);
    return () => {
      audio.removeEventListener("ended", handleNextTrack);
    };
  }, []);

  const handleToggleAudio = (track) => {
    if (currentTrack.id !== track.id) {
      setCurrentTrack(track);
      setPlaying(true);

      audio.src = track.src;
      audio.currentTime = 0;
      audio.play();

      return;
    }

    if (isPlaying) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  };

  const value = {
    audio,
    currentTrack,
    isPlaying,
    currentIndex,
    handleToggleAudio,
    handleNextTrack,
  };

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
};

export default AudioProvider;
