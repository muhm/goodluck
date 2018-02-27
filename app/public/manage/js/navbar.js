/*
 * @Author: MUHM
 * @Date: 2017-07-20 15:15:44
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-02-27 14:56:41
 */


//menu
function fn_menujson(data, parent_id) {
  var result = [],
    temp;
  for (var i = 0; i < data.length; i++) {
    if (data[i].parent_id == parent_id) {
      var obj = {
        "name": data[i].name,
        "id": data[i].id,
        "url": data[i].url,
        "icon": data[i].icon,
        "parent_id": data[i].parent_id == 0 ? "" : data[i].parent_id,
        "controller": data[i].controller
      };
      temp = fn_menujson(data, data[i].id);
      if (temp.length > 0) {
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
        active = 'active';
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
          // localStorage.permissions = data.data;
          return get_permissions(data.data, url);
        }
      }
    })
  }
}

function get_permissions(permissions, url) {
  return permissions.find(function (item) { return item.url === url }) ? true : false;
}

//初始化左侧菜单
(function () {
  var locationUrl = location.pathname;
  var menuUrl = '/manage/api/menu';
  if (localStorageSupport()) {
    if (localStorage.menu) {
      fn_menu(JSON.parse(localStorage.menu), locationUrl);
      // MetsiMenu
      $('#side-menu').metisMenu();
    } else {
      $.ajax({
        type: "get",
        contentType: "application/json",
        url: menuUrl,
        dataType: "json",
        async: true,
        success: function (data) {
          var menu = fn_menujson(data.data, 0);
          localStorage.menu = JSON.stringify(menu);
          fn_menu(menu, locationUrl);
          $('#side-menu').metisMenu();
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
        var menu = fn_menujson(data.data, 0);
        fn_menu(menu, locationUrl);
        $('#side-menu').metisMenu();
      }
    })
  }
})();

// 绑定消息界面
// (function () {
//   var message = {
//     count: ko.observable(null),
//     data: ko.observableArray(null),
//     read: function () {
//       $.ajax({
//         type: "post",
//         contentType: "application/json",
//         url: "/manage/api/message/read?id=" + this.id,
//         dataType: "json",
//         async: true,
//         success: function (data) {
//           if (data.code === 200) {
//             $.ajax({
//               type: "get",
//               contentType: "application/json",
//               url: "/manage/api/message/home",
//               dataType: "json",
//               async: true,
//               success: function (data) {
//                 if (data.code === 200) {
//                   message.count(data.data.count);
//                   message.data(data.data.rows);
//                 }
//               }
//             });
//           }
//         }
//       });
//     }
//   };
//   ko.applyBindings(message, document.getElementById('message'));
//   $.ajax({
//     type: "get",
//     contentType: "application/json",
//     url: "/manage/api/message/home",
//     dataType: "json",
//     async: true,
//     success: function (data) {
//       if (data.code === 200) {
//         message.count(data.data.count);
//         message.data(data.data.rows);
//       }
//     }
//   });
// })()
