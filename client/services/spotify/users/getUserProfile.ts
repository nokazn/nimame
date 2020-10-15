import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const getUserProfile = (context: Context) => {
  const { app } = context;

  return ({ userId }: {
    userId: string
  }): Promise<SpotifyAPI.UserData | undefined> => {
    const request = app.$spotifyApi.$get(`/users/${userId}`)
      .catch((err: Error) => {
        console.error({ err });
        return undefined;
      });

    return request;
  };
};
