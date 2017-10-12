/*
 * @Author: MUHM
 * @Date: 2017-09-22 17:18:39
 * @Last Modified by: MUHM
 * @Last Modified time: 2017-10-12 15:14:41
 */
'use strict';

module.exports = app => {
  require('./router/api_v1')(app);
  require('./router/api_v2')(app);
  require('./router/manage')(app);
  require('./router/web')(app);
};
