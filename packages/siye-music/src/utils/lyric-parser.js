/**
 * 歌词解析器 — 优先解析 YRC（逐词毫秒时间戳），LRC 兜底
 *
 * 输出统一结构：
 * [{ time: Number, text: String, words: [{ text: String, start: Number, end: Number }] }]
 */

/**
 * 从 YRC 原始数据中提取 JSON 元信息行和歌词行
 *
 * YRC 混合了三种行：
 * 1. JSON 元信息: `{"t":0,"c":[{"tx":"作词: "},{"tx":"赵大白"}]}`
 * 2. 行头: `[lineStartMs,lineDurationMs]`
 * 3. 词段: `(startMs,durMs,flag)text`
 */
function parseYrc(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const lines = raw.split('\n').filter(Boolean);
  const result = [];

  let currentLineTime = null;

  lines.forEach(line => {
    // JSON 元信息行
    if (line.startsWith('{') && line.endsWith('}')) {
      try {
        const obj = JSON.parse(line);
        const parts = (obj.c || []).map(c => c.tx || '').filter(Boolean);
        if (parts.length) {
          result.push({
            time: obj.t || 0,
            text: parts.join(''),
            words: [],
            meta: true,
          });
        }
      } catch (e) { /* 忽略解析失败的 JSON 行 */ }
      return;
    }

    // 行头: [startMs,durationMs]（可能独占一行，也可能后跟词段）
    const headerMatch = line.match(/^\[(\d+),(\d+)\](.*)/);
    if (headerMatch) {
      currentLineTime = parseInt(headerMatch[1], 10);
      const rest = headerMatch[3];
      if (!rest) return;
      line = rest;
    }

    // 词段: (startMs,durMs,flag)text
    if (currentLineTime === null) return;

    const words = [];
    const segRegex = /\((\d+),(\d+),\d+\)([^(]*)/g;
    let match;

    while ((match = segRegex.exec(line)) !== null) {
      const startMs = parseInt(match[1], 10);
      const durMs = parseInt(match[2], 10);
      const text = match[3];

      if (text && text.trim()) {
        words.push({ text: text.trim(), start: startMs, end: startMs + durMs });
      }
    }

    if (words.length === 0) {
      const cleanText = line.replace(/\(\d+,\d+,\d+\)/g, '');
      if (cleanText) {
        result.push({ time: currentLineTime, text: cleanText, words: [] });
      }
      return;
    }

    result.push({
      time: currentLineTime,
      text: words.map(w => w.text).join(''),
      words,
    });
  });

  // 仅 JSON 元信息无实际歌词时返回 null，降级到 LRC
  const hasLyric = result.some(line => !line.meta);
  return hasLyric ? result : null;
}

/**
 * 解析标准 LRC 格式（行级歌词）
 * 格式: `[mm:ss.xx]lyric text\n`
 */
function parseLrc(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const lines = raw.split('\n').filter(Boolean);
  const result = [];

  lines.forEach(line => {
    // 去除行尾 \r
    const cleanLine = line.replace(/\r$/, '');
    // 匹配 [mm:ss.xx] 或 [mm:ss.xxx]
    const match = cleanLine.match(/^\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/);
    if (!match) return;

    const minutes = parseInt(match[1], 10);
    const seconds = parseInt(match[2], 10);
    const msPart = match[3].length === 2
      ? parseInt(match[3], 10) * 10
      : parseInt(match[3], 10);
    const text = (match[4] || '').trim();
    // 过滤空行、纯数字标点行（如 "19.29"）
    if (!text || /^[\d.:\s]+$/.test(text)) return;

    const time = minutes * 60000 + seconds * 1000 + msPart;
    result.push({ time, text, words: [] });
  });

  return result.length ? result : null;
}

/**
 * 从 YRC 原始数据中仅提取 JSON 元信息（无 YRC 逐词时降级用）
 */
function parseYrcMeta(raw) {
  if (!raw) return [];
  const lines = raw.split('\n').filter(Boolean);
  const meta = [];
  let firstLyricTime = Infinity;
  lines.forEach(line => {
    if (line.startsWith('{') && line.endsWith('}')) {
      try {
        const obj = JSON.parse(line);
        const parts = (obj.c || []).map(c => c.tx || '').filter(Boolean);
        if (parts.length) {
          meta.push({
            time: obj.t || 0,
            text: parts.join(''),
            words: [],
            meta: true,
          });
        }
      } catch (e) { /* ignore */ }
    } else {
      // 找到第一条实际歌词行的时间戳（LRC 或 YRC 格式均可）
      const lrcMatch = line.match(/^\[(\d{2}):(\d{2})\.(\d{2,3})\]/);
      const yrcMatch = line.match(/^\[(\d+),(\d+)\]/);
      if (firstLyricTime === Infinity) {
        if (lrcMatch) {
          firstLyricTime = parseInt(lrcMatch[1], 10) * 60000 + parseInt(lrcMatch[2], 10) * 1000;
        } else if (yrcMatch) {
          firstLyricTime = parseInt(yrcMatch[1], 10);
        }
      }
    }
  });
  // 只保留歌词开始前的元信息（作词/作曲等），过滤掉片尾 staff 信息
  return meta.filter(m => m.time < firstLyricTime);
}

/**
 * 提取 LRC 元信息行（如 [ti:][ar:][by:] 等）
 */
function parseLrcMeta(raw) {
  if (!raw) return [];
  const lines = raw.split('\n');
  const meta = [];
  lines.forEach(line => {
    const m = line.match(/^\[(\w+):(.*)\]$/);
    if (m) {
      const key = m[1];
      const val = m[2].trim();
      if (val) meta.push({ time: -1, text: val, words: [], meta: true, metaKey: key });
    }
  });
  return meta;
}

/**
 * 解析歌词：优先 YRC（逐词），不行转 LRC
 * @param {string} yrcRaw  YRC 原始字符串
 * @param {string} lrcRaw  LRC 原始字符串
 * @returns {Array|null} 解析后的歌词数组，或 null
 */
/**
 * 过滤无意义行（空行、纯时间戳、纯标点、歌手标签等无实质文本）
 */
function filterJunk(lines) {
  return lines.filter(line => {
    const t = (line.text || '').trim();
    // 空行
    if (!t) return false;
    // 纯数字/点/冒号/空格（如 "19.29"）
    if (/^[\d.:\s]+$/.test(t)) return false;
    // 行首的裸时间戳残留（如 "[00:19.29]"）
    if (/^\[\d{2}:\d{2}\.\d{2,3}\]\s*$/.test(t)) return false;
    return true;
  });
}

export function parseLyric(yrcRaw, lrcRaw) {
  // JSON 元信息可能出现在 yrc 或 lrc 字段中，按文本去重
  const seenText = new Set();
  const yrcMeta = [...parseYrcMeta(yrcRaw), ...parseYrcMeta(lrcRaw)]
    .filter(m => seenText.has(m.text) ? false : !!seenText.add(m.text));
  const lrcMeta = parseLrcMeta(lrcRaw)
    .filter(m => seenText.has(m.text) ? false : !!seenText.add(m.text));
  const meta = [...lrcMeta, ...yrcMeta];

  // 优先 YRC逐词（有词级时序效果最好）
  const yrc = parseYrc(yrcRaw);
  if (yrc) {
    const yrcLyric = yrc.filter(l => !l.meta);
    return filterJunk([...meta, ...yrcLyric]);
  }

  // 降级 LRC
  const lrc = parseLrc(lrcRaw);
  if (lrc) return filterJunk([...meta, ...lrc]);

  return meta.length ? filterJunk(meta) : null;
}

export default parseLyric;
