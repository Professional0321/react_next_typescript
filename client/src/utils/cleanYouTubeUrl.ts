// Extract artist name from track.name
// Architects - Doomsday => Architects
export const cleanYouTubeUrl = (url: string) => {
    const cleanurl = url.split('&list')[0];
    return cleanurl;
};
