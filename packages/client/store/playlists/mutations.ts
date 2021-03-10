/* eslint-disable no-param-reassign */
import type { VuexMutations } from 'typed-vuex';
import type { SpotifyAPI } from 'shared/types';
import type { State, DeletedTrack } from './types';

interface EditPlaylistParams {
  id: string;
  name?: string;
  description?: string;
  isPublic?: boolean;
  isCollaborative?: boolean;
}
interface ModifyPlaylistTotalTracksParams {
  playlistId: string;
  total: number;
}

export type Mutations = {
  SET_PLAYLISTS: SpotifyAPI.SimplePlaylist[] | undefined;
  ADD_PLAYLIST: SpotifyAPI.SimplePlaylist;
  EDIT_PLAYLIST: EditPlaylistParams;
  REMOVE_PLAYLIST: string;
  MODIFY_PLAYLIST_TOTAL_TRACKS: ModifyPlaylistTotalTracksParams;
  SET_ACTUAL_IS_SAVED: [string, boolean];
  DELETE_ACTUAL_IS_SAVED: string;
  INCREMENT_UNUPDATED_TRACKS_MAP: [string, number];
  DELETE_UNUPDATED_TRACKS_MAP: string;
  SET_ACTUALLY_DELETED_TRACK: [string, DeletedTrack];
  DELETE_ACTUALLY_DELETED_TRACK: string;
}

const mutations: VuexMutations<State, Mutations> = {
  SET_PLAYLISTS(state, playlists) {
    state.playlists = playlists;
  },

  ADD_PLAYLIST(state, playlist) {
    const { playlists } = state;

    state.playlists = playlists != null
      ? [playlist, ...playlists]
      : [playlist];
  },

  EDIT_PLAYLIST(state, {
    id, name, description, isPublic, isCollaborative,
  }) {
    const { playlists } = state;
    if (playlists == null) return;

    const modifiedPlaylists = [...playlists];
    const index = modifiedPlaylists.findIndex((playlist) => playlist.id === id);
    // 削除 (実際はアンフォロー) したプレイリストを編集した時
    if (index === -1) return;

    const playlist = modifiedPlaylists[index];
    modifiedPlaylists[index] = {
      ...playlist,
      name: name ?? playlist.name,
      // 空文字列の場合は null にする
      description: (description ?? playlist.description) || null,
      public: isPublic ?? playlist.public,
      collaborative: isCollaborative ?? playlist.collaborative,
    };

    state.playlists = modifiedPlaylists;
  },

  REMOVE_PLAYLIST(state, playlistId) {
    const { playlists } = state;
    if (playlists == null) return;

    const modifiedPlaylists = [...playlists];
    const index = modifiedPlaylists.findIndex((playlist) => playlist.id === playlistId);
    if (index === -1) return;

    modifiedPlaylists.splice(index, 1);

    state.playlists = modifiedPlaylists;
  },

  MODIFY_PLAYLIST_TOTAL_TRACKS(state, { playlistId, total }) {
    const { playlists } = state;
    if (playlists == null) return;

    const modifiedPlaylists = [...playlists];
    const index = modifiedPlaylists.findIndex((playlist) => playlist.id === playlistId);
    if (index === -1) return;

    const playlist = modifiedPlaylists[index];
    modifiedPlaylists[index] = {
      ...playlist,
      tracks: {
        ...playlist.tracks,
        total,
      },
    };

    state.playlists = modifiedPlaylists;
  },

  SET_ACTUAL_IS_SAVED(state, [key, isSaved]) {
    state.actualIsSavedMap.set(key, isSaved);
  },

  DELETE_ACTUAL_IS_SAVED(state, key) {
    state.actualIsSavedMap.delete(key);
  },

  INCREMENT_UNUPDATED_TRACKS_MAP(state, [key, isTrackSavedMap]) {
    state.unupdatedTrackCountsMap.set(key, isTrackSavedMap);
  },

  DELETE_UNUPDATED_TRACKS_MAP(state, key) {
    state.unupdatedTrackCountsMap.delete(key);
  },

  SET_ACTUALLY_DELETED_TRACK(state, [key, track]) {
    state.actuallyDeletedTrackMap.set(key, track);
  },

  DELETE_ACTUALLY_DELETED_TRACK(state, key) {
    state.actuallyDeletedTrackMap.delete(key);
  },
};

export default mutations;
