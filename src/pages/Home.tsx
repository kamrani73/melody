import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link for navigation

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

  // Fetch songs with search filter
  const fetchSongs = async (search: string) => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.get("http://192.168.100.24:9000/song", {
        params: {
          "per-page": 20,
          page: 1,
          "filter[title][like]": search,  // Apply filter based on search query
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

  // Fetch playlists
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

  // Fetch songs and playlists on initial load
  useEffect(() => {
    fetchSongs(""); // Fetch all songs initially without any filter
    fetchPlaylists(); // Fetch playlists
  }, []);

  // Fetch songs based on search query
  useEffect(() => {
    if (searchQuery) {
      fetchSongs(searchQuery);  // Call fetchSongs with searchQuery as filter
    } else {
      fetchSongs("");  // If search query is empty, fetch all songs
    }
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return <div className="text-center mt-10">Loading songs...</div>;
  }

  return (
    <div className="p-4">
      {/* Link to the Playlist page */}
      <Link to="/playlist" className="text-blue-500 hover:underline">
        Go to Playlists
      </Link>

      <h1 className="text-2xl font-bold mb-4">Music Songs</h1>

      {/* Search Input */}
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search for songs..."
        className="w-full p-2 mb-4 border rounded"
      />

      {filteredSongs.length > 0 ? (
        <ul className="space-y-4">
          {filteredSongs.map((song) => (
            <li key={song.id} className="p-4 bg-gray-100 rounded shadow">
              <h2 className="text-xl font-semibold">{song.title}</h2>
              <p className="text-gray-700">By {song.artist_name}</p>
              <p className="text-gray-500">
                {song.album_name} ({song.year})
              </p>
              <p className="text-gray-400">Duration: {song.duration} seconds</p>
              {/* Download link */}
              <a
                href={`http://192.168.100.24:9000/song/download/${song.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Download
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No songs found.</p>
      )}

      {/* Display Playlists */}
      <h1 className="text-2xl font-bold mb-4 mt-8">Playlists</h1>

      {playlists.length > 0 ? (
        <ul className="space-y-4">
          {playlists.map((playlist) => (
            <li key={playlist.id} className="p-4 bg-gray-100 rounded shadow">
              <h2 className="text-xl font-semibold">{playlist.title}</h2>
              <img
                src={`http://192.168.100.24:9000/uploads/${playlist.cover}`}
                alt={playlist.title}
                className="w-20 h-20 object-cover rounded mt-2"
              />
            </li>
          ))}
        </ul>
      ) : (
        <p>No playlists found.</p>
      )}
    </div>
  );
};

export default Home;
