/*
 * @Author: MUHM
 * @Date: 2018-02-28 17:09:51
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-06 11:12:30
 */

if (document.getElementById('postList')) {
  var posts = new dataPage();
  posts.init('postList', '/manage/api/post');
}