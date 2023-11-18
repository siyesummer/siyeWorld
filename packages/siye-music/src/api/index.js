/**
 * api: 网易云音乐相关接口
 */
import request from 'siye-core/src/modules/request';

/**
 * 获取音乐搜索信息
 * @param {String} keywords: 关键词
 * @param {Number} limit: 返回数量 , 默认为 30
 * @param {Number} offset: 偏移数量，用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 * @param {String} type: 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
 */
export function fetchSearchInfo({
  keywords = '',
  limit = 20,
  offset = 0,
  type = '1'
}) {
  return request.get(`search?keywords=${keywords}&limit=${limit}&offset=${offset}&type=${type}`);
}

/**
 * 获取音乐url
 * @param {String} songId: 歌曲d
 */
export function fetchSongInfo(songId) {
  return request.get(`song/url?id=${songId}`);
}

/**
 * 获取音乐详情
 * @param {String} ids:音乐 id, 如 ids=347230, ids=347230,347231
 */
export function fetchSongDetail(ids) {
  return request.get(`song/detail?ids=${ids}`);
}
