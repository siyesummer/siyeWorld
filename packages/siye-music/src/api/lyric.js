/**
 * 歌词相关 API
 */
import request from 'siye-core/src/modules/request';

/**
 * 获取歌词（含逐词 YRC 若可用）
 * @param {number|string} songId 歌曲 ID
 * @returns {Promise<{lrc: {lyric: string}, yrc: {lyric: string}} | null>}
 */
export function fetchLyric(songId) {
  return request.get(`lyric/new?id=${songId}`);
}
