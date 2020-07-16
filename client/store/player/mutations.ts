/* eslint-disable no-param-reassign */
import { Mutations } from 'vuex';
import { PlayerState } from './state';
import type { SpotifyAPI } from '~~/types';

import { convertUriToId } from '~/scripts/converter/convertUriToId';

export type PlayerMutations = {
  SET_PLAYBACK_PLAYER: Spotify.SpotifyPlayer | undefined
  SET_DEVICE_ID: string | undefined
  SET_ACTIVE_DEVICE_ID: string | undefined
  SET_DEVICE_LIST: SpotifyAPI.Device[]
  SET_CUSTOM_CONTEXT_URI: string | undefined
  SET_CUSTOM_TRACK_URI_LIST: string[] | undefined
  SET_RECENTLY_PLAYED: SpotifyAPI.Player.RecentlyPlayed | undefined
  SET_GET_CURRENT_PLAYBACK_TIMER_ID: ReturnType<typeof setTimeout> | number | undefined
  INCREMENT_RETRY_COUNTS_OF_GET_CURRENT_PLAYBACK: void
  RESET_RETRY_COUNTS_OF_GET_CURRENT_PLAYBACK: void
  SET_CURRENT_TRACK: Spotify.Track | undefined
  SET_NEXT_TRACK_LIST: Spotify.Track[]
  SET_PREVIOUS_TRACK_LIST: Spotify.Track[]
  SET_IS_SAVED_TRACK: boolean
  SET_IS_PLAYING: boolean
  SET_CONTEXT_URI: string | undefined
  SET_POSITION_MS: number
  SET_DISABLED_PLAYING_FROM_BEGINING: boolean
  SET_DURATION_MS: number
  SET_IS_SHUFFLED: boolean
  SET_REPEAT_MODE: 0 | 1 | 2
  SET_DISALLOWS: SpotifyAPI.Disallows
  SET_VOLUME_PERCENT: { volumePercent: number }
  SET_IS_MUTED: boolean
};

export type RootMutations = {
  ['player/SET_PLAYBACK_PLAYER']: PlayerMutations['SET_PLAYBACK_PLAYER']
  ['player/SET_DEVICE_ID']: PlayerMutations['SET_DEVICE_ID']
  ['player/SET_ACTIVE_DEVICE_ID']: PlayerMutations['SET_ACTIVE_DEVICE_ID']
  ['player/SET_DEVICE_LIST']: PlayerMutations['SET_DEVICE_LIST']
  ['player/SET_CUSTOM_CONTEXT_URI']: PlayerMutations['SET_CUSTOM_CONTEXT_URI']
  ['player/SET_CUSTOM_TRACK_URI_LIST']: PlayerMutations['SET_CUSTOM_TRACK_URI_LIST']
  ['player/SET_GET_CURRENT_PLAYBACK_TIMER_ID']: PlayerMutations['SET_GET_CURRENT_PLAYBACK_TIMER_ID']
  ['player/INCREMENT_RETRY_COUNTS_OF_GET_CURRENT_PLAYBACK']: PlayerMutations['INCREMENT_RETRY_COUNTS_OF_GET_CURRENT_PLAYBACK']
  ['player/RESET_RETRY_COUNTS_OF_GET_CURRENT_PLAYBACK']: PlayerMutations['RESET_RETRY_COUNTS_OF_GET_CURRENT_PLAYBACK']
  ['player/SET_CURRENT_TRACK']: PlayerMutations['SET_CURRENT_TRACK']
  ['player/SET_NEXT_TRACK_LIST']: PlayerMutations['SET_NEXT_TRACK_LIST']
  ['player/SET_PREVIOUS_TRACK_LIST']: PlayerMutations['SET_PREVIOUS_TRACK_LIST']
  ['player/SET_IS_SAVED_TRACK']: PlayerMutations['SET_IS_SAVED_TRACK']
  ['player/SET_IS_PLAYING']: PlayerMutations['SET_IS_PLAYING']
  ['player/SET_CONTEXT_URI']: PlayerMutations['SET_CONTEXT_URI']
  ['player/SET_POSITION_MS']: PlayerMutations['SET_POSITION_MS']
  ['player/SET_DISABLED_PLAYING_FROM_BEGINING']: PlayerMutations['SET_DISABLED_PLAYING_FROM_BEGINING']
  ['player/SET_DURATION_MS']: PlayerMutations['SET_DURATION_MS']
  ['player/SET_IS_SHUFFLED']: PlayerMutations['SET_IS_SHUFFLED']
  ['player/SET_REPEAT_MODE']: PlayerMutations['SET_REPEAT_MODE']
  ['player/SET_DISALLOWS']: PlayerMutations['SET_DISALLOWS']
  ['player/SET_VOLUME_PERCENT']: PlayerMutations['SET_VOLUME_PERCENT']
  ['player/SET_IS_MUTED']: PlayerMutations['SET_IS_MUTED']
};

