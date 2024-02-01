import React, { createContext, useState, useEffect } from "react";
import tracksList from "../assets/tracksList";

const defaultTrack = tracksList[0];
const audio = new Audio(defaultTrack.src);

export const AudioContext = createContext({});

const useAudioPlayer = () => {
  const [currentTrack, setCurrentTrack] = useState(defaultTrack);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setPlaying] = useState(false);
  const [isShuffled, setShuffled] = useState(false);
  const [shuffledTracks, setShuffledTracks] = useState([]);
  const [activeShuffle, setActiveShuffle] = useState(false);

  const shuffleTracks = () => {
    const shuffled = [...tracksList];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setShuffledTracks(shuffled);
  };

  const toggleShuffle = () => {
    setShuffled((prev) => !prev);
    setActiveShuffle((prev) => !prev);
  };

  const getCurrentPlaylist = () => (isShuffled ? shuffledTracks : tracksList);

  const handleNextTrack = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % getCurrentPlaylist().length;
      setCurrentTrack(getCurrentPlaylist()[nextIndex]);
      audio.src = getCurrentPlaylist()[nextIndex].src;
      return nextIndex;
    });
  };

  const handlePrevTrack = () => {
    setCurrentIndex((prevIndex) => {
      const prevIndexValue = prevIndex - 1;
      const newIndex =
        prevIndexValue < 0 ? getCurrentPlaylist().length - 1 : prevIndexValue;

      setCurrentTrack(getCurrentPlaylist()[newIndex]);
      audio.src = getCurrentPlaylist()[newIndex].src;
      return newIndex;
    });
  };

  const handleToggleAudio = (track) => {
    if (currentTrack.id !== track.id) {
      setCurrentTrack(track);
      setPlaying(true);
    } else {
      if (isPlaying) {
        audio.pause();
        setPlaying(false);
      } else {
        audio.play().catch((error) => console.error(error));
        setPlaying(true);
      }
    }
  };

  useEffect(() => {
    const handleEnded = () => {
      handleNextTrack();
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audio, handleNextTrack]);

  useEffect(() => {
    if (audio.ended) {
      handleNextTrack();
    }
  }, [audio, isPlaying, handleNextTrack, isShuffled]);

  useEffect(() => {
    if (isPlaying) {
      audio.play().catch((error) => console.error(error));
    }
  }, [currentTrack, isPlaying, isShuffled]);

  useEffect(() => {
    if (activeShuffle) {
      shuffleTracks();
    }
  }, [activeShuffle, shuffleTracks]);

  return {
    audio,
    currentTrack,
    isPlaying,
    currentIndex,
    handleToggleAudio,
    handleNextTrack,
    handlePrevTrack,
    shuffleTracks,
    toggleShuffle,
    isShuffled,
  };
};

const AudioProvider = ({ children }) => {
  const audioPlayer = useAudioPlayer();

  return (
    <AudioContext.Provider value={audioPlayer}>
      {children}
    </AudioContext.Provider>
  );
};

export default AudioProvider;
