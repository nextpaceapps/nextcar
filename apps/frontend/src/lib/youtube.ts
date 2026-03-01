/**
 * Extract YouTube video ID from various URL formats.
 */
export function extractYoutubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

/**
 * YouTube thumbnail URL. Prefer hqdefault; maxresdefault may 404 for some videos.
 */
export function getYoutubeThumbnailUrl(videoId: string, quality: 'default' | 'hq' | 'maxres' = 'hq'): string {
  const suffix = quality === 'maxres' ? 'maxresdefault' : quality === 'hq' ? 'hqdefault' : 'default';
  return `https://img.youtube.com/vi/${videoId}/${suffix}.jpg`;
}
