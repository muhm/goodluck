/*
 * @Author: MUHM
 * @Date: 2017-10-12 13:19:33
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-20 09:23:56
 */
'use strict';

module.exports = async app => {
  const authorize = app.middlewares.authorize(app);
  const { router, controller, model } = app;
  const permission = await model.Permission.findAll({ area: 'manage' });
  permission.forEach(element => {
    if (element.method) {
      let controllerAction = controller;
      if (element.area) {
        const areas = element.area.split('.');
        areas.forEach(area => {
          controllerAction = controllerAction[area];
        });
      }
      controllerAction = controllerAction[element.controller][element.action];
      router[element.method](element.url, authorize, controllerAction);
    }
  });
};
