type A = Exclude<'1' | 2, 2>

export const multipleRequests = <T extends Exclude<unknown, void>>(
  handler: (index: number) => Promise<T>,
  length: number,
  limit: number,
): Promise<T[]> => {
  const counts = Math.ceil(length / limit);
  return Promise.all([...new Array(counts)]
    .map((_, i) => handler(i)))
    .catch((err: Error) => {
      console.error({ err });
      throw err;
    });
};
