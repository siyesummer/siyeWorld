/**
 * 生成枚举对象
 */
import { uniqueId } from 'lodash';

export default class EnumType {
  /**
   * 构造枚举对象
   * @constructor EnumType
   * @param {Array} keys 枚举键名列表
   * @param {String} prefix 枚举值前缀
   */
  constructor(keys = [], prefix = '') {
    if (typeof keys !== 'object' || keys.length < 1) {
      return;
    }

    keys.forEach(k => {
      if (Object.prototype.hasOwnProperty.call(this, k)) {
        throw new Error(`EnumType 中重复定义 key: ${k}`);
      }

      this[k] = uniqueId(prefix);
    });
  }
}
