/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { fetchSongs, fetchPlaylists, addSongToPlaylist } from '../api';
import CardSong from '../components/CardSong';
import { Playlist, Song } from '../components/type';
const Home = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [playlistError, setPlaylistError] = useState<string | null>(null);
  const [showPlaylist, setShowPlaylist] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedSongs = await fetchSongs('');
        setSongs(fetchedSongs);
        setFilteredSongs(fetchedSongs);
        const fetchedPlaylists = await fetchPlaylists();
        setPlaylists(fetchedPlaylists);
      } catch (error) {
        setPlaylistError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchFilteredSongs = async () => {
      try {
        const fetchedSongs = await fetchSongs(searchQuery);
        setFilteredSongs(fetchedSongs);
      } catch (error) {
        setPlaylistError(error.message);
      }
    };
    fetchFilteredSongs();
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleAddToPlaylist = async (playlistId: number, songId: number) => {
    try {
      await addSongToPlaylist(playlistId, songId);
      alert(`Song added to playlist ${playlistId}`);
    } catch (error) {
      console.error('Failed to add song to playlist:', error);
      alert('Failed to add song to playlist.');
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
      <h1 className="text-3xl font-bold mb-6 text-center mt-20">Melody Songs</h1>
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
