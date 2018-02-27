/*
 * @Author: MUHM
 * @Date: 2018-02-26 15:07:14
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-02-27 15:04:55
 */
'use strict';

// table
var oTable = $('#table-site').DataTable({
  ordering: false,
  bAutoWidth: false,
  pageLength: 10,
  responsive: true,
  bStateSave: true,
  bServerSide: true,
  searching: false,
  ajax: "/manage/api/site",
  dom: '<"html5buttons"B>lTgitp',
  aoColumns: [{
    "mDataProp": "key"
  }, {
    "mDataProp": "value"
  }, {
    "mDataProp": "type"
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
      return '<a href="javascript:update(\'' + data + '\')" ><i class="fa fa-pencil" title="修改"></i></a>';
    }
  },],
  buttons: [
  ]
});
// model
var SiteUpdateModel = ko.observableArray(null);
SiteUpdateModel({ id: '', key: '', value: '', type: '' });
ko.applyBindings(SiteUpdateModel, document.getElementById('form-site-update'));
function search() {
  oTable.ajax.url("/manage/api/site").load();
}
function update(id) {
  $.ajax({
    url: '/manage/api/site/' + id,
    method: "get",
    dataType: "json",
    success: function (res) {
      if (res.code == 200) {
        $('#modal-update').modal('show');
        SiteUpdateModel(res.data);
      } else {
        toastr.error(res.msg);
        $('#modal-update').modal('hide');
      }
    },
  });
}
jQuery(function ($) {
  $('#form-site-update').validate({
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