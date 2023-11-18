/**
 * api: 网易云音乐歌单接口
 */
import request from 'siye-core/src/modules/request';

/**
 * 调用此接口 , 传入音乐 id 和 limit 参数 , 可获得该音乐的所有评论 ( 不需要登录 )
 */
export function commentMusic({ id, limit = 30, offset = 0 }) {
  return request.get(`/comment/music?id=${id}&limit=${limit}&offset=${offset}`);
}

/**
 * 调用此接口 , 传入 type, 资源 id 可获得对应资源热门评论 ( 不需要登录 )
 */
export function commentHot({ id, type = 0, limit = 20, offset = 0 }) {
  return request.post('/comment/hot', {
    id,
    type,
    limit,
    offset,
  });
}
