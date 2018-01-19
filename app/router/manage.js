/*
 * @Author: MUHM
 * @Date: 2017-10-12 13:19:33
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-01-19 13:15:00
 */
'use strict';

module.exports = async app => {
  const authorize = app.middlewares.authorize();
  const { router, controller, model } = app;
  const permission = await model.Permission.findAll({ area: 'manage' });
  permission.forEach(element => {
    if (element.http_type) {
      let controllerAction = controller;
      if (element.area) {
        const areas = element.area.split('.');
        areas.forEach(area => {
          controllerAction = controllerAction[area];
        });
      }
      controllerAction = controllerAction[element.controller][element.action];
      router[element.http_type](element.url, authorize, controllerAction);
    }
  });
};
