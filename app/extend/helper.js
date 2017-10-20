/*
 * @Author: MUHM
 * @Date: 2017-10-19 16:36:45
 * @Last Modified by: MUHM
 * @Last Modified time: 2017-10-20 11:26:25
 */
'use strict';

module.exports = {
  isUserName(str) {
    return /^[a-zA-Z0-9_]{3,16}$/.test(str);
  },
  isEmail(str) {
    return /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(str);
  },
  isPhone(str) {
    return /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/.test(str);
  },
  isChinese(str) {
    return /^[\u4E00-\u9FA5]+$/.test(str);
  },
  isCardId(str) {
    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(str);
  },
  isNull(str) {
    if (str === '' || str === null || str === undefined) {
      return true;
    }
    return false;
  },
  accountWhere(str) {
    return this.isUserName(str) ? { name: str } : this.isPhone(str) ? { phone: str } : this.isEmail(str) ? { email: str } : null;
  },
};
