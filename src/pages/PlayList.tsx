/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface Playlist {
  id: number;
  title: string;
  cover: string;
}

const Playlist = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [playlistTitle, setPlaylistTitle] = useState<string>("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [playlistError, setPlaylistError] = useState<string | null>(null);
  const [playlistSuccessMessage, setPlaylistSuccessMessage] = useState<string | null>(null);

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

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPlaylistTitle(e.target.value);
  };

  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleCreatePlaylist = async (e: FormEvent) => {
    e.preventDefault();

    if (!playlistTitle || !coverImage) {
      setPlaylistError("Title and cover image are required!");
      return;
    }

    const token = localStorage.getItem("authToken");

    const formData = new FormData();
    formData.append("title", playlistTitle);
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
      setPlaylistTitle("");
      setCoverImage(null);
      setPlaylistError(null);
      fetchPlaylists();
    } catch (err: any) {
      setPlaylistError(
        err.response?.data?.message || "Failed to create playlist"
      );
    }
  };

  const handleDeleteplaylist = async (playlistId: number) => {
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

  if (loading) {
    return <div className="text-center mt-10">Loading playlists...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create a Playlist</h1>

      {/* Playlist Creation Form */}
      <form onSubmit={handleCreatePlaylist}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-lg font-semibold">
            Playlist Title
          </label>
          <input
            type="text"
            id="title"
            value={playlistTitle}
            onChange={handleTitleChange}
            placeholder="Enter playlist title"
            className="w-full p-2 border rounded mt-1"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="cover" className="block text-lg font-semibold">
            Playlist Cover
          </label>
          <input
            type="file"
            id="cover"
            onChange={handleCoverChange}
            className="w-full p-2 border rounded mt-1"
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
      </form>

      <h1 className="text-2xl font-bold mb-4 mt-8">Playlists</h1>

      {playlists.length > 0 ? (
        <ul className="space-y-4">
          {playlists.map((playlist) => (
            <li key={playlist.id} className="p-4 bg-gray-100 rounded shadow">
              {editStatus[playlist.id] ? (
                <div>
                  <input
                    placeholder="New name of playlist"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    type="text"
                    className="w-full p-2 border rounded mt-1"
                  />
                  <input
                    type="file"
                    id="cover"
                    className="w-full p-2 border rounded mt-1"
                  />
                  <div
                    onClick={() => handleChangeName(playlist.id)}
                    className="mt-2 bg-green-500 text-white p-2 rounded cursor-pointer"
                  >
                    Submit Change
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold">{playlist.title}</h2>
                  <img
                    src={`http://192.168.100.24:9000/uploads/${playlist.cover}`}
                    alt={playlist.title}
                    className="w-20 h-20 object-cover rounded mt-2"
                  />
                  <div
                    onClick={() => handleDeleteplaylist(playlist.id)}
                    className="text-red-500 cursor-pointer mt-2"
                  >
                    Delete
                  </div>
                  <div
                    onClick={() =>
                      handleEditToggle(playlist.id, playlist.title)
                    }
                    className="text-blue-500 cursor-pointer mt-2"
                  >
                    Edit
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No playlists found.</p>
      )}
    </div>
  );
};

export default Playlist;
