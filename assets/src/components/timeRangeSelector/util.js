import moment from 'moment';

export const timeUnitAlias2MsMap = {
  s: 1000,
  m: 1000 * 60,
  h: 1000 * 60 * 60,
  d: 1000 * 60 * 60 * 24,
  w: 1000 * 60 * 60 * 24 * 7,
};

export const timeUnitAlias2CompleteTimeMap = {
  s: 'Seconds',
  m: 'Minutes',
  h: 'Hours',
  d: 'Days',
  w: 'Weeks',
};

export const timeUnitAlias2CompleteTimeChMap = {
  s: '秒',
  m: '分钟',
  h: '小时',
  d: '天',
  w: '周',
};

/**
 * translate '10s' to '10 秒'
 * @param {string} timeAlias
 * @returns {string}
 */

export function translateTimeAliasToCh(timeAlias) {
  try {
    const [, count, unit] = timeAlias.match(/^(\d+)([a-zA-Z])$/);

    console.log(count, unit);
    // 10 m

    return `${count} ${timeUnitAlias2CompleteTimeChMap[unit]}`;
  } catch (e) {
    console.error(e);

    return 'invalid timeAlias format';
  }
}

/**
 * translate '10s' to '10 秒'
 * @param {string} timeAlias
 * @returns {string}
 */
export function getMsFromTimeAlias(timeAlias) {
  const {count, unit} = splitTimeAlias(timeAlias);

  console.log(count, unit);
  const r = moment().subtract(count, unit);

  console.log('moment =>>', r.format('YYYY-MM-DD-HH-mm'));

  return count * timeUnitAlias2MsMap[unit];
}

/**
 * 分隔时间和单位
 * @param {string} timeAlias
 * @returns {string}
 */
export function splitTimeAlias(timeAlias) {
  try {
    const [, count, unit] = timeAlias.match(/^(\d+)([a-zA-Z])$/);

    return {
      count,
      unit,
    };
  } catch (e) {
    return {
      count: 0,
      unit: 's',
    };
  }
}
