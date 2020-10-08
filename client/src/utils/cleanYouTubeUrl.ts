// CleanURL
// Keep url with ID only, no playlist
export const cleanYouTubeUrl = (url: string) => {
    const cleanurl = url.split('&list')[0];
    return cleanurl;
};
