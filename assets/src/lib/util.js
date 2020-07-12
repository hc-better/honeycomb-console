export const tryParse = (str, defaultValue = {}) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return defaultValue;
  }
};

/*
 * params: arr
 * return: '["*","*"...]'
 */
export const tryArrToStr = (arr) => {
  try {
    if (!Array.isArray(arr)) throw new Error(false);
    const result = [];

    arr.forEach((e) => {
      result.push(`"${e}"`);
    });

    return `[${result.join(',')}]`;
  } catch (error) {
    return [];
  }
};

export const tryArrToLineBreakStr = (arr) => {
  try {
    if (!Array.isArray(arr)) throw new Error(false);

    return arr.map((e) => e).join('\n');
  } catch (error) {
    return [];
  }
};
