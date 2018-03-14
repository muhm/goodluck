/*
 * @Author: MUHM
 * @Date: 2017-07-20 15:15:44
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-14 10:43:34
 */
/// <reference path="./moment.min.js" />

//menu
function fn_menujson(data, parent_id, url) {
  var result = [],
    temp;
  for (var i = 0; i < data.length; i++) {
    if (data[i].parent_id == parent_id) {
      var obj = {
        name: data[i].name,
        id: data[i].id,
        url: data[i].url,
        icon: data[i].icon,
        parent_id: data[i].parent_id == 0 ? "" : data[i].parent_id,
        controller: data[i].controller,
        children: [],
        active: url && url.indexOf(data[i].url) > -1 ? 'active' : '',
      };
      temp = fn_menujson(data, data[i].id, url);
      if (temp.length > 0) {
        if (url) {
          for (var j = 0; j < temp.length; j++) {
            if (temp[j].active == 'active') {
              obj.active = temp[j].active;
            }
          }
        }
        obj.children = temp;
      }
      result.push(obj);
    }
  }
  return result;
}
function fn_checkmenu(parent_id) {
  if (parent_id != "side-menu") {
    $("#" + parent_id).parent().addClass("active")
    fn_checkmenu($("#" + parent_id).parent().parent().attr("id"))
  }
}

function fn_menu(data, url) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].children) {
      if (data[i].parent_id == "") {
        $("#side-menu" + data[i].parent_id).append('<li><a href="#"> <i class="w-16 fa ' + data[i].icon + ' fa-lg"></i><span class="nav-label">' + data[i].name + '</span><span class="fa arrow"></span></a><ul id="side-menu' + data[i].id + '" class="nav nav-second-level collapse"></ul></li>');
      } else {
        $("#side-menu" + data[i].parent_id).append('<li><a href="#"> <i class="w-14 fa ' + data[i].icon + ' "></i><span class="nav-label">' + data[i].name + '</span><span class="fa arrow"></span></a><ul id="side-menu' + data[i].id + '" class="nav nav-third-level collapse"></ul></li>');
      }
      fn_menu(data[i].children, url);
    } else {
      var active = ""
      if (url.indexOf(data[i].url) > -1) {
        active = "active";
        fn_checkmenu("side-menu" + data[i].parent_id)
      }
      if (data[i].parent_id == "") {
        $("#side-menu" + data[i].parent_id).append('<li class="' + active + '"><a href="' + data[i].url + '"><i class="w-16 fa ' + data[i].icon + ' fa-lg"></i><span class="nav-label">' + data[i].name + '</span></a></li>')
      } else {
        $("#side-menu" + data[i].parent_id).append('<li class="' + active + '"><a href="' + data[i].url + '"><i class="w-14 fa ' + data[i].icon + '"></i>' + data[i].name + '</a></li>')
      }
    }
  }
}

function fn_permissions(url) {
  if (localStorageSupport()) {
    if (localStorage.permissions) {
      var permissions = JSON.parse(localStorage.permissions);
      return get_permissions(permissions, url);
    } else {
      return $.ajax({
        type: "get",
        contentType: "application/json",
        url: '/api/user/permission',
        dataType: "json",
        async: false,
        success: function (data) {
          if (data.code == 200) {
            localStorage.permissions = JSON.stringify(data.data);
            return get_permissions(data.data, url);
          }
        }
      })
    }
  } else {
    return $.ajax({
      type: "get",
      contentType: "application/json",
      url: '/api/user/permission',
      dataType: "json",
      async: false,
      success: function (data) {
        if (data.code == 200) {
          return get_permissions(data.data, url);
        }
      }
    })
  }
}

function get_permissions(permissions, url) {
  return permissions.find(function (item) { return item.url === url }) ? true : false;
}

