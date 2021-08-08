export default class MoveElement {
  // 点击元素
  el = null;

  // 移动元素
  moveEl = null;

  // 在可见窗体内移动，超出边缘不再移动元素
  moveInWindow = null;

  // 移动元素可见高度
  windowOffsetHeight = 700;

  // 移动元素可见高度
  windowOffsetWidth = 1000;

  // 移动元素可见高度
  moveElOffsetHeight = 700;

  // 移动元素可见高度
  moveElOffsetWidth = 1000;

  startDrag = false;

  constructor({
    el,
    moveEl,
    moveInWindow = true
  } = {}) {
    if (!el) {
      throw new Error('没有移动元素');
    }

    this.el = el;
    this.moveEl = moveEl || el;
    this.moveInWindow = moveInWindow;
    this.getWindowOffset();
    this.getMoveElOffset();
    this.bindEvent();
  }

  getWindowOffset() {
    this.windowOffsetWidth = document.documentElement.offsetWidth;
    this.windowOffsetHeight = document.documentElement.offsetHeight;
  }

  getMoveElOffset() {
    this.moveElOffsetWidth = this.moveEl.offsetWidth;
    this.moveElOffsetHeight = this.moveEl.offsetHeight;
  }

  handlerMousemove(e) {
    e.preventDefault();
    const { el, startDrag, moveEl, windowOffsetWidth, windowOffsetHeight, moveElOffsetWidth, moveElOffsetHeight, moveInWindow } = this;

    if (!startDrag) return;

    const x = e.pageX - el.offsetWidth / 2;
    const y = e.pageY - el.offsetHeight / 2;

    // 到达窗体底部
    const inBottom = y + moveElOffsetHeight > windowOffsetHeight;
    // 到达窗体右侧
    const inRight = x + moveElOffsetWidth > windowOffsetWidth;

    if (moveInWindow && (x < 0 || y < 0 || inBottom || inRight)) return;

    moveEl.style.left = `${x}px`;
    moveEl.style.top = `${y}px`;
  }

  handlerMousedown(e) {
    e.preventDefault();
    this.startDrag = true;
  }

  handlerMouseup(e) {
    e.preventDefault();
    this.startDrag = false;
  }

  handlerResize(e) {
    e.preventDefault();

    this.getWindowOffset();
  }

  bindEvent() {
    const { el } = this;
    // 确保 `this` 正确
    this.handlerMousedown = this.handlerMousedown.bind(this);
    this.handlerMousemove = this.handlerMousemove.bind(this);
    this.handlerMouseup = this.handlerMouseup.bind(this);
    this.handlerResize = this.handlerResize.bind(this);

    el.addEventListener('mousedown', this.handlerMousedown);
    document.addEventListener('mousemove', this.handlerMousemove);
    el.addEventListener('mouseup', this.handlerMouseup);
    window.addEventListener('resize', this.handlerResize);
  }

  clearEvent() {
    const { el, handlerMousemove, handlerMousedown, handlerMouseup, handlerResize } = this;
    document.removeEventListener('mousemove', handlerMousemove);
    el.removeEventListener('mousedown', handlerMousedown);
    el.removeEventListener('mouseup', handlerMouseup);
    window.removeEventListener('resize', handlerResize);
  }
}
