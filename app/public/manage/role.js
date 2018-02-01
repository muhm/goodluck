/*
 * @Author: MUHM
 * @Date: 2018-01-12 10:17:08
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-02-01 15:44:23
 */
'use strict';

// table
var oTable = $('#table-role').DataTable({
  ordering: false,
  bAutoWidth: true,
  pageLength: 10,
  responsive: true,
  bStateSave: true,
  bServerSide: true,
  searching: false,
  ajax: "/manage/api/role",
  dom: '<"html5buttons"B>lTgitp',
  aoColumns: [{
    "mDataProp": "name"
  }, {
    "mDataProp": "description"
  }, {
    "mDataProp": "created_at",
    "mRender": function (data, type, full) {
      if (data) {
        data = dateTimeFormat(data);
      }
      return data;
    }
  }, {
    "mDataProp": "updated_at",
    "mRender": function (data, type, full) {
      if (data) {
        data = dateTimeFormat(data);
      }
      return data;
    }
  }, {
    "mDataProp": "id",
    "mRender": function (data, type, full) {
      return '<a href="javascript:update(\'' + data + '\')" ><i class="fa fa-pencil" title="修改"></i></a>'
        + ' | <a href="javascript:destroy(\'' + data + '\')" ><i class="fa fa-trash-o text-danger" title="删除"></i></a>'
    }
  },],
  buttons: [
  ]
});
// model
var RoleUpdateModel = ko.observableArray(null);
RoleUpdateModel({ id: '', name: '', description: '' });
ko.applyBindings(RoleUpdateModel, document.getElementById('form-role-update'));
// function
function search() {
  oTable.ajax.url("/manage/api/role").load();
}
function update(id) {
  $("#form-role-update input[name='permissions']").removeAttr("checked");
  $.ajax({
    url: '/manage/api/role/' + id,
    method: "get",
    dataType: "json",
    success: function (res) {
      if (res.code == 200) {
        $('#modal-update').modal('show');
        RoleUpdateModel(res.data.role);
        for (var i = 0; i < res.data.permissions.length; i++) {
          $("#cb" + res.data.permissions[i].id).prop("checked", "checked");
        }
      } else {
        toastr.error(res.msg);
        $('#modal-update').modal('hide');
      }
    },
  });
}
function destroy(id) {
  $.ajax({
    url: '/manage/api/role/' + id,
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
jQuery(function ($) {
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
  $('#form-role-create').validate({
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
                $('#form-role-create').find(':input').not(':button,:submit,:reset,:checkbox').val('');
                $("#form-role-create input[name='permissions']").removeAttr("checked");
                $('#modal-create').modal('hide');
                search();
              });
          } else {
            toastr.error(data.msg);
          }
        }
      })
    }
  });

  $('#form-role-update').validate({
    rules: {
      name: {
        required: true,
      },
    },
    submitHandler: function (form) {
      $.ajax({
        url: $(form)[0].action,
        method: 'put',
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
                $('#modal-update').modal('hide');
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