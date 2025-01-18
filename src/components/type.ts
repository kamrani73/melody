// types.ts
export interface Song {
     id: number;
    title: string;
    artist_name: string;
    album_name: string;
    duration: string;
    file: string;
    format: string;
  }
  
  export interface Playlist {
    id: number;
    title: string;
    cover: string;
    songs: Song[];
  }
  