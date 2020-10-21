// eslint-disable-next-line import/no-extraneous-dependencies
import Vue from 'vue';

const EVENT_MAP = ['on', 'off', 'emit', 'once'];

export default class EventBus {
  constructor() {
    this.setEventBus();
  }

  setEventBus() {
    const el = new Vue();

    EVENT_MAP.forEach(i => {
      this[i] = el[`$${i}`].bind(el);
    });
  }
}
