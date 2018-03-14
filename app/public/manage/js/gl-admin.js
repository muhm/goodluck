/*
 * @Author: MUHM
 * @Date: 2017-07-20 15:15:44
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-14 17:29:11
 */
/// <reference path="./moment.min.js" />

// For demo purpose - animation css script
function animationHover(element, animation) {
  element = $(element);
  element.hover(
    function () {
      element.addClass('animated ' + animation);
    },
    function () {
      //wait for animation to finish before removing classes
      window.setTimeout(function () {
        element.removeClass('animated ' + animation);
      }, 2000);
    });
}

function SmoothlyMenu() {
  if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
    // Hide menu in order to smoothly turn on when maximize menu
    $('#side-menu').hide();
    // For smoothly turn on menu
    setTimeout(
      function () {
        $('#side-menu').fadeIn(400);
      }, 200);
  } else if ($('body').hasClass('fixed-sidebar')) {
    $('#side-menu').hide();
    setTimeout(
      function () {
        $('#side-menu').fadeIn(400);
      }, 100);
  } else {
    // Remove all inline style from jquery fadeIn function to reset menu state
    $('#side-menu').removeAttr('style');
  }
}

// Dragable panels
function WinMove() {
  var element = "[class*=col]";
  var handle = ".ibox-title";
  var connect = "[class*=col]";
  $(element).sortable({
    handle: handle,
    connectWith: connect,
    tolerance: 'pointer',
    forcePlaceholderSize: true,
    opacity: 0.8
  })
    .disableSelection();
}
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
// Minimalize menu when screen is less than 768px
$(window).bind("resize", function () {
  if ($(this).width() < 769) {
    $('body').addClass('body-small')
  } else {
    $('body').removeClass('body-small')
  }
});
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
if (document.getElementById("form-post-upsert")) {

  var postModel = {
    publish: function () {
      var post_id = this.id();
      alert(post_id)
    },
    unpublish: function () {
      var post_id = this.id();
      alert(post_id)
    },
    destroy: function () {
      var post_id = this.id();
      $.ajax({
        url: "/manage/api/post/" + post_id,
        method: "delete",
        dataType: "json",
        success: function (res) {
          if (res.code == 200) {
            swal({
              title: "success",
              text: res.msg,
              type: "success"
            },
              function (isConfirm) {
                window.location.href = "/manage/post";
              });
          } else {
            toastr.error(res.msg);
          }
        },
      });
    },
    id: ko.observable(null),
    slug: ko.observable(null),
    title: ko.observable(null),
    plaintext: ko.observable(null),
    mobiledoc: ko.observable(null),
    html: ko.observable(null),
    featured: ko.observable(null),
    image: ko.observable(null),
    status: ko.observable(0),
    meta_title: ko.observable(null),
    meta_description: ko.observable(null),
    author_id: ko.observable(null),
    created_by: ko.observable(null),
    updated_by: ko.observable(null),
    published_at: ko.observable(null),
    published_by: ko.observable(null),
    created_at: ko.observable(null),
    updated_at: ko.observable(null),
    deleted_at: ko.observable(null),
    tags: ko.observableArray(null),
    tagList: ko.observableArray(null),
    init: function (post) {
      this.id(post.id);
      this.slug(post.slug);
      this.title(post.title);
      this.plaintext(post.plaintext);
      this.mobiledoc(post.mobiledoc);
      this.html(post.html);
      this.featured(post.featured);
      this.image(post.image);
      this.status(post.status);
      this.meta_title(post.meta_title);
      this.meta_description(post.meta_description);
      this.author_id(post.author_id);
      this.created_by(post.created_by);
      this.updated_by(post.updated_by);
      this.published_at(post.published_at);
      this.published_at(post.published_at);
      this.published_by(post.published_by);
      this.created_at(post.created_at);
      this.updated_at(post.updated_at);
      this.deleted_at(post.deleted_at);
      var tags = new Array;
      for (var index in post.tags) {
        tags.push(post.tags[index].id);
      }
      this.tags(tags);
    }
  };
  ko.applyBindings(postModel, document.getElementById("form-post-upsert"));
  var locationArray = location.pathname.split('/');
  function init(manage_assets) {
    $(".chosen-select").chosen({ width: "100%" });
    var tag_load = function (tags) {
      $.ajax({
        url: "/manage/api/tag",
        method: "get",
        dataType: "json",
        success: function (res) {
          if (res.code == 200) {
            postModel.tagList(res.data);
            postModel.tags(tags);
            $(".chosen-select").trigger("chosen:updated");
          } else {
            toastr.error(res.msg);
          }
        },
      });
    }
    tag_load();
    Dropzone.options.dropzoneForm = {
      paramName: "image",
      maxFilesize: 3,
      url: "/manage/api/image?_csrf=" + csrftoken,
      acceptedFiles: "image/*",
      dictDefaultMessage: "<div class='row'><img class='img-preview' src='" + manage_assets + "/images/img_404.png'/><div>",
      complete: function (file) {
        this.removeFile(file);
        $('#model-image-upload').modal("hide");
        if (file.xhr) {
          var res = JSON.parse(file.xhr.response)
          if (file.xhr.status != 200) {
            toastr.error(res.msg || res.message);
          } else {
            postModel.image(res.url);
          }
        }
      }
    };
    $.ajax({
      url: "/manage/api/post/" + locationArray[locationArray.length - 1],
      method: "get",
      dataType: "json",
      success: function (res) {
        if (res.code == 200) {
          postModel.init(res.data);
          $(".chosen-select").trigger("chosen:updated");
        } else {
          if (res.code = 404) {
            $(".chosen-select").trigger("chosen:updated");
          } else {
            toastr.error(res.msg);
          }
        }
        editormd("editormd-post", {
          width: "100%",
          height: 640,
          saveHTMLToTextarea: true,
          path: manage_assets + '/markdown/lib/',
          imageUpload: true,
          imageFormats: ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
          imageUploadURL: "/manage/api/image?_csrf=" + csrftoken,
          onfullscreen: function () {
            if (!$("body").hasClass("mini-navbar")) {
              $("body").toggleClass("mini-navbar");
              SmoothlyMenu();
            }
          },
          onfullscreenExit: function () {
            if ($("body").hasClass("mini-navbar")) {
              $("body").toggleClass("mini-navbar");
              SmoothlyMenu();
            }
          }
        });
      },
    });
  }
  jQuery(function ($) {
    $("#form-post-upsert").validate({
      rules: {
        title: {
          required: true,
        },
        slug: {
          remote: '/api/post/slug?id=' + locationArray[locationArray.length - 1],
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
                  window.location.href = '/manage/post/upsert/' + data.data;
                });
            } else {
              toastr.error(data.msg);
            }
          }
        });
      }
    });
    $("#form-tag-create").validate({
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
              toastr.success(data.msg);
              $("#form-tag-create").find(":input").not(":button,:submit,:reset,:checkbox").val("");
              $("#modal-tag-create").modal("hide");
              var tags = postModel.tags() || new Array;
              tags.push(data.data.id);
              tag_load(tags);
            } else {
              toastr.error(data.msg);
            }
          }
        })
      }
    });
  });
}
// tag_back
if (document.getElementById("tagList")) {
  var tags = new dataPage();
  tags.init("tagList", "/manage/api/tag");
}
if (document.getElementById("content-tag")) {
  // var TagUpdateModel = ko.observableArray(null);
  url = "/manage/api/tag";
  oTable = $("#table-tag").DataTable({
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
        // return '<a href="javascript:update(\'' + data + '\')" ><i class="fa fa-pencil" title="修改"></i></a>';
        return '<a href="javascript:destroy(\'' + data + '\')" ><i class="fa fa-trash-o text-danger" title="删除"></i></a>'
      }
    },],
    buttons: [
    ]
  });
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
    $("#form-tag-create").validate({
      rules: {
        name: {
          required: true,
          // remote: "/api/account/name",
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
                  $("#form-tag-create").find(":input").not(":button,:submit,:reset,:checkbox").val("");
                  $("#modal-tag-create").modal("hide");
                  search();
                });
            } else {
              toastr.error(data.msg);
            }
          }
        })
      }
    });
    // $("#form-tag-update").validate({
    //   rules: {
    //     name: {
    //       required: true,
    //     },
    //   },
    //   submitHandler: function (form) {
    //     $.ajax({
    //       url: $(form)[0].action,
    //       method: "put",
    //       dataType: "json",
    //       data: $(form).serialize(),
    //       success: function (data) {
    //         if (data.code == 200) {
    //           swal({
    //             title: "success",
    //             text: data.msg,
    //             type: "success"
    //           },
    //             function (isConfirm) {
    //               $("#modal-tag-update").modal("hide");
    //               search();
    //             });
    //         } else {
    //           toastr.error(data.msg);
    //         }
    //       }
    //     })
    //   }
    // });
  });
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


