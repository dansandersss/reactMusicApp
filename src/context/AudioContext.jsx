import React, { createContext, useState, useEffect, useRef } from "react";

export const AudioContext = createContext({});

const useAudioPlayer = () => {
  const audioRef = useRef(new Audio());
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setPlaying] = useState(false);
  const [isShuffled, setShuffled] = useState(false);
  const [shuffledTracks, setShuffledTracks] = useState([]);
  const [activeShuffle, setActiveShuffle] = useState(false);
  const [isReady, setReady] = useState(false);

  const audio = audioRef.current;

  const shuffleTracks = () => {
    const shuffled = [...getCurrentPlaylist()];
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

  const getCurrentPlaylist = () =>
    isShuffled && shuffledTracks.length > 0
      ? shuffledTracks
      : currentAlbum.tracks;

  const handleNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % getCurrentPlaylist().length;
      setCurrentTrack(getCurrentPlaylist()[nextIndex]);
      audio.src = getCurrentPlaylist()[nextIndex].src;
      return nextIndex;
    });
  };

  const handlePrevTrack = () => {
    setCurrentTrackIndex((prevIndex) => {
      const newIndex =
        (prevIndex - 1 + getCurrentPlaylist().length) %
        getCurrentPlaylist().length;
      setCurrentTrack(getCurrentPlaylist()[newIndex]);
      audio.src = getCurrentPlaylist()[newIndex].src;
      return newIndex;
    });
  };

  const handleToggleAudio = (track) => {
    const trackIndex = currentAlbum.tracks.findIndex((t) => t.id === track.id);

    if (trackIndex === -1) {
      console.error("Track does not belong to current album");
      return;
    }

    if (currentTrackIndex !== trackIndex || !isPlaying) {
      setCurrentTrackIndex(trackIndex);
      setCurrentTrack(track);

      const selectedTrack = currentAlbum.tracks[trackIndex];
      audio.src = selectedTrack.src;
      if (isReady) audio.play().catch((error) => console.error(error));
      else audio.load();
      setPlaying(true);
    } else {
      if (audio.paused) {
        audio.play().catch((error) => console.error(error));
        setPlaying(true);
      } else {
        audio.pause();
        setPlaying(false);
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
  }, [currentTrackIndex, isPlaying, isShuffled]);

  useEffect(() => {
    if (activeShuffle) {
      shuffleTracks();
    }
  }, [activeShuffle]);

  useEffect(() => {
    const handleCanPlayThrough = () => {
      setReady(true);
      if (isPlaying) audio.play().catch((error) => console.error(error));
    };

    audio.addEventListener("canplaythrough", handleCanPlayThrough);

    return () => {
      audio.removeEventListener("canplaythrough", handleCanPlayThrough);
    };
  }, [audio, isPlaying]);

  const stopAndReset = () => {
    audio.pause();
    setPlaying(false);
    setCurrentAlbum(null);
    setCurrentTrack(null);
    setCurrentTrackIndex(0);
    setShuffled(false);
    setShuffledTracks([]);
    setActiveShuffle(false);
    setReady(false);
  };

  return {
    stopAndReset,
    audio,
    currentAlbum,
    setCurrentAlbum,
    currentTrack,
    setCurrentTrack,
    isPlaying,
    currentTrackIndex,
    handleToggleAudio,
    handleNextTrack,
    handlePrevTrack,
    shuffleTracks,
    toggleShuffle,
    isShuffled,
  };
};

const AudioProvider = ({ children }) => {
  const [defaultTrack, setDefaultTrack] = useState(null);

  const audioPlayer = useAudioPlayer();

  useEffect(() => {
    if (audioPlayer.currentAlbum) {
      setDefaultTrack(audioPlayer.currentAlbum.tracks[0]);
    }
  }, [audioPlayer.currentAlbum]);

  return (
    <AudioContext.Provider value={{ ...audioPlayer, defaultTrack }}>
      {children}
    </AudioContext.Provider>
  );
};

export default AudioProvider;
