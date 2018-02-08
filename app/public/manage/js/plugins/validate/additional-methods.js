/*
 * @Author: MUHM
 * @Date: 2018-01-23 11:18:02
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-02-08 14:33:33
 */
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["jquery", "./jquery.validate"], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory(require("jquery"));
  } else {
    factory(jQuery);
  }
}(function ($) {

  (function () {

    function stripHtml(value) {

      // Remove html tags and space chars
      return value.replace(/<.[^<>]*?>/g, " ").replace(/&nbsp;|&#160;/gi, " ")

        // Remove punctuation
        .replace(/[.(),;:!?%#$'\"_+=\/\-“”’]*/g, "");
    }

    $.validator.addMethod("maxWords", function (value, element, params) {
      return this.optional(element) || stripHtml(value).match(/\b\w+\b/g).length <= params;
    }, $.validator.format("Please enter {0} words or less."));

    $.validator.addMethod("minWords", function (value, element, params) {
      return this.optional(element) || stripHtml(value).match(/\b\w+\b/g).length >= params;
    }, $.validator.format("Please enter at least {0} words."));

    $.validator.addMethod("rangeWords", function (value, element, params) {
      var valueStripped = stripHtml(value),
        regex = /\b\w+\b/g;
      return this.optional(element) || valueStripped.match(regex).length >= params[0] && valueStripped.match(regex).length <= params[1];
    }, $.validator.format("Please enter between {0} and {1} words."));

  }());
  // 中文字两个字节
  $.validator.addMethod(
    "byteRangeLength",
    function (value, element, param) {
      var length = value.length;
      for (var i = 0; i < value.length; i++) {
        if (value.charCodeAt(i) > 127) {
          length++;
        }
      }
      return this.optional(element) || (length >= param[0] && length <= param[1]);
    },
    $.validator.format("请确保输入的值在{0}-{1}个字节之间(一个中文字算2个字节)")
  );

  // 邮政编码验证   
  $.validator.addMethod("isZipCode", function (value, element) {
    var reg = /^[0-9]{6}$/;
    return this.optional(element) || (reg.test(value));
  }, "请正确填写您的邮政编码");
  $.validator.addMethod("isTelphone", function (value, element) {
    var reg = /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
    return this.optional(element) || (reg.test(value));
  }, "请正确的座机号码类似0571-XXXXXXXX");
  $.validator.addMethod("isMobile", function (value, element) {
    var reg = /^1\d{10}$/;
    return this.optional(element) || (reg.test(value));
  }, "请输入正确的手机号码");
  $.validator.addMethod("isUserName", function (value, element) {
    var reg = /^[a-zA-Z][a-zA-Z0-9_]{2,15}$/;
    return this.optional(element) || (reg.test(value));
  }, "请输入字母开头长度为3-16位的账号");
  return $;
}));