const mutations: Mutations<PlayerState, PlayerMutations> = {
  SET_PLAYBACK_PLAYER(state, playbackPlayer) {
    state.playbackPlayer = playbackPlayer;
  },

  SET_DEVICE_ID(state, deviceId) {
    state.deviceId = deviceId;
  },

  SET_ACTIVE_DEVICE_ID(state, activeDeviceId) {
    state.activeDeviceId = activeDeviceId;
  },

  SET_DEVICE_LIST(state, deviceList) {
    state.deviceList = deviceList;
  },

  SET_CUSTOM_CONTEXT_URI(state, contextUri) {
    state.customContextUri = contextUri;
  },

  SET_CUSTOM_TRACK_URI_LIST(state, trackUriList) {
    state.customTrackUriList = trackUriList;
  },

  SET_RECENTLY_PLAYED(state, recentlyPlayed) {
    state.recentlyPlayed = recentlyPlayed;
  },

  SET_GET_CURRENT_PLAYBACK_TIMER_ID(state, timer) {
    const { getCurrentPlaybackTimer } = state;
    if (typeof getCurrentPlaybackTimer === 'number') {
      // クライアントサイドで実行
      window.clearTimeout(getCurrentPlaybackTimer);
    } else if (getCurrentPlaybackTimer != null) {
      // サーバーサイドで実行
      clearTimeout(getCurrentPlaybackTimer);
    }

    state.getCurrentPlaybackTimer = timer;
  },
  INCREMENT_RETRY_COUNTS_OF_GET_CURRENT_PLAYBACK(state) {
    state.retryCountsOfGetCurrentPlayback += 1;
  },

  RESET_RETRY_COUNTS_OF_GET_CURRENT_PLAYBACK(state) {
    state.retryCountsOfGetCurrentPlayback = 0;
  },

  SET_CURRENT_TRACK(state, currentTrack) {
    state.artWorkList = currentTrack?.album.images;
    state.trackName = currentTrack?.name;
    state.trackId = currentTrack?.id ?? undefined;
    state.trackUri = currentTrack?.uri;
    state.releaseName = currentTrack?.album.name;
    state.releaseUri = currentTrack?.album.uri;
    state.artistList = currentTrack?.artists.map((artist) => ({
      name: artist.name,
      id: convertUriToId(artist.uri),
    }));
  },

  SET_NEXT_TRACK_LIST(state, nextTrackList) {
    state.nextTrackList = nextTrackList;
  },

  SET_PREVIOUS_TRACK_LIST(state, previousTrackList) {
    state.previousTrackList = previousTrackList;
  },

  SET_IS_SAVED_TRACK(state, isSavedTrack) {
    state.isSavedTrack = isSavedTrack;
  },

  SET_IS_PLAYING(state, isPlaying) {
    state.isPlaying = isPlaying;
  },

  SET_CONTEXT_URI(state, uri) {
    state.contextUri = uri;
  },

  SET_POSITION_MS(state, positionMs) {
    state.positionMs = positionMs;
    state.disabledPlayingFromBegining = positionMs <= 1000;
  },

  SET_DISABLED_PLAYING_FROM_BEGINING(state, disabledPlayingFromBegining) {
    state.disabledPlayingFromBegining = disabledPlayingFromBegining;
  },

  SET_DURATION_MS(state, durationMs) {
    state.durationMs = durationMs;
  },

  SET_IS_SHUFFLED(state, isShuffled) {
    state.isShuffled = isShuffled;
  },

  SET_REPEAT_MODE(state, repeatMode) {
    state.repeatMode = repeatMode;
  },

  SET_DISALLOWS(state, disallows) {
    state.disallows = disallows;
  },

  SET_VOLUME_PERCENT(state, { volumePercent }) {
    state.volumePercent = volumePercent;
  },

  SET_IS_MUTED(state, isMuted) {
    state.isMuted = isMuted;
  },
};

export default mutations;
