/*
 * @Author: MUHM
 * @Date: 2018-01-22 14:26:16
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-02-08 15:06:36
 */
'use strict';

// table
var oTable = $('#table-user').DataTable({
  ordering: false,
  bAutoWidth: true,
  pageLength: 10,
  responsive: true,
  bStateSave: true,
  bServerSide: true,
  searching: false,
  ajax: '/manage/api/user',
  dom: '<"html5buttons"B>lTgitp',
  aoColumns: [{
    'mDataProp': 'name'
  }, {
    'mDataProp': 'truename'
  }, {
    'mDataProp': 'email'
  }, {
    'mDataProp': 'last_login',
    'mRender': function (data, type, full) {
      if (data) {
        data = dateTimeFormat(data);
      }
      return data;
    }
  }, {
    'mDataProp': 'status',
    'mRender': function (data, type, full) {
      return data == 1 ? '正常' : '禁止登录';
    }
  }, {
    'mDataProp': function (data, type, full) {
      var res = '';
      for (var index in data.roles) {
        res += data.roles[index].name + ' | ';
      }
      return res.length > 0 ? res.substring(0, res.length - 3) : '';
    }
  }, {
    'mDataProp': 'id',
    'mRender': function (data, type, full) {
      return '<a href="javascript:update(\'' + data + '\')" ><i class="fa fa-pencil" title="修改"></i></a>'
    }
  },],
  buttons: [
  ]
});
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
ko.applyBindings(UserUpdateModel, document.getElementById('form-user-update'));
// function
function search() {
  oTable.ajax.url('/manage/api/user').load();
}
function update(id) {
  $.ajax({
    url: '/manage/api/user/' + id,
    method: 'get',
    dataType: 'json',
    success: function (res) {
      if (res.code == 200) {
        $('#modal-update').modal('show');
        var roles = new Array;
        for (var index in res.data.roles) {
          roles.push(res.data.roles[index].id);
        }
        UserUpdateModel.user(res.data.user);
        UserUpdateModel.user_role(roles);
        $(".chosen-select").trigger("chosen:updated");
      } else {
        toastr.error(res.msg);
        $('#modal-update').modal('hide');
      }
    },
  });
}
jQuery(function ($) {
  // 加载系统角色
  $.ajax({
    url: '/manage/api/role',
    method: 'get',
    dataType: 'json',
    success: function (res) {
      if (res.code == 200) {
        UserUpdateModel.roleList(res.data);
        $('.chosen-select').chosen({ width: '100%' });
      } else {
        toastr.error(res.msg);
      }
    },
  });
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
        dataType: 'json',
        data: $(form).serialize(),
        success: function (data) {
          if (data.code == 200) {
            swal({
              title: 'success',
              text: data.msg,
              type: 'success'
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
  $('#form-user-update').validate({
    rules: {
      email: {
        remote: '/api/account/email', 
        email: true,
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