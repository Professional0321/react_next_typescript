export const getArtistName = (name: string) => {
    const artistName = name.split(' - ')[0];
    return artistName;
};
