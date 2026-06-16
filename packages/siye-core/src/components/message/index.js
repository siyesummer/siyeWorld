/**
 * 自建全局提示 message（替换 ant-design-vue 的 message）
 *
 * 还原 antd message 的命令式 API：
 *   message.success(content, duration)
 *   message.error(content, duration)
 *   message.info(content, duration)
 *   message.warning(content, duration)
 *   message.loading(content, duration)
 *
 * - content: 提示文案
 * - duration: 自动关闭延时（秒），默认 3；为 0 时不自动关闭
 * - 返回值: 手动关闭函数 close()
 *
 * 顶部居中弹出，多条堆叠，带淡入下滑动画；以纯 DOM + 注入样式实现，无第三方依赖。
 */

const PREFIX = 's-message';
const ANIMATION_DURATION = 300; // 离场动画时长(ms)

let container = null;

// antd filled 图标 path（loading 为 outline，旋转）
const ICONS = {
  success:
    '<svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"/></svg>',
  error:
    '<svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"/></svg>',
  info:
    '<svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 010-96 48.01 48.01 0 010 96z"/></svg>',
  warning:
    '<svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 010-96 48.01 48.01 0 010 96z"/></svg>',
  loading:
    '<svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor"><path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"/></svg>',
};

const STYLE = `
.${PREFIX} {
  position: fixed;
  top: 8px;
  left: 0;
  z-index: 1010;
  width: 100%;
  pointer-events: none;
  text-align: center;
}
.${PREFIX}-notice {
  padding: 8px;
  text-align: center;
  transition: opacity ${ANIMATION_DURATION}ms, transform ${ANIMATION_DURATION}ms;
  opacity: 0;
  transform: translateY(-16px);
}
.${PREFIX}-notice-enter {
  opacity: 1;
  transform: translateY(0);
}
.${PREFIX}-notice-leave {
  opacity: 0;
  transform: translateY(-16px);
}
.${PREFIX}-notice-content {
  display: inline-flex;
  align-items: center;
  padding: 9px 16px;
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  line-height: 1.5;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05);
  pointer-events: all;
}
.${PREFIX}-icon {
  display: inline-flex;
  margin-right: 8px;
  font-size: 16px;
  line-height: 0;
}
.${PREFIX}-icon-success { color: #52c41a; }
.${PREFIX}-icon-error { color: #ff4d4f; }
.${PREFIX}-icon-info { color: #1890ff; }
.${PREFIX}-icon-warning { color: #faad14; }
.${PREFIX}-icon-loading {
  color: #1890ff;
  animation: ${PREFIX}-spin 1s linear infinite;
}
@keyframes ${PREFIX}-spin {
  to { transform: rotate(360deg); }
}
`;

function canUseDom() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function injectStyle() {
  if (document.getElementById(`${PREFIX}-style`)) return;
  const style = document.createElement('style');
  style.id = `${PREFIX}-style`;
  style.textContent = STYLE;
  document.head.appendChild(style);
}

function ensureContainer() {
  if (container && document.body.contains(container)) return container;
  injectStyle();
  container = document.createElement('div');
  container.className = PREFIX;
  document.body.appendChild(container);
  return container;
}

function notice(type, content, duration = 3) {
  if (!canUseDom()) return () => {};

  const root = ensureContainer();

  const noticeEl = document.createElement('div');
  noticeEl.className = `${PREFIX}-notice`;
  noticeEl.innerHTML = `
    <div class="${PREFIX}-notice-content">
      <span class="${PREFIX}-icon ${PREFIX}-icon-${type}">${ICONS[type] || ''}</span>
      <span class="${PREFIX}-text"></span>
    </div>
  `;
  // 文案用 textContent 注入，避免 XSS
  noticeEl.querySelector(`.${PREFIX}-text`).textContent = content;
  root.appendChild(noticeEl);

  // 入场动画
  requestAnimationFrame(() => {
    noticeEl.classList.add(`${PREFIX}-notice-enter`);
  });

  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    noticeEl.classList.remove(`${PREFIX}-notice-enter`);
    noticeEl.classList.add(`${PREFIX}-notice-leave`);
    setTimeout(() => {
      if (noticeEl.parentNode) noticeEl.parentNode.removeChild(noticeEl);
      // 容器为空则移除，避免遗留空节点
      if (root.childElementCount === 0 && root.parentNode) {
        root.parentNode.removeChild(root);
        container = null;
      }
    }, ANIMATION_DURATION);
  };

  if (duration > 0) {
    setTimeout(close, duration * 1000);
  }

  return close;
}

const message = {
  success: (content, duration) => notice('success', content, duration),
  error: (content, duration) => notice('error', content, duration),
  info: (content, duration) => notice('info', content, duration),
  warning: (content, duration) => notice('warning', content, duration),
  loading: (content, duration) => notice('loading', content, duration),
};

export default message;
export { message };
