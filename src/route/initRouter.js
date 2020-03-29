import Router from 'vue-router';
import {
  isFunction
} from 'lodash';

class SiyeRouter extends Router {
  /** 重写路由push方法 避免路由中添加了相同的路由报错问题
   * @override
   */
  push(location, onComplete, onAbort) {
    super.push(
      location,
      () => {
        if (isFunction(onComplete)) {
          onComplete();
        }
      },
      onAbort
    );
  }
}

export default SiyeRouter;
