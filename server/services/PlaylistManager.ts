import { Playlist } from "./storage/Playlist";

export class PlaylistManager {
    private playlist: Playlist;

    constructor() {
        this.playlist = new Playlist();
    }

    public async addSongToPlaylist(songWithArtist: string) {
        return await this.playlist.setNowPlaying(songWithArtist);
    }

    public async getNowPlaying() {
        return this.playlist.nowPlaying();
    }
}
