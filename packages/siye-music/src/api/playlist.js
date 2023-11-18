/**
 * api: 网易云音乐歌单接口
 */
import request from 'siye-core/src/modules/request';

/**
 * 登录后调用此接口 , 传入用户 id, 可以获取用户歌单
 */
export function userPlaylist({ id, limit = 30, offset = 0 }) {
  return request.post(`/user/playlist?uid=${id}`, {
    limit,
    offset,
  });
}

/**
 * 获取歌单详情
 * @param {number} s 歌单最近的 s 个收藏者,默认为 8
 */
export function playlistDetail({ id, s = 10 }) {
  return request.get(`/playlist/detail?id=${id}`, {
    s,
  });
}

/**
 * 获取歌单所有歌曲
 * @param {number} id 歌单id
 * @param {number} limit 限制获取歌曲的数量，默认值为当前歌单的歌曲数量
 * @param {number} offset
 */
export function playlistTrackAll({ id, limit = 999, offset = 0 }) {
  return request.get(
    `playlist/track/all?id=${id}&limit=${limit}&offset=${offset}`
  );
}
