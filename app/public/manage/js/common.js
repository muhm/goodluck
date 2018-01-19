/*
 * @Author: MUHM
 * @Date: 2017-08-01 11:29:41
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-01-16 11:38:43
 */
/// <reference path="./moment.min.js" />

// 日期格式化 YYYY-MM-DD HH:mm:ss
function dateTimeFormat(str) {
  return str ? moment(str).format('YYYY-MM-DD HH:mm:ss') : '';
}
// 日期格式化 YYYY-MM-DD
function dateFormat(str) {
  return str ? moment(str).format('YYYY-MM-DD') : '';
}

//数据格式适配器
function Adaptor(type, data) {
  if (!data)
    return
  switch (type) {
    case "customer":
      data.yt_reg_time = dateTimeFormat(data.yt_reg_time);
      data.robo_reg_time = dateTimeFormat(data.robo_reg_time);
      data.updated_at = dateTimeFormat(data.updated_at);
      data.created_at = dateTimeFormat(data.created_at);
      break;
    case "user":
      data.last_login = dateTimeFormat(data.last_login);
      data.updated_at = dateTimeFormat(data.updated_at);
      data.created_at = dateTimeFormat(data.created_at);
      break;
    case "invest":
      if (data.lastBuy) {
        data.lastBuy.begin_time = dateTimeFormat(data.lastBuy.begin_time);
        data.lastBuy.end_time = dateTimeFormat(data.lastBuy.end_time);
      }
      if (data.lastEnd) {
        data.lastEnd.begin_time = dateTimeFormat(data.lastEnd.begin_time);
        data.lastEnd.end_time = dateTimeFormat(data.lastEnd.end_time);
      }
      if (data.nextEnd) {
        data.nextEnd.begin_time = dateTimeFormat(data.nextEnd.begin_time);
        data.nextEnd.end_time = dateTimeFormat(data.nextEnd.end_time);
      }
      data.sumInvest = data.sumInvest ? data.sumInvest : 0;
      break;
  }
  return data;
}

// check if browser support HTML5 local storage
function localStorageSupport() {
  return (('localStorage' in window) && window['localStorage'] !== null)
}

// 获取cookie
function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return unescape(arr[2]);
  else
    return null;
}

//清空form
function clearForm(obj) {
  obj.find(':input').not(':button,:submit,:reset').val('').removeAttr('checked').removeAttr('selected');
  obj.find('.fa.fa-calendar').next().text('');
  obj.find('.select2').val(null).trigger("change");
}

// 解决ajax的csrf问题
var csrftoken = getCookie('csrfToken');
function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
  beforeSend: function (xhr, settings) {
    if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
      xhr.setRequestHeader('x-csrf-token', csrftoken);
    }
  },
  error: function (jqXHR, textStatus, errorMsg,a,b) { // 出错时默认的处理函数
    var message = '网络错误';
    if (jqXHR.status == 403) {
      message = '您没有该操作权限';
    } else if (jqXHR.status == 401) {
      message = '登录超时，将在4秒后跳转登录页面';
      setTimeout(function () {
        location.reload();
      }, 4000);
    }
    toastr.options = {
      closeButton: true,
      progressBar: true,
      showMethod: 'slideDown',
      positionClass: "toast-top-center",
      timeOut: 4000
    };
    toastr.error(message);
  }
});