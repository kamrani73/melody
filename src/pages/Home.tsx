/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";

interface Song {
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

  const convertDurationToTime = (duration: string) => {
    const totalSeconds = parseFloat(duration);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.round(totalSeconds % 60);

    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
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
      <h1 className="text-3xl font-bold mb-6 text-center">Music Songs</h1>
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
            <li
              key={song.id}
              className="p-5 bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold text-white">{song.title}</h2>
                  <p className="text-lg text-gray-400">By {song.artist_name}</p>
                  <p className="text-sm text-gray-500">
                    {song.album_name} ({song.year})
                  </p>
                </div>
                <div className="text-sm text-gray-400">
                  Duration: {convertDurationToTime(song.duration)}
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => togglePlaylistVisibility(song.id)}
                  className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-500 mt-2"
                >
                  Add to playlist
                </button>

                {showPlaylist === song.id && (
                  <div className="mt-4 bg-gray-800 p-4 rounded-lg shadow-md">
                    {playlists.length > 0 ? (
                      <ul className="space-y-4">
                        {playlists.map((playlist) => (
                          <li
                            key={playlist.id}
                            className="flex justify-between items-center p-3 bg-gray-700 rounded-lg shadow-sm hover:bg-gray-600 cursor-pointer"
                            onClick={() =>
                              handleAddToPlaylist(playlist.id, song.id)
                            }
                          >
                            <h2 className="text-xl font-semibold">{playlist.title}</h2>
                           </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No playlists found.</p>
                    )}
                  </div>
                )}
              <a
                href={`http://192.168.100.24:9000/song/download/${song.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 ml-2 text-white p-2 rounded-md hover:bg-green-500 mt-4   text-center"
              >
                Download
              </a>
              </div>

            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-400">No songs found.</p>
      )}
    </div>
  );
};

export default Home;
