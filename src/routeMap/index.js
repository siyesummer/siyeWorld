import { MyWorld, FindWorld, LogQuery } from '../components';

export default [
  {
    path: '/',
    name: 'myWrold',
    component: MyWorld,
    meta: {
      label: '我的世界',
    },
  },
  {
    path: '/findWorld',
    name: 'findWorld',
    component: FindWorld,
    meta: {
      label: '发现世界',
    },
  },
  {
    path: '/log-query',
    name: 'logQuery',
    component: LogQuery,
    meta: {
      label: '日志查询',
    },
  },
];
