import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

interface Playlist {
  id: number;
  title: string;
  cover: string;
}

const PlaylistDetail = () => {
  const { playlist_id } = useParams<{ playlist_id: string }>();  
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [playlistTitle, setPlaylistTitle] = useState<string>("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate(); // For navigation after delete or update

  const fetchPlaylistDetail = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get(
        `http://192.168.100.24:9000/playlist/${playlist_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setPlaylist(response.data.result);
      setPlaylistTitle(response.data.result.title);
      setLoading(false);
    } catch (err: any) {
      setError("Failed to load playlist details.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (playlist_id) {
      fetchPlaylistDetail(); 
    }
  }, [playlist_id]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlaylistTitle(e.target.value);
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleUpdatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!playlistTitle || !coverImage) {
      setError("Title and cover image are required!");
      return;
    }

    const token = localStorage.getItem("authToken");

    const formData = new FormData();
    formData.append("title", playlistTitle);
    formData.append("cover", coverImage);

    try {
      const response = await axios.put(
        `http://192.168.100.24:9000/playlist/${playlist_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccessMessage("Playlist updated successfully!");
      fetchPlaylistDetail(); // Refresh the playlist details
    } catch (err: any) {
      setError("Failed to update playlist.");
    }
  };

  const handleDeletePlaylist = async () => {
    const token = localStorage.getItem("authToken");

    try {
      await axios.delete(`http://192.168.100.24:9000/playlist/${playlist_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setSuccessMessage("Playlist deleted successfully!");
      navigate("/playlist"); // Redirect to playlist page after deletion
    } catch (err: any) {
      setError("Failed to delete playlist.");
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading playlist...</div>;
  }

  return (
    <div className="p-4">
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {successMessage && (
        <div className="text-green-500 mt-2">{successMessage}</div>
      )}

      <h1 className="text-2xl font-bold mb-4">Edit Playlist</h1>

      <form onSubmit={handleUpdatePlaylist}>
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

        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white p-2 rounded"
        >
          Update Playlist
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">Playlist Details</h2>
        <div className="p-4 bg-gray-100 rounded shadow mt-4">
          <h3 className="text-lg font-bold">{playlist?.title}</h3>
          <img
            src={`http://192.168.100.24:9000/uploads/${playlist?.cover}`}
            alt={playlist?.title}
            className="w-20 h-20 object-cover rounded mt-2"
          />
        </div>
      </div>

      <button
        onClick={handleDeletePlaylist}
        className="mt-4 bg-red-500 text-white p-2 rounded"
      >
        Delete Playlist
      </button>
    </div>
  );
};

export default PlaylistDetail;
