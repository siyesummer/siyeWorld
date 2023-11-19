export default {
  data() {
    return {
      barRefKey: '',
      // TODO方向horizontal，vertical
      direction: 'horizontal',
    };
  },

  mounted() {
    this.addEvents();

    const { left, top, right } = this.$refs[
      this.barRefKey
    ].getBoundingClientRect();
    this.barLeft = left;
    this.barTop = top;
    this.barRight = right;
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

    removeEvents() {
      document.removeEventListener('mouseup', this.mousemoveFn);
    },

    getPercent(e) {
      const { clientX } = e;
      const percent = (clientX - this.barLeft) / (this.barRight - this.barLeft);

      return percent;
    },

    // 鼠标拖拽移动，进度实时更新但是不设置播放跳转
    handlemove(e) {
      this.percent = this.calcDragPercent(e) * 100;
    },

    // 鼠标拖拽移动进度结束后，设置播放跳转
    handleMouseup(e) {
      // 点击进度按钮拖拽时才有效
      if (this.btndown) this.$emit('aftermove', this.calcDragPercent(e));

      this.btndown = false;
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
