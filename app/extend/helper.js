/*
 * @Author: MUHM
 * @Date: 2017-10-19 16:36:45
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-14 15:19:08
 */
'use strict';
const downsize = require('downsize');
const unidecode = require('unidecode');

module.exports = {
  safeUrl(str) {
    if (str === null) {
      str = '';
    }
    str = str.replace(/£/g, '-');
    str = unidecode(str);
    str = str.replace(/(\s|\.|@|:|\/|\?|#|\[|\]|!|\$|&|\(|\)|\*|\+|,|;|=|\\|%|<|>|\||\^|~|"|\{|\}|`|–|—)/g, '-')
      .replace(/'/g, '')
      .toLowerCase();
    str = str.trim();
    str = str.replace(/-+/g, '-')
      .replace(/-$/, '')
      .replace(/^-/, '');
    return str;
  },
  isUserName(str) {
    return /^[a-zA-Z][a-zA-Z0-9_]{2,15}$/.test(str);
  },
  isEmail(str) {
    return /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(str);
  },
  isMobile(str) {
    return /^1\d{10}$/.test(str);
  },
  isChinese(str) {
    return /^[\u4E00-\u9FA5]+$/.test(str);
  },
  isCardId(str) {
    // const city = [null, null, null, null, null, null, null, null, null, null, null, '北京', '天津', '河北', '山西', '内蒙古', null, null, null, null, null, '辽宁', '吉林', '黑龙江', null, null, null, null, null, null, null, '上海', '江苏', '浙江', '安微', '福建', '江西', '山东', null, null, null, '河南', '湖北', '湖南', '广东', '广西', '海南', null, null, null, '重庆', '四川', '贵州', '云南', '西藏', null, null, null, null, null, null, '陕西', '甘肃', '青海', '宁夏', '新疆', null, null, null, null, null, '台湾', null, null, null, null, null, null, null, null, null, '香港', '澳门', null, null, null, null, null, null, null, null, '国外'];
    if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(str)) {
      return false;
    }
    if (str.length === 15) {
      return true;
    }
    // 加权因子
    const arrExp = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    // 校验码
    const arrValid = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    let sum = 0;
    for (let i = 0; i < str.length - 1; i++) {
      // 对前17位数字与权值乘积求和
      sum += parseInt(str.substr(i, 1), 10) * arrExp[i];
    }
    const idx = sum % 11;
    return arrValid[idx] === str.substr(17, 1).toUpperCase();
  },
  isNull(str) {
    if (str === '' || str === null || str === undefined) {
      return true;
    }
    return false;
  },
  accountWhere(str) {
    return this.isUserName(str) ? { name: str } : this.isMobile(str) ? { mobile: str } : this.isEmail(str) ? { email: str } : null;
  },
  getLimit() {
    const { ctx, isNull } = this;
    return isNull(ctx.query.length) ? null : parseInt(ctx.query.length);
  },
  getOffset() {
    const { ctx, isNull } = this;
    return isNull(ctx.query.start) ? null : parseInt(ctx.query.start);
  },
  getExcerpt(html, truncateOptions) {
    truncateOptions = truncateOptions || {};
    let excerpt = html.replace(/<\/?[^>]+>/gi, '');
    excerpt = excerpt.replace(/(\r\n|\n|\r)+/gm, ' ');

    if (!truncateOptions.words && !truncateOptions.characters) {
      truncateOptions.characters = 100;
      truncateOptions.append = '...'
    }
    return downsize(excerpt, truncateOptions);
  },
};
