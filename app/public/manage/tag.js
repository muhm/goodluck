/*
 * @Author: MUHM
 * @Date: 2018-03-06 11:13:31
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-06 11:13:31
 */

if (document.getElementById('tagList')) {
  var tags = new dataPage();
  tags.init('tagList', '/manage/api/tag');
}