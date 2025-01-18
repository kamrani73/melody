import React from "react";
import { Song, Playlist } from "./type"; 

interface CardSongProps {
  song: Song;
  playlists: Playlist[];
  onAddToPlaylist: (playlistId: number, songId: number) => void;
  onTogglePlaylistVisibility: (songId: number) => void;
  showPlaylist: number | null;
}

const CardSong: React.FC<CardSongProps> = ({
  song,
  playlists,
  onAddToPlaylist,
  onTogglePlaylistVisibility,
  showPlaylist,
}) => {
  const convertDurationToTime = (duration: string) => {
    const totalSeconds = parseFloat(duration);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.round(totalSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  return (
    <li className="p-5 bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-white">{song.title}</h2>
          <p className="text-lg text-gray-400">By {song.artist_name}</p>
          <p className="text-sm text-gray-500">
            {song.album_name} 
          </p>
        </div>
        <div className="text-sm text-gray-400">
          Duration: {convertDurationToTime(song.duration)}
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={() => onTogglePlaylistVisibility(song.id)}
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
                    onClick={() => onAddToPlaylist(playlist.id, song.id)}
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
          href={`http://192.168.100.24:9000/song/download/${song.id}.${song.format}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 ml-2 text-white p-2 rounded-md hover:bg-green-500 mt-4 text-center"
        >
          Download
        </a>
      </div>
    </li>
  );
};

export default CardSong;
