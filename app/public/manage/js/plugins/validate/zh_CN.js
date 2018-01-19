/*
 * @Author: MUHM
 * @Date: 2018-01-11 11:44:13
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-01-19 11:05:31
 */

$.extend($.validator.messages, {
  required: "必选字段",
  remote: "请修正该字段",
  email: "请输入正确格式的电子邮件",
  url: "请输入合法的网址",
  date: "请输入合法的日期",
  dateISO: "请输入合法的日期 (ISO).",
  number: "请输入合法的数字",
  digits: "只能输入整数",
  creditcard: "请输入合法的信用卡号",
  equalTo: "请再次输入相同的值",
  accept: "请输入拥有合法后缀名的字符串",
  maxlength: $.validator.format("请输入一个长度最多是 {0} 的字符串"),
  minlength: $.validator.format("请输入一个长度最少是 {0} 的字符串"),
  rangelength: $.validator.format("请输入一个长度介于 {0} 和 {1} 之间的字符串"),
  range: $.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
  max: $.validator.format("请输入一个最大为 {0} 的值"),
  min: $.validator.format("请输入一个最小为 {0} 的值")
});

// 中文字两个字节
jQuery.validator.addMethod(
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
jQuery.validator.addMethod("isZipCode", function (value, element) {
  var reg = /^[0-9]{6}$/;
  return this.optional(element) || (reg.test(value));
}, "请正确填写您的邮政编码");
jQuery.validator.addMethod("isTelphone", function (value, element) {
  var reg = /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
  return this.optional(element) || (reg.test(value));
}, "请正确的座机号码类似0571-XXXXXXXX");
jQuery.validator.addMethod("isMobile", function (value, element) {
  var reg = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/;
  return this.optional(element) || (reg.test(value));
}, "请输入正确的手机号码");
jQuery.validator.addMethod("isUserName", function (value, element) {
  var reg = /^[a-zA-Z][a-zA-Z0-9_]{2,15}$/;
  return this.optional(element) || (reg.test(value));
}, "请输入字母开头长度为3-16位的账号");