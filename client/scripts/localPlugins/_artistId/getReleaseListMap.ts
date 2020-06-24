import { Context } from '@nuxt/types';

import { getReleaseListHandler } from '~/scripts/localPlugins/_artistId';
import { ReleaseInfo, ReleaseType } from './getReleaseListHandler';

export type ArtistReleaseInfo = {
  [k in ReleaseType]: ReleaseInfo<k>
}

export const getReleaseListMap = async (
  context: Context,
  artworkSize: number,
): Promise<ArtistReleaseInfo | undefined> => {
  const getReleaseList = getReleaseListHandler(context);

  const [album, single, compilation, appears_on] = await Promise.all([
    getReleaseList('album', artworkSize),
    getReleaseList('single', artworkSize),
    getReleaseList('compilation', artworkSize),
    getReleaseList('appears_on', artworkSize),
  ] as const);

  return {
    album,
    single,
    compilation,
    appears_on,
  };
};
