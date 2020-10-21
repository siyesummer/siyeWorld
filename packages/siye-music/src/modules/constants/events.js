import EnumType from 'siye-core/src/modules/class/EnumType';

const EVENT_LIST = ['changeAudio', 'nextAudio'];

export default Object.freeze(new EnumType(EVENT_LIST, 'siyeMusic'));
