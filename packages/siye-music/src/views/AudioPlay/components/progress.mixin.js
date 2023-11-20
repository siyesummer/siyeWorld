export default {
  data() {
    return {
      barRefKey: '',
      // 方向horizontal水平，vertical垂直
      direction: 'horizontal',
      // 垂直方向按钮高度限制
      btnMaxHeight: 0,
      autogetRect: true,
    };
  },

  mounted() {
    this.addEvents();

    if (this.autogetRect) this.getBoundingClientRect();
  },

  beforeDestroy() {
    this.removeEvents();
  },

  methods: {
    addEvents() {
      this.mousemoveFn = e => {
        document.removeEventListener('mousemove', this.handlemove);

        this.handleMouseup(e);
      };
      document.addEventListener('mouseup', this.mousemoveFn);
    },

    getBoundingClientRect() {
      const { left, top, right, bottom } = this.$refs[
        this.barRefKey
      ].getBoundingClientRect();
      this.barLeft = left;
      this.barTop = top;
      this.barRight = right;
      this.barBottom = bottom;
    },

    removeEvents() {
      document.removeEventListener('mouseup', this.mousemoveFn);
    },

    getPercent(e) {
      const { clientX } = e;
      const percent = (clientX - this.barLeft) / (this.barRight - this.barLeft);

      return percent;
    },

    // 垂直方向拖拽
    getVerticalPercent(e) {
      const { clientY } = e;
      // eslint-disable-next-line operator-linebreak
      let percent = (this.barBottom - clientY) / (this.barBottom - this.barTop);

      if (percent < 0) percent = 0;
      if (percent > 1) percent = 1;

      return percent;
    },

    // 鼠标拖拽移动，进度实时更新但是不设置播放跳转
    handlemove(e) {
      if (this.direction === 'vertical') {
        const percent = this.calcVerticalPercent(e);
        this.percent = percent * 100;
        this.btnTop = (1 - percent) * this.btnMaxHeight;

        this.$emit('verticalMove', percent);
      } else {
        this.percent = this.calcDragPercent(e) * 100;
      }
    },

    // 鼠标拖拽移动进度结束后，设置播放跳转
    handleMouseup(e) {
      // 点击进度按钮拖拽时才有效
      if (this.btndown) this.$emit('aftermove', this.calcDragPercent(e));

      this.btndown = false;
    },

    // 垂直方向拖拽
    calcVerticalPercent(e) {
      const { clientY } = e;

      let percent = '';

      if (clientY >= this.barBottom) {
        percent = 0;
      } else if (clientY <= this.barTop) {
        percent = 1;
      } else {
        percent = (this.barBottom - clientY) / (this.barBottom - this.barTop);
      }

      if (percent < 0) percent = 0;
      if (percent > 1) percent = 1;

      return percent;
    },

    calcDragPercent(e) {
      const { clientX } = e;

      let percent = '';

      if (clientX <= this.barLeft) {
        percent = 0;
      } else if (clientX >= this.barRight) {
        percent = 1;
      } else {
        percent = (clientX - this.barLeft) / (this.barRight - this.barLeft);
      }

      return percent;
    },

    handleMousedown() {
      document.addEventListener('mousemove', this.handlemove);

      this.$emit('beforemove');

      this.btndown = true;
    },
  },
};
