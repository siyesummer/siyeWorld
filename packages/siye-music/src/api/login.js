/**
 * api: 网易云音乐登录相关接口
 */
import request from 'siye-core/src/modules/request';

/**
 * 获取登录状态
 */
export function fetchLoginStatus(cookie) {
  const timestamp = new Date();
  return request.post(`/login/status?timestamp=${timestamp.valueOf()}`, {
    cookie
  });
}

/**
 * 获取用户账号信息
 */
export function fetchUserAccount() {
  return request.get('/user/account');
}

/**
 * 登录后调用此接口 , 传入用户 id, 可以获取用户详情
 */
export function fetchUserDetail(id) {
  return request.get(`/user/detail?uid=${id}`);
}

/**
 * 传入用户 id, 可获取已喜欢音乐 id 列表(id 数组)
 */
export function fetchLikeList(id) {
  return request.get(`/likelist?uid=${id}`);
}

/**
 * 手机登录
 */
export function cellphoneLogin({ phone, password, captcha }) {
  return request.get(`/login/cellphone?phone=${phone}&password=${password}&captcha=${captcha}`);
}

/**
 * 传入手机号码, 可发送验证码
 */
export function captchaSent(phone) {
  return request.get(`/captcha/sent?phone=${phone}`);
}

/**
 * 传入手机号码和验证码, 可校验验证码是否正确
 */
export function captchaVerify({ phone, captcha }) {
  return request.get(`/captcha/verify?phone=${phone}&captcha=${captcha}`);
}

/**
 * 生成一个二维码 key
 */
export function qrKey() {
  const timestamp = new Date();
  return request.get(`/login/qr/key?timestamp=${timestamp.valueOf()}`);
}

/**
 * 生成一个二维码
 */
export function qrCreate(key) {
  const timestamp = new Date();
  return request.post(`/login/qr/create?key=${key}&qrimg=true&timestamp=${timestamp.valueOf()}`);
}

/**
 * 检测二维码扫码状态
 */
export function qrCheck(key) {
  const timestamp = new Date();
  return request.post(`/login/qr/check?key=${key}&timestamp=${timestamp.valueOf()}&noCookie=true`);
}

/**
 * 游客登录
 */
export function registerAnonimous() {
  const timestamp = new Date();
  return request.post(`/register/anonimous?timestamp=${timestamp.valueOf()}`);
}

/**
 * 调用此接口 , 可刷新登录状态,返回内容包含新的cookie(不支持刷新二维码登录的cookie)
 */
export function loginRefresh() {
  const timestamp = new Date();
  return request.post(`/login/refresh?timestamp=${timestamp.valueOf()}`);
}

/**
 * 退出登录
 */
export function logout() {
  return request.post('/logout');
}
