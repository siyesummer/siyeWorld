export default class DragElement {
  // 拖拽元素
  el = null;

  startDrag = false;

  constructor({
    el
  }) {
    this.el = el;
    this.bindEvent();
  }

  handlerMousemove(e) {
    const { el, startDrag } = this;
    if (!startDrag) return;
    const x = e.pageX - el.offsetWidth / 2;
    const y = e.pageY - el.offsetHeight / 2;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
  }

  handlerMousedown() {
    this.startDrag = true;
  }

  handlerMouseup() {
    this.startDrag = false;
  }

  bindEvent() {
    const { el } = this;
    // 确保 `this` 正确
    this.handlerMousedown = this.handlerMousedown.bind(this);
    this.handlerMousemove = this.handlerMousemove.bind(this);
    this.handlerMouseup = this.handlerMouseup.bind(this);

    el.addEventListener('mousedown', this.handlerMousedown.bind(this));
    document.addEventListener('mousemove', this.handlerMousemove);
    el.addEventListener('mouseup', this.handlerMouseup.bind(this));
  }

  clearEvent() {
    const { el, handlerMousemove, handlerMousedown, handlerMouseup } = this;
    document.removeEventListener('mousemove', handlerMousemove);
    el.removeEventListener('mousedown', handlerMousedown);
    el.removeEventListener('mouseup', handlerMouseup);
  }
}
