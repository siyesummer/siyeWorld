<!--
  SEmpty 空状态
  还原 ant-design-vue Empty（默认缺省插画 PRESENTED_IMAGE_DEFAULT）
  props:
    description: 描述文案（为空时不显示默认文案）
  slots:
    default: 补充内容（如自定义文案/操作）
-->
<template>
  <div class="s-empty">
    <div class="s-empty-image">
      <svg width="184" height="152" viewBox="0 0 184 152" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fill-rule="evenodd">
          <g transform="translate(24 31.67)">
            <ellipse
              fill-opacity=".8"
              fill="#F5F5F7"
              cx="67.797"
              cy="106.89"
              rx="67.797"
              ry="12.668"
            />
            <path
              d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
              fill="#AEB8C2"
            />
            <path
              d="M101.537 86.214L80.63 61.102c-1.001-1.207-2.507-1.867-4.048-1.867H31.724c-1.54 0-3.047.66-4.048 1.867L6.769 86.214v13.792h94.768V86.214z"
              fill="url(#linearGradient-1)"
              transform="translate(13.56)"
            />
            <path
              d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
              fill="#F5F5F7"
            />
            <path
              d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.250 2.353 5.250 5.220v.04c0 2.866 2.37 5.180 5.278 5.180h34.604c2.907 0 5.278-2.34 5.278-5.214V74.89c0-2.866 2.343-5.220 5.250-5.220h26.318v33.569c0 .617-.077 1.216-.22 1.793z"
              fill="#DCE0E6"
            />
          </g>
          <path
            d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
            fill="#DCE0E6"
          />
          <g transform="translate(149.65 15.383)" fill="#FFF">
            <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
            <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
          </g>
        </g>
        <defs>
          <linearGradient id="linearGradient-1" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop stop-color="#DDD" offset="0%" />
            <stop stop-color="#FFF" offset="100%" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <p v-if="description" class="s-empty-description">{{ description }}</p>

    <div v-if="$slots.default" class="s-empty-footer">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SEmpty',

  props: {
    description: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="less" scoped>
.s-empty {
  margin: 0 8px;
  font-size: 14px;
  line-height: 1.5;
  text-align: center;
  color: rgba(0, 0, 0, 0.25);

  .s-empty-image {
    height: 100px;
    margin-bottom: 8px;

    svg {
      height: 100%;
      margin: auto;
    }
  }

  .s-empty-description {
    margin: 0;
  }

  .s-empty-footer {
    margin-top: 16px;
  }
}
</style>