$(document).ready(function () {
  // Add body-small class if window less than 768px
  if ($(this).width() < 769) {
    $('body').addClass('body-small')
  } else {
    $('body').removeClass('body-small')
  }
  // Collapse ibox function
  $('.collapse-link').on('click', function () {
    var ibox = $(this).closest('div.ibox');
    var button = $(this).find('i');
    var content = ibox.find('div.ibox-content');
    content.slideToggle(200);
    button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
    ibox.toggleClass('').toggleClass('border-bottom');
    setTimeout(function () {
      ibox.resize();
      ibox.find('[id^=map-]').resize();
    }, 50);
  });

  // Close ibox function
  $('.close-link').on('click', function () {
    var content = $(this).closest('div.ibox');
    content.remove();
  });

  // Fullscreen ibox function
  $('.fullscreen-link').on('click', function () {
    var ibox = $(this).closest('div.ibox');
    var button = $(this).find('i');
    $('body').toggleClass('fullscreen-ibox-mode');
    button.toggleClass('fa-expand').toggleClass('fa-compress');
    ibox.toggleClass('fullscreen');
    setTimeout(function () {
      $(window).trigger('resize');
    }, 100);
  });

  // Close menu in canvas mode
  $('.close-canvas-menu').on('click', function () {
    $("body").toggleClass("mini-navbar");
    SmoothlyMenu();
  });

  // Run menu of canvas
  $('body.canvas-menu .sidebar-collapse').slimScroll({
    height: '100%',
    railOpacity: 0.9
  });

  // Open close right sidebar
  $('.right-sidebar-toggle').on('click', function () {
    $('#right-sidebar').toggleClass('sidebar-open');
  });

  // Initialize slimscroll for right sidebar
  $('.sidebar-container').slimScroll({
    height: '100%',
    railOpacity: 0.4,
    wheelStep: 10
  });

  // Open close small chat
  $('.open-small-chat').on('click', function () {
    $(this).children().toggleClass('fa-comments').toggleClass('fa-remove');
    $('.small-chat-box').toggleClass('active');
  });

  // Initialize slimscroll for small chat
  $('.small-chat-box .content').slimScroll({
    height: '234px',
    railOpacity: 0.4
  });

  // Small todo handler
  $('.check-link').on('click', function () {
    var button = $(this).find('i');
    var label = $(this).next('span');
    button.toggleClass('fa-check-square').toggleClass('fa-square-o');
    label.toggleClass('todo-completed');
    return false;
  });


  // Minimalize menu
  $('.navbar-minimalize').on('click', function () {
    $("body").toggleClass("mini-navbar");
    SmoothlyMenu();

  });

  // Tooltips demo
  $('.tooltip-demo').tooltip({
    selector: "[data-toggle=tooltip]",
    container: "body"
  });


  // Full height of sidebar
  function fix_height() {
    var heightWithoutNavbar = $("body > #wrapper").height() - 61;
    $(".sidebard-panel").css("min-height", heightWithoutNavbar + "px");

    var navbarHeigh = $('nav.navbar-default').height();
    var wrapperHeigh = $('#page-wrapper').height();

    if (navbarHeigh > wrapperHeigh) {
      $('#page-wrapper').css("min-height", navbarHeigh + "px");
    }

    if (navbarHeigh < wrapperHeigh) {
      $('#page-wrapper').css("min-height", $(window).height() + "px");
    }

    if ($('body').hasClass('fixed-nav')) {
      if (navbarHeigh > wrapperHeigh) {
        $('#page-wrapper').css("min-height", navbarHeigh - 60 + "px");
      } else {
        $('#page-wrapper').css("min-height", $(window).height() - 60 + "px");
      }
    }

  }

  fix_height();

  // Fixed Sidebar
  $(window).bind("load", function () {
    if ($("body").hasClass('fixed-sidebar')) {
      $('.sidebar-collapse').slimScroll({
        height: '100%',
        railOpacity: 0.9
      });
    }
  });

  // Move right sidebar top after scroll
  $(window).scroll(function () {
    if ($(window).scrollTop() > 0 && !$('body').hasClass('fixed-nav')) {
      $('#right-sidebar').addClass('sidebar-top');
    } else {
      $('#right-sidebar').removeClass('sidebar-top');
    }
  });

  $(window).bind("load resize scroll", function () {
    if (!$("body").hasClass('body-small')) {
      fix_height();
    }
  });

  $("[data-toggle=popover]")
    .popover();

  // Add slimscroll to element
  $('.full-height-scroll').slimscroll({
    height: '100%'
  })

  if (localStorageSupport()) {
    var collapse = localStorage.getItem("collapse_menu");
    var fixedsidebar = localStorage.getItem("fixedsidebar");
    var fixednavbar = localStorage.getItem("fixednavbar");
    var boxedlayout = localStorage.getItem("boxedlayout");
    var fixedfooter = localStorage.getItem("fixedfooter");

    var body = $('body');

    if (fixedsidebar == 'on') {
      body.addClass('fixed-sidebar');
      $('.sidebar-collapse').slimScroll({
        height: '100%',
        railOpacity: 0.9
      });
    }

    if (collapse == 'on') {
      if (body.hasClass('fixed-sidebar')) {
        if (!body.hasClass('body-small')) {
          body.addClass('mini-navbar');
        }
      } else {
        if (!body.hasClass('body-small')) {
          body.addClass('mini-navbar');
        }

      }
    }

    if (fixednavbar == 'on') {
      $(".navbar-static-top").removeClass('navbar-static-top').addClass('navbar-fixed-top');
      body.addClass('fixed-nav');
    }

    if (boxedlayout == 'on') {
      body.addClass('boxed-layout');
    }

    if (fixedfooter == 'on') {
      $(".footer").addClass('fixed');
    }
  }
});

