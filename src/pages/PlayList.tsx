/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";

interface Playlist {
  id: number;
  title: string;
  cover: string;
  songs: Song[];
}

interface Song {
  id: number;
  title: string;
  artist_name: string;
  album_name: string;
  duration: string; // Duration in seconds as a string
  file: string;
  format: string;
}

// Validation schema using Yup
const validationSchema = Yup.object({
  playlistTitle: Yup.string()
    .required("Playlist title is required")
    .min(3, "Playlist title must be at least 3 characters long")
    .max(100, "Playlist title must be at most 100 characters long"),
});

const PlaylistPage = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [songs, setSongs] = useState<{ [key: number]: Song[] }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [playlistError, setPlaylistError] = useState<string | null>(null);
  const [playlistSuccessMessage, setPlaylistSuccessMessage] = useState<
    string | null
  >(null);
  const [editStatus, setEditStatus] = useState<{ [key: number]: boolean }>({});
  const [newPlaylistName, setNewPlaylistName] = useState<string>("");

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
      setLoading(false);
    } catch (err: any) {
      setPlaylistError(
        err.response?.data?.message || "Failed to load playlists"
      );
      setLoading(false);
    }
  };

  const fetchSongsForPlaylist = async (playlistId: number) => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.get(
        `http://192.168.100.24:9000/playlist/${playlistId}/songs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSongs((prevSongs) => ({
        ...prevSongs,
        [playlistId]: response.data.result.items || [],
      }));
    } catch (err: any) {
      setPlaylistError("Failed to load songs for this playlist.");
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const formatDuration = (duration: string) => {
    const totalSeconds = parseFloat(duration);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.round(totalSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleCreatePlaylist = async (values: any) => {
    if (!coverImage) {
      setPlaylistError("Cover image is required!");
      return;
    }

    const token = localStorage.getItem("authToken");

    const formData = new FormData();
    formData.append("title", values.playlistTitle);
    formData.append("cover", coverImage);

    try {
      const response = await axios.post(
        "http://192.168.100.24:9000/playlist",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setPlaylistSuccessMessage("Playlist created successfully!");
      setPlaylistError(null);
      fetchPlaylists();
    } catch (err: any) {
      setPlaylistError(
        err.response?.data?.message || "Failed to create playlist"
      );
    }
  };

  const handleDeleteSong = async (playlistId: number, songId: number) => {
    const token = localStorage.getItem("authToken");

    try {
      await axios.delete(
        `http://192.168.100.24:9000/playlist/add-song/${playlistId}`,
        {
          data: {
            song_id: songId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setPlaylistSuccessMessage("Song deleted successfully!");
      fetchSongsForPlaylist(playlistId);
    } catch (err: any) {
      setPlaylistError("Failed to delete song.");
    }
  };

  const handleDeletePlaylist = async (playlistId: number) => {
    const token = localStorage.getItem("authToken");

    try {
      await axios.delete(`http://192.168.100.24:9000/playlist/${playlistId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setPlaylistSuccessMessage("Playlist deleted successfully!");
      fetchPlaylists();
    } catch (err: any) {
      setPlaylistError("Failed to delete playlist.");
    }
  };

  const handleEditToggle = (playlistId: number, title: string) => {
    setEditStatus((prevState) => ({
      ...prevState,
      [playlistId]: !prevState[playlistId],
    }));
    setNewPlaylistName(title);
  };

  const handleChangeName = async (playlistId: number) => {
    const token = localStorage.getItem("authToken");

    if (!newPlaylistName) {
      setPlaylistError("Playlist title cannot be empty.");
      return;
    }

    try {
      await axios.put(
        `http://192.168.100.24:9000/playlist/${playlistId}`,
        { title: newPlaylistName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setPlaylistSuccessMessage("Playlist title updated successfully!");
      setEditStatus((prevState) => ({
        ...prevState,
        [playlistId]: false,
      }));
      fetchPlaylists();
    } catch (err: any) {
      setPlaylistError("Failed to update playlist title.");
    }
  };

  const handleViewSongs = (playlistId: number) => {
    if (!songs[playlistId]) {
      fetchSongsForPlaylist(playlistId);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-white">Loading playlists...</div>
    );
  }

  return (
    <div className="p-4 bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4">Create a Playlist</h1>

      {/* Playlist Creation Form with Formik */}
      <Formik
        initialValues={{ playlistTitle: "" }}
        validationSchema={validationSchema}
        onSubmit={handleCreatePlaylist}
      >
        {({ setFieldValue }) => (
          <Form>
            <div className="mb-4">
              <label htmlFor="playlistTitle" className="block text-lg font-semibold">
                Playlist Title
              </label>
              <Field
                name="playlistTitle"
                type="text"
                placeholder="Enter playlist title"
                className="w-full p-2 border rounded mt-1 bg-gray-800 text-white"
              />
              <ErrorMessage
                name="playlistTitle"
                component="div"
                className="text-red-500 mt-2"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="cover" className="block text-lg font-semibold">
                Playlist Cover
              </label>
              <input
                type="file"
                id="cover"
                onChange={(e) => {
                  if (e.target.files) {
                    setCoverImage(e.target.files[0]);
                  }
                }}
                className="w-full p-2 border rounded mt-1 bg-gray-800 text-white"
              />
            </div>

            {playlistError && (
              <div className="text-red-500 mt-2">{playlistError}</div>
            )}
            {playlistSuccessMessage && (
              <div className="text-green-500 mt-2">{playlistSuccessMessage}</div>
            )}

            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white p-2 rounded"
            >
              Create Playlist
            </button>
          </Form>
        )}
      </Formik>

      {/* Playlists List and Edit/Delete functionality goes here */}
      <h1 className="text-2xl font-bold mb-4 mt-8">Playlists</h1>
      {playlists.length > 0 ? (
        <ul className="grid grid-cols-3 gap-4">
          {playlists.map((playlist) => (
            <li key={playlist.id} className="p-4 bg-gray-800 rounded shadow">
              {editStatus[playlist.id] ? (
                <div>
                  <input
                    placeholder="New name of playlist"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    type="text"
                    className="w-full p-2 border rounded mt-1 bg-gray-700 text-white"
                  />
                  <button
                    onClick={() => handleChangeName(playlist.id)}
                    className="mt-2 bg-green-500 text-white p-2 rounded"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <div>
                  <img
                    src={playlist.cover}
                    alt="Playlist Cover"
                    className="w-full h-32 object-cover mb-2"
                  />
                  <h3 className="text-xl font-semibold">{playlist.title}</h3>
                  <div className="mt-2">
                    <button
                      onClick={() => handleEditToggle(playlist.id, playlist.title)}
                      className="bg-blue-500 text-white p-2 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePlaylist(playlist.id)}
                      className="bg-red-500 text-white p-2 rounded"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleViewSongs(playlist.id)}
                      className="bg-purple-500 text-white p-2 rounded ml-2"
                    >
                      View Songs
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div>No playlists available</div>
      )}
    </div>
  );
};

export default PlaylistPage;
