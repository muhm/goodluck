/*
 * @Author: MUHM
 * @Date: 2018-03-23 14:44:42
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-23 17:32:09
 */

// 获取cookie
function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return unescape(arr[2]);
  else
    return null;
}
// 获取csrf
function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
var csrftoken = getCookie("csrfToken");
$.ajaxSetup({
  beforeSend: function (xhr, settings) {
    if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
      xhr.setRequestHeader("x-csrf-token", csrftoken);
    }
  }
});
if (document.getElementsByClassName('tags')) {
  var tagModel = {
    data: ko.observableArray(null),
  };
  $.ajax({
    url: "/api/tag/list",
    method: "get",
    dataType: "json",
    success: function (res) {
      if (res.code == 200) {
        tagModel.data(res.data);
        ko.applyBindings(tagModel, document.getElementsByClassName('tags')[0]);
      }
    },
  });
}
function PostModel() {
  var self = this;
  self.searchTag = ko.observable(null);
  self.searchAuthor = ko.observable(null);
  self.url = '/api/post/list';
  self.type = 'get';
  self.data = ko.observableArray(null);
  self.empty = { "data": [] };
  self.pagmodel = new Array();
  self.prev = ko.observable(false);
  self.next = ko.observable(false);
  self.pagination = ko.observableArray(null);
  self.pageIndex = 1;
  self.pageSize = 5;
  self.flag = true;
  self.goPrev = function () {
    self.getData(-1);
  };
  self.goNext = function () {
    self.getData(1);
  };
  self.click = function (pageIndex) {
    self.pageIndex = pageIndex;
    self.getData();
  };
  self.getData = function (page) {
    self.pageIndex = self.pageIndex + (page ? page : 0);
    if (!self.flag) {
      return;
    }
    self.flag = !self.flag;
    var url = self.url + "?start=" + (self.pageIndex - 1) * self.pageSize + "&length=" + self.pageSize;
    if (self.searchTag()) {
      url += "&tag_id=" + self.searchTag();
    }
    $.ajax({
      type: self.type,
      contentType: "application/json",
      url,
      dataType: "json",
      success: function (data) {
        if (data.code = 200) {
          self.flag = !self.flag;
          self.setPage(data);
          self.data(data);
          self.pageIndex = data.pageIndex;
          if (data.totalPage > 1) {
            self.pagination(self.pagmodel);
          }
        }
      },
      error: function () {
        self.flag = !self.flag;
      }
    })
  };
  self.setPage = function (data) {
    self.pagmodel = new Array();
    var startpage = 1;
    var endpage = 1;
    if (data.totalPage < 3) {
      startpage = 1;
      endpage = data.totalPage;
    } else {
      if ((data.pageIndex + 2) >= data.totalPage) {
        startpage = data.totalPage - 2;
        endpage = data.totalPage;
      }
      else {
        if ((data.pageIndex - 2) <= 0) {
          startpage = 1;
          endpage = 3;
        }
        else {
          startpage = data.pageIndex - 1;
          endpage = data.pageIndex + 1;
        }
      }
    }
    for (var i = startpage; i <= endpage; i++) {
      if (i == data.pageIndex) {
        self.pagmodel.push({ "text": i, "index": i, "check": true });
      } else {
        self.pagmodel.push({ "text": i, "index": i, "check": false });
      }
    }
    if (startpage != 1) {
      if (startpage != 2) {
        self.pagmodel.unshift({ "text": "...", "index": startpage - 1, "check": false });
      }
      if (data.pageIndex != 1) {
        self.pagmodel.unshift({ "text": 1, "index": 1, "check": false });
      }
    }
    if (endpage != data.totalPage && endpage != data.totalPage - 1) {
      self.pagmodel.push({ "text": "...", "index": endpage + 1, "check": false });
      if (endpage != data.totalPage - 1) {
        self.pagmodel.push({ "text": data.totalPage, "index": data.totalPage, "check": false });
      }
    }
    if (endpage == data.totalPage - 1) {
      self.pagmodel.push({ "text": data.totalPage, "index": data.totalPage, "check": false });
    }
    data.pageIndex == 1 ? self.prev(false) : self.prev(true);
    (data.pageIndex != data.totalPage && data.totalPage > 1) ? self.next(true) : self.next(false);
  };
  self.init = function (elementID, tag, url, type, pageSize) {
    self.url = url || self.url;
    self.type = type || self.type;
    self.pageSize = pageSize || self.pageSize
    self.data(self.empty);
    if (tag) {
      self.searchTag(tag);
    }
    self.getData();
    ko.applyBindings(self, document.getElementById(elementID));
  };
};
if (document.getElementById('posts_section')) {
  var postModel = new PostModel();
  postModel.init('posts_section');
}
if (document.getElementById('tag_section')) {
  var locationArray = location.pathname.split('/');
  var tagInfo = ko.observableArray(null);
  tagInfo({ name: '', description: '' });
  ko.applyBindings(tagInfo, document.getElementById('tag_info'));
  var postModel = new PostModel();
  postModel.searchTag(locationArray[locationArray.length - 1]);
  postModel.init('post_list');
  $.ajax({
    url: "/api/tag/show/" + locationArray[locationArray.length - 1],
    method: "get",
    dataType: "json",
    success: function (res) {
      if (res.code == 200) {
        tagInfo(res.data);
      }
    },
  });
}