function fn_permission(data, parent_id) {
  var result = [], temp;
  for (var i = 0; i < data.length; i++) {
    if (data[i].parent_id == parent_id) {
      var obj = { "name": data[i].name, "id": data[i].id, "parent_id": data[i].parent_id };
      temp = fn_menujson(data, data[i].id);
      if (temp.length > 0) {
        obj.children = temp;
      }
      result.push(obj);
    }
  }
  return result;
}

function fn_show_permission(data) {
  for (var i = 0; i < data.length; i++) {
    $("#permission" + data[i].parent_id).append('<ul id="permission' + data[i].id + '"><li><input name="permissions" type="checkbox" value="' + data[i].id + '" />' + data[i].name + '</li></ul>')
    $("#p" + data[i].parent_id).append('<ul id="p' + data[i].id + '"><li><input id="cb' + data[i].id + '" name="permissions" type="checkbox" value="' + data[i].id + '" />' + data[i].name + '</li></ul>')
    if (data[i].children) {
      fn_show_permission(data[i].children);
    }
  }
}

// 日期格式化 YYYY-MM-DD HH:mm:ss
function dateTimeFormat(str) {
  return str ? moment(str).format('YYYY-MM-DD HH:mm:ss') : '';
}
// 日期格式化 YYYY-MM-DD
function dateFormat(str) {
  return str ? moment(str).format('YYYY-MM-DD') : '';
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

//getQueryString
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]); return null;
}
// 清空form
function clearForm(obj) {
  obj.find(':input').not(':button,:submit,:reset').val('').removeAttr('checked').removeAttr('selected');
  obj.find('.fa.fa-calendar').next().text('');
  obj.find('.select2').val(null).trigger("change");
}
// 分页
function dataPage() {
  var self = this;
  self.url = '';
  self.type = 'get';
  self.data = ko.observableArray(null);
  self.empty = { "data": [] };
  self.pagmodel = new Array();
  self.prev = ko.observable(false);
  self.next = ko.observable(false);
  self.pagination = ko.observableArray(null);
  self.pageIndex = 1;
  self.pageSize = 9; //页面大小
  self.flag = true;
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
    if (!self.flag) {
      return;
    }
    self.flag = !self.flag;
    $.ajax({
      type: self.type,
      contentType: "application/json",
      url: self.url + "?start=" + (self.pageIndex - 1) * self.pageSize + "&length=" + self.pageSize,
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
  self.init = function (elementID, url, type, pageSize) {
    self.url = url;
    self.type = type || self.type;
    self.pageSize = pageSize || self.pageSize
    self.data(self.empty);
    self.getData();
    ko.applyBindings(self, document.getElementById(elementID));
  }
}
// 获取csrf
function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
//初始化左侧菜单
(function () {
  var locationUrl = location.pathname;
  var menuUrl = '/manage/api/menu';
  var menuModel = {
    menus: ko.observableArray(null),
  };
  ko.applyBindings(menuModel, document.getElementById("side-menu"));
  if (localStorageSupport()) {
    if (localStorage.menu) {
      menuModel.menus(fn_menujson(JSON.parse(localStorage.menu), 0, locationUrl));
      // fn_menu(JSON.parse(localStorage.menu), locationUrl);
      $("#side-menu").metisMenu();
    } else {
      $.ajax({
        type: "get",
        contentType: "application/json",
        url: menuUrl,
        dataType: "json",
        async: true,
        success: function (data) {
          localStorage.menu = JSON.stringify(data.data);
          var menu = fn_menujson(data.data, 0, locationUrl);
          menuModel.menus(menu);
          // fn_menu(menu, locationUrl);
          $("#side-menu").metisMenu();
        }
      })
    }
  } else {
    $.ajax({
      type: "get",
      contentType: "application/json",
      url: menuUrl,
      dataType: "json",
      async: true,
      success: function (data) {
        var menu = fn_menujson(data.data, 0, locationUrl);
        menuModel.menus(menu);
        // fn_menu(menu, locationUrl);
        $("#side-menu").metisMenu();
      }
    })
  }
})();
// toastr配置
toastr.options = {
  closeButton: true,
  progressBar: true,
  showMethod: 'slideDown',
  positionClass: "toast-top-center",
  timeOut: 4000
};
// 解决ajax的csrf问题
var csrftoken = getCookie("csrfToken");
$.ajaxSetup({
  beforeSend: function (xhr, settings) {
    if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
      xhr.setRequestHeader("x-csrf-token", csrftoken);
    }
  },
  error: function (jqXHR, textStatus, errorMsg, a, b) { // 出错时默认的处理函数
    console.log(jqXHR, textStatus, errorMsg, a, b);
    var message = jqXHR.responseJSON.msg || "网络错误";
    if (jqXHR.status == 401) {
      message += "登录超时，将在4秒后跳转登录页面";
      setTimeout(function () {
        location.reload();
      }, 4000);
    }
    toastr.error(jqXHR.responseJSON.msg || message);
  }
});
var oTable, url, update, destroy;
if (document.getElementById("postList")) {
  var posts = new dataPage();
  posts.init("postList", "/manage/api/post");
}

if (document.getElementById("tagList")) {
  var tags = new dataPage();
  tags.init("tagList", "/manage/api/tag");
}
// site 
if (document.getElementById("content-site")) {
  var SiteUpdateModel = ko.observableArray(null);
  SiteUpdateModel({ id: "", key: "", value: "", type: "" });
  ko.applyBindings(SiteUpdateModel, document.getElementById("form-site-update"));
  url = "/manage/api/site";
  oTable = $("#table-site").DataTable({
    ordering: false,
    bAutoWidth: false,
    pageLength: 10,
    responsive: true,
    bStateSave: true,
    bServerSide: true,
    searching: false,
    ajax: url,
    dom: '<"html5buttons"B>lTgitp',
    aoColumns: [{
      mDataProp: "key"
    }, {
      mDataProp: "value"
    }, {
      mDataProp: "type"
    }, {
      mDataProp: "updated_at",
      mRender: function (data, type, full) {
        if (data) {
          data = dateTimeFormat(data);
        }
        return data;
      }
    }, {
      mDataProp: "id",
      mRender: function (data, type, full) {
        return '<a href="javascript:update(\'' + data + '\')" ><i class="fa fa-pencil" title="修改"></i></a>';
      }
    },],
    buttons: [
    ]
  });
  update = function (id) {
    $.ajax({
      url: url + "/" + id,
      method: "get",
      dataType: "json",
      success: function (res) {
        if (res.code == 200) {
          $("#modal-site-update").modal("show");
          SiteUpdateModel(res.data);
        } else {
          toastr.error(res.msg);
          $("#modal-site-update").modal("hide");
        }
      },
    });
  }
  jQuery(function ($) {
    if (document.getElementById("content-site")) {
      $("#form-site-update").validate({
        submitHandler: function (form) {
          $.ajax({
            url: $(form)[0].action,
            method: "put",
            dataType: "json",
            data: $(form).serialize(),
            success: function (data) {
              if (data.code == 200) {
                swal({
                  title: "success",
                  text: data.msg,
                  type: "success"
                },
                  function (isConfirm) {
                    $("#modal-site-update").modal("hide");
                    search();
                  });
              } else {
                toastr.error(data.msg);
              }
            }
          })
        }
      });
    }
  });
}
// role
if (document.getElementById("content-role")) {
  var RoleUpdateModel = ko.observableArray(null);
  RoleUpdateModel({ id: "", name: "", description: "" });
  ko.applyBindings(RoleUpdateModel, document.getElementById("form-role-update"));
  url = "/manage/api/role";
  oTable = $("#table-role").DataTable({
    ordering: false,
    bAutoWidth: false,
    pageLength: 10,
    responsive: true,
    bStateSave: true,
    bServerSide: true,
    searching: false,
    ajax: url,
    dom: '<"html5buttons"B>lTgitp',
    aoColumns: [{
      mDataProp: "name"
    }, {
      mDataProp: "description"
    }, {
      mDataProp: "created_at",
      mRender: function (data, type, full) {
        if (data) {
          data = dateTimeFormat(data);
        }
        return data;
      }
    }, {
      mDataProp: "updated_at",
      mRender: function (data, type, full) {
        if (data) {
          data = dateTimeFormat(data);
        }
        return data;
      }
    }, {
      mDataProp: "id",
      mRender: function (data, type, full) {
        return '<a href="javascript:update(\'' + data + '\')" ><i class="fa fa-pencil" title="修改"></i></a>'
          + ' | <a href="javascript:destroy(\'' + data + '\')" ><i class="fa fa-trash-o text-danger" title="删除"></i></a>'
      }
    },],
    buttons: [
    ]
  });
  update = function (id) {
    $("#form-role-update input[name='permissions']").removeAttr("checked");
    $.ajax({
      url: url + "/" + id,
      method: "get",
      dataType: "json",
      success: function (res) {
        if (res.code == 200) {
          $("#modal-role-update").modal("show");
          RoleUpdateModel(res.data.role);
          for (var i = 0; i < res.data.permissions.length; i++) {
            $("#cb" + res.data.permissions[i].id).prop("checked", "checked");
          }
        } else {
          toastr.error(res.msg);
          $("#modal-role-update").modal("hide");
        }
      },
    });
  }
  destroy = function (id) {
    $.ajax({
      url: url + "/" + id,
      method: "delete",
      dataType: "json",
      success: function (res) {
        if (res.code == 200) {
          toastr.success(res.msg);
          search();
        } else {
          toastr.error(res.msg);
        }
      },
    });
  }
  jQuery(function ($) {
    if (document.getElementById("content-role")) {
      if (localStorage.permission) {
        fn_show_permission(JSON.parse(localStorage.permission))
      } else {
        $.ajax({
          type: "get",
          contentType: "application/json",
          url: "/manage/api/permission",
          dataType: "json",
          async: true,
          success: function (data) {
            var permission = fn_permission(data.data.rows, 0);
            localStorage.permission = JSON.stringify(permission);
            fn_show_permission(permission);
          }
        })
      }
      $("#form-role-create").validate({
        rules: {
          name: {
            required: true,
          },
        },
        submitHandler: function (form) {
          $.ajax({
            url: $(form)[0].action,
            method: $(form)[0].method,
            dataType: "json",
            data: $(form).serialize(),
            success: function (data) {
              if (data.code == 200) {
                swal({
                  title: "success",
                  text: data.msg,
                  type: "success"
                },
                  function (isConfirm) {
                    $("#form-role-create").find(":input").not(":button,:submit,:reset,:checkbox").val("");
                    $("#form-role-create input[name='permissions']").removeAttr("checked");
                    $("#modal-role-create").modal("hide");
                    search();
                  });
              } else {
                toastr.error(data.msg);
              }
            }
          })
        }
      });
      $("#form-role-update").validate({
        rules: {
          name: {
            required: true,
          },
        },
        submitHandler: function (form) {
          $.ajax({
            url: $(form)[0].action,
            method: "put",
            dataType: "json",
            data: $(form).serialize(),
            success: function (data) {
              if (data.code == 200) {
                swal({
                  title: "success",
                  text: data.msg,
                  type: "success"
                },
                  function (isConfirm) {
                    $("#form-role-update input[name='permissions']").removeAttr("checked");
                    $("#modal-role-update").modal("hide");
                    search();
                  });
              } else {
                toastr.error(data.msg);
              }
            }
          })
        }
      });
    }
  });
}
// user
if (document.getElementById("content-user")) {
  // model
  var UserUpdateModel = {
    id: ko.observable(0),
    name: ko.observable(null),
    truename: ko.observable(null),
    email: ko.observable(null),
    status: ko.observable(0),
    user: function (user) {
      this.id(user.id);
      this.name(user.name);
      this.truename(user.truename);
      this.email(user.email);
      this.status(user.status);
    },
    roleList: ko.observableArray(null),
    user_role: ko.observableArray(null)
  };
  ko.applyBindings(UserUpdateModel, document.getElementById("form-user-update"));
  url = "/manage/api/user";
  oTable = $("#table-user").DataTable({
    ordering: false,
    bAutoWidth: false,
    pageLength: 10,
    responsive: true,
    bStateSave: true,
    bServerSide: true,
    searching: false,
    ajax: url,
    dom: '<"html5buttons"B>lTgitp',
    aoColumns: [{
      mDataProp: "name"
    }, {
      mDataProp: "truename"
    }, {
      mDataProp: "email"
    }, {
      mDataProp: "last_login",
      mRender: function (data, type, full) {
        if (data) {
          data = dateTimeFormat(data);
        }
        return data;
      }
    }, {
      mDataProp: "status",
      mRender: function (data, type, full) {
        return data == 1 ? "正常" : "禁止登录";
      }
    }, {
      mDataProp: function (data, type, full) {
        var res = "";
        for (var index in data.roles) {
          res += data.roles[index].name + " | ";
        }
        return res.length > 0 ? res.substring(0, res.length - 3) : "";
      }
    }, {
      mDataProp: "id",
      mRender: function (data, type, full) {
        return '<a href="javascript:update(\'' + data + '\')" ><i class="fa fa-pencil" title="修改"></i></a>'
      }
    },],
    buttons: [
    ]
  });
  update = function (id) {
    $.ajax({
      url: url + "/" + id,
      method: "get",
      dataType: "json",
      success: function (res) {
        if (res.code == 200) {
          $("#modal-user-update").modal("show");
          var roles = new Array;
          for (var index in res.data.roles) {
            roles.push(res.data.roles[index].id);
          }
          UserUpdateModel.user(res.data.user);
          UserUpdateModel.user_role(roles);
          $(".chosen-select").trigger("chosen:updated");
        } else {
          toastr.error(res.msg);
          $("#modal-user-update").modal("hide");
        }
      },
    });
  }
  jQuery(function ($) {
    // 加载系统角色
    $.ajax({
      url: "/manage/api/role",
      method: "get",
      dataType: "json",
      success: function (res) {
        if (res.code == 200) {
          UserUpdateModel.roleList(res.data);
          $(".chosen-select").chosen({ width: "100%" });
        } else {
          toastr.error(res.msg);
        }
      },
    });
    $("#form-user-create").validate({
      rules: {
        name: {
          required: true,
          remote: "/api/account/name",
          isUserName: true,
        },
      },
      submitHandler: function (form) {
        $.ajax({
          url: $(form)[0].action,
          method: $(form)[0].method,
          dataType: "json",
          data: $(form).serialize(),
          success: function (data) {
            if (data.code == 200) {
              swal({
                title: "success",
                text: data.msg,
                type: "success"
              },
                function (isConfirm) {
                  $("#form-user-create").find(":input").not(":button,:submit,:reset,:checkbox").val("");
                  $("#modal-user-create").modal("hide");
                  search();
                });
            } else {
              toastr.error(data.msg);
            }
          }
        })
      }
    });
    $("#form-user-update").validate({
      rules: {
        email: {
          remote: "/api/account/email",
          email: true,
        },
      },
      submitHandler: function (form) {
        $.ajax({
          url: $(form)[0].action,
          method: "put",
          dataType: "json",
          data: $(form).serialize(),
          success: function (data) {
            if (data.code == 200) {
              swal({
                title: "success",
                text: data.msg,
                type: "success"
              },
                function (isConfirm) {
                  $("#modal-user-update").modal("hide");
                  search();
                });
            } else {
              toastr.error(data.msg);
            }
          }
        })
      }
    });
  });
}


function search() {
  if (document.getElementById("from-search")) {
    oTable.ajax.url(url + "?" + $("#from-search").serialize()).load();
  } else {
    oTable.ajax.url(url).load();
  }
}


jQuery(function ($) {
  // $('#side-menu').metisMenu();
});

