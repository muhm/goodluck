/*
 * @Author: MUHM
 * @Date: 2017-09-22 17:18:39
 * @Last Modified by: MUHM
 * @Last Modified time: 2017-10-24 10:43:07
 */
'use strict';

module.exports = app => {
  require('./router/api_v1')(app);
  require('./router/manage')(app);
  require('./router/web')(app);
};
