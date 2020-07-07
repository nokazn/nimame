import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const addItemToPlaylist = (context: Context) => {
  const { app } = context;

  /**
   * track または episode の uri を指定する
   */
  return ({
    playlistId,
    uris,
    position,
  }: {
    playlistId: string
    uris?: string[]
    position?: number
  }): Promise<Partial<SpotifyAPI.PlaylistSnapshot>> => {
    const request = app.$spotifyApi.$post(`/playlists/${playlistId}/tracks`, {
      uris,
      position,
    }).catch((err: Error) => {
      console.error({ err });
      return {};
    });

    return request;
  };
};
