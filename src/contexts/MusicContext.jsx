import { createContext, useContext, useEffect, useState } from "react";

const MusicContext = createContext();

const songs = [
  {
    id: 1,
    title: "679",
    artist: "Fetty Wap",
    url: "/songs/679.mp3",
    duration: "3:42",
  },
  {
    id: 2,
    title: "A Little Death",
    artist: "The Neighbourhood",
    url: "/songs/A Little Death.mp3",
    duration: "3:29",
  },
  {
    id: 3,
    title: "Adaptation",
    artist: "The Weeknd",
    url: "/songs/Adaptation.mp3",
    duration: "4:44",
  },
  {
    id: 4,
    title: "Blueberry Faygo",
    artist: "Lil Mosey",
    url: "/songs/Blueberry Faygo.mp3",
    duration: "2:42",
  },
  {
    id: 5,
    title: "Dirty Diana",
    artist: "Michael Jackson",
    url: "/songs/Dirty Diana.mp3",
    duration: "4:38",
  },
  {
    id: 6,
    title: "Disturbia",
    artist: "Rihanna",
    url: "/songs/Disturbia.mp3",
    duration: "3:59",
  },
  {
    id: 7,
    title: "Drag Path",
    artist: "Unknown Artist",
    url: "/songs/Drag Path.mp3",
    duration: "3:45",
  },
  {
    id: 8,
    title: "Mary Jane",
    artist: "Unknown Artist",
    url: "/songs/Mary Jane.mp3",
    duration: "3:27",
  },
  {
    id: 9,
    title: "Party Girl",
    artist: "U2",
    url: "/songs/Party Girl.mp3",
    duration: "2:27",
  },
  {
    id: 10,
    title: "Puncrocker",
    artist: "Unknown Artist",
    url: "/songs/Puncrocker.mp3",
    duration: "4:08",
  },
  {
    id: 11,
    title: "Robbers",
    artist: "The 1975",
    url: "/songs/Robbers.mp3",
    duration: "4:21",
  },
  {
    id: 12,
    title: "Rockstar",
    artist: "Post Malone",
    url: "/songs/Rockstar.mp3",
    duration: "3:39",
  },
  {
    id: 13,
    title: "Somebody Else",
    artist: "The 1975",
    url: "/songs/Somebody Else.mp3",
    duration: "5:44",
  },
  {
    id: 14,
    title: "Sucker",
    artist: "Jonas Brothers",
    url: "/songs/Sucker.mp3",
    duration: "3:01",
  },
  {
    id: 15,
    title: "Swang",
    artist: "Rae Sremmurd",
    url: "/songs/Swang.mp3",
    duration: "3:31",
  },
];
export const MusicProvider = ({ children }) => {
  const [allSongs, setAllSongs] = useState(songs);
  const [currentTrack, setCurrentTrack] = useState(songs[0]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const savedPlaylists = localStorage.getItem("musicPlayerPlaylists");
    if (savedPlaylists) {
      const playlists = JSON.parse(savedPlaylists);
      setPlaylists(playlists);
    }
  }, []);

  useEffect(() => {
    if (playlists.length > 0) {
      localStorage.setItem("musicPlayerPlaylists", JSON.stringify(playlists));
    } else {
      localStorage.removeItem("musicPlayerPlaylists");
    }
  }, [playlists]);

  const handlePlaySong = (song, index) => {
    setCurrentTrack(song);
    setCurrentTrackIndex(index);
    setIsPlaying(false);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => {
      const nextIndex = (prev + 1) % allSongs.length;
      setCurrentTrack(allSongs[nextIndex]);
      return nextIndex;
    });
    setIsPlaying(false);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => {
      const nextIndex = prev === 0 ? allSongs.length - 1 : prev - 1;
      setCurrentTrack(allSongs[nextIndex]);
      return nextIndex;
    });
    setIsPlaying(false);
  };

  const formatTime = (time) => {
    if (isNaN(time) || time === undefined) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const createPlaylist = (name) => {
    const newPlaylist = {
      id: Date.now(),
      name,
      songs: [],
    };

    setPlaylists((prev) => [...prev, newPlaylist]);
  };

  const deletePlaylist = (playlistId) => {
    setPlaylists((prev) =>
      prev.filter((playlist) => playlist.id !== playlistId),
    );
  };

  const addSongToPlaylist = (playlistId, song) => {
    setPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id === playlistId) {
          return { ...playlist, songs: [...playlist.songs, song] };
        } else {
          return playlist;
        }
      }),
    );
  };

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);

  return (
    <MusicContext.Provider
      value={{
        allSongs,
        handlePlaySong,
        currentTrackIndex,
        currentTrack,
        setCurrentTime,
        currentTime,
        formatTime,
        duration,
        setDuration,
        nextTrack,
        prevTrack,
        play,
        pause,
        isPlaying,
        volume,
        setVolume,
        createPlaylist,
        playlists,
        addSongToPlaylist,
        setCurrentTrack,
        deletePlaylist,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const contextValue = useContext(MusicContext);
  if (!contextValue) {
    throw new Error("useMusic must be used inside of MusicProvider");
  }

  return contextValue;
};
