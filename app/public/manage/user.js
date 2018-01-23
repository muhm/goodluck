/*
 * @Author: MUHM
 * @Date: 2018-01-22 14:26:16
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-01-23 11:42:21
 */
'use strict';

var UserUpdateModel = ko.observableArray(null);
// UserUpdateModel({ id: '', name: '', description: '' });
// ko.applyBindings(UserEditModel, document.getElementById('roleEdit'));
// table
var oTable = $('#table-user').DataTable({
  ordering: false,
  bAutoWidth: true,
  pageLength: 10,
  responsive: true,
  bStateSave: true,
  bServerSide: true,
  searching: false,
  ajax: "/manage/api/user",
  dom: '<"html5buttons"B>lTgitp',
  aoColumns: [{
    "mDataProp": "name"
  }, {
    "mDataProp": "truename"
  }, {
    "mDataProp": "email"
  }, {
    "mDataProp": "last_login",
    "mRender": function (data, type, full) {
      if (data) {
        data = dateTimeFormat(data);
      }
      return data;
    }
  }, {
    "mDataProp": "status",
    "mRender": function (data, type, full) {
      return data == 1 ? "正常" : "禁止登录";
    }
  }, {
    "mDataProp": function (data, type, full) {
      return data.roles.length > 0 ? data.roles[0].name : '';
    }
  }, {
    "mDataProp": "id",
    "mRender": function (data, type, full) {
      return '<a href="#modal-update" data-toggle="modal" onclick="update(\'' + data + '\')" ><i class="fa fa-pencil" title="修改"></i></a>'
    }
  },],
  buttons: [
  ]
});
function search() {
  oTable.ajax.url("/manage/api/user").load();
}
jQuery(function ($) {
  $('#form-user-create').validate({
    rules: {
      name: {
        required: true,
        remote: '/api/account/name',
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
                $('#form-user-create').find(':input').not(':button,:submit,:reset,:checkbox').val('');
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
});