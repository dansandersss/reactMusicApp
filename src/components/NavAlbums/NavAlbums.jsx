import { useState } from "react";
import {
  midnightsAlbum,
  folkloreAlbum,
  evermoreAlbum,
} from "../../assets/tracksList.js";
import { Link } from "react-router-dom";
import styles from "./NavAlbums.module.scss";

const albumLinks = [
  {
    id: 1,
    address: "/mainPage/midnights",
    linkImg: midnightsAlbum.albumCover,
    title: midnightsAlbum.title,
    author: midnightsAlbum.author,
  },

  {
    id: 2,
    address: "/mainPage/folklore",
    linkImg: folkloreAlbum.albumCover,
    title: folkloreAlbum.title,
    author: folkloreAlbum.author,
  },

  {
    id: 3,
    address: "/mainPage/evermore",
    linkImg: evermoreAlbum.albumCover,
    title: evermoreAlbum.title,
    author: evermoreAlbum.author,
  },
];

export default function NavAlbums() {
  const [isMouseOver, setIsMouseOver] = useState(false);

  const handleMouseEnter = () => {
    setIsMouseOver(true);
  };

  const handleMouseLeave = () => {
    setIsMouseOver(false);
  };

  return (
    <>
      <div
        className={`${styles.navigation}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {albumLinks.map((albumLink) => (
          <Link
            key={albumLink.id}
            to={albumLink.address}
            className={styles.divObject}
          >
            <img src={albumLink.linkImg} alt="Album Cover" />

            <h2>{albumLink.title}</h2>
            <h3>{albumLink.author}</h3>
          </Link>
        ))}
      </div>
    </>
  );
}
