/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */ 
import React, { useState, useEffect } from "react";
import axios from "axios";
import CardSong from "../components/cardSong";  

interface Song {
  format: any;
  id: number;
  album_name: string;
  artist_name: string;
  title: string;
  duration: string;
  year: string;
}

interface Playlist {
  id: number;
  title: string;
  cover: string;
}

const Home = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [playlistError, setPlaylistError] = useState<string | null>(null);
  const [showPlaylist, setShowPlaylist] = useState<number | null>(null);

  const fetchSongs = async (search: string) => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.get("http://192.168.100.24:9000/song", {
        params: {
          "per-page": 20,
          page: 1,
          "filter[title][like]": search,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setSongs(response.data.result.items || []);
      setFilteredSongs(response.data.result.items || []);
      setLoading(false);
    } catch (err: any) {
      setPlaylistError(err.response?.data?.message || "Failed to load songs");
      setLoading(false);
    }
  };

  const fetchPlaylists = async () => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.get("http://192.168.100.24:9000/playlist", {
        params: {
          "per-page": 20,
          page: 1,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setPlaylists(response.data.result.items || []);
    } catch (err: any) {
      setPlaylistError(
        err.response?.data?.message || "Failed to load playlists"
      );
    }
  };

  useEffect(() => {
    fetchSongs("");
    fetchPlaylists();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      fetchSongs(searchQuery);
    } else {
      fetchSongs("");
    }
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleAddToPlaylist = async (playlistId: number, songId: number) => {
    const token = localStorage.getItem("authToken");

    try {
      await axios.post(
        `http://192.168.100.24:9000/playlist/add-song/${playlistId}`,
        { song_id: songId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert(`Song added to playlist ${playlistId}`);
    } catch (err: any) {
      console.error("Failed to add song to playlist:", err);
      alert("Failed to add song to playlist.");
    }
  };

  const togglePlaylistVisibility = (songId: number) => {
    setShowPlaylist(showPlaylist === songId ? null : songId);
  };

  if (loading) {
    return <div className="text-center mt-10 text-white">Loading songs...</div>;
  }

  return (
    <div className="p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center mt-20 ">Melody Songs</h1>
      <div className="mb-6 text-center">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search for songs..."
          className="w-3/4 p-3 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-800 text-white"
        />
      </div>

      {filteredSongs.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredSongs.map((song) => (
            <CardSong
              key={song.id}
              song={song}
              playlists={playlists}
              onAddToPlaylist={handleAddToPlaylist}
              onTogglePlaylistVisibility={togglePlaylistVisibility}
              showPlaylist={showPlaylist}
            />
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-400">No songs found.</p>
      )}
    </div>
  );
};

export default Home;
