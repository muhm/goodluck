/*
 * @Author: MUHM
 * @Date: 2018-03-22 14:24:15
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-22 16:19:15
 */
'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('get lru', () => {
  it('safeUrl', () => {
    const ctx = app.mockContext();
    assert.deepEqual(ctx.helper.safeUrl(), '');
  });
  it('isChinese false', () => {
    const ctx = app.mockContext();
    assert.deepEqual(ctx.helper.isChinese('a和b'), false);
  });
  it('isChinese true', () => {
    const ctx = app.mockContext();
    assert.deepEqual(ctx.helper.isChinese('测试'), true);
  });
  it('accountWhere null', () => {
    const ctx = app.mockContext();
    assert.deepEqual(ctx.helper.accountWhere('测试1'), null);
  });
  it('isCardId true', () => {
    const ctx = app.mockContext();
    // 原谅我百毒的号码
    assert.deepEqual(ctx.helper.isCardId('411101199202077509'), true);
    // 15位的就算了吧
    assert.deepEqual(ctx.helper.isCardId('440253850213582'), true);
  });
  it('isCardId false', () => {
    const ctx = app.mockContext();
    assert.deepEqual(ctx.helper.isCardId('411101199202077500'), false);
    assert.deepEqual(ctx.helper.isCardId('41110119920207750'), false);
  });
  it('getLimit null',()=>{
    const ctx = app.mockContext();
    assert.deepEqual(ctx.helper.getLimit(), null);
  });
  it('getOffset null',()=>{
    const ctx = app.mockContext();
    assert.deepEqual(ctx.helper.getOffset(), null);
  });
});