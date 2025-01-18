/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";

// Fetch songs based on search term
export const fetchSongs = async (search: string) => {
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
    return response.data.result.items || [];
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to load songs");
  }
};

// Fetch all playlists
export const fetchPlaylists = async () => {
  const token = localStorage.getItem("authToken");
  try {
    const response = await axios.get("http://192.168.100.24:9000/playlist", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data.result.items.map((playlist: any) => ({
      ...playlist,
      songs: playlist.songs || [],
    }));
  } catch (err) {
    throw new Error("Failed to load playlists");
  }
};

// Fetch songs for a specific playlist
export const fetchSongsForPlaylist = async (playlistId: number) => {
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
    return response.data.result.items || [];
  } catch (err) {
    throw new Error("Failed to load songs for this playlist.");
  }
};

// Create a new playlist
export const createPlaylist = async (
  playlistTitle: string,
  coverImage: File
) => {
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
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to create playlist");
  }
};

// Delete a song from a playlist
export const deleteSongFromPlaylist = async (
  playlistId: number,
  songId: number
) => {
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
  } catch (err) {
    throw new Error("Failed to delete song.");
  }
};

// Delete a playlist
export const deletePlaylist = async (playlistId: number) => {
  const token = localStorage.getItem("authToken");

  try {
    await axios.delete(`http://192.168.100.24:9000/playlist/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    throw new Error("Failed to delete playlist.");
  }
};

// Update a playlist's title
export const updatePlaylistTitle = async (
  playlistId: number,
  newPlaylistName: string
) => {
  const token = localStorage.getItem("authToken");

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
  } catch (err) {
    throw new Error("Failed to update playlist title.");
  }
};

// Add a song to a playlist
export const addSongToPlaylist = async (playlistId: number, songId: number) => {
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
  } catch (err) {
    throw new Error("Failed to add song to playlist");
  }
};

  

 
