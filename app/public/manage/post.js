/*
 * @Author: MUHM
 * @Date: 2018-02-28 17:09:51
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-01 10:29:25
 */

var PostList = function () {
  var self = this;
  self.data = ko.observableArray(null);
  self.empty = { "data": [] };
  self.pagmodel = new Array();
  self.prev = ko.observable(false);
  self.next = ko.observable(false);
  self.pagination = ko.observableArray(null);
  self.pageIndex = 1;
  self.pageSize = 9; //页面大小
  self.goPrev = function () {
    self.getData(-1);
  }
  self.goNext = function () {
    self.getData(1);
  }
  self.click = function (pageIndex) {
    self.pageIndex = pageIndex;
    self.getData();
  }
  self.getData = function (page) {
    self.pageIndex = self.pageIndex + (page ? page : 0);
    $.ajax({
      type: "get",
      contentType: "application/json",
      url: "/manage/api/post?start=" + (self.pageIndex - 1) * self.pageSize + "&length=" + self.pageSize,
      dataType: "json",
      async: false,
      success: function (data) {
        if (data.code = 200) {
          self.setPage(data);
          self.data(data);
          self.pageIndex = data.pageIndex;
          if (data.totalPage > 1) {
            self.pagination(self.pagmodel);
          }
        }
      }
    })
  }
  //设置起止页
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
  }
  self.init = function (elementID) {
    self.data(self.empty);
    self.getData();
    ko.applyBindings(self, document.getElementById(elementID));
  }
}
if (document.getElementById('postList')) {
  var news = new PostList();
  news.init('postList');
}