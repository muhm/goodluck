/*
 * @Author: MUHM
 * @Date: 2018-03-19 14:08:08
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-19 16:23:27
 */
'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/api/post.test.js', () => {
  it('slug true', async () => {
    const ctx = app.mockContext();
    const post = await ctx.model.Post.create({ title: 'test', slug: 'slug' });
    const result = await app.httpRequest().get(`/api/post/slug?slug=slug&id=${post.id}`);
    assert.deepEqual(result.body, true);
    const result_1 = await app.httpRequest().get('/api/post/slug?slug=slug1');
    assert.deepEqual(result_1.body, true);
  });
  it('slug false', async () => {
    const ctx = app.mockContext();
    const result = await app.httpRequest().get('/api/post/slug?slug=slug');
    assert.deepEqual(result.body, false);
    const result_1 = await app.httpRequest().get('/api/post/slug');
    assert.deepEqual(result_1.body, false);
  });
});
