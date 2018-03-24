/*
 * @Author: MUHM
 * @Date: 2018-03-19 14:08:08
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-23 22:21:11
 */
'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/api/post.test.js', () => {
  beforeEach(async () => {
    app.mockCsrf();
    const ctx = app.mockContext();
    const user = await ctx.model.User.findOne({ where: { name: 'admin' } });
    await app.mockSession({
      userId: user.id,
      name: user.name,
      token: user.session_token,
    });
  });
  it('slug true', async () => {
    const ctx = app.mockContext();
    const post = await ctx.model.Post.create({ title: 'test', slug: 'slug' });
    const result = await app.httpRequest()
      .get(`/api/post/slug?slug=slug&id=${post.id}`);
    assert.deepEqual(result.body, true);
    const result_1 = await app.httpRequest()
      .get('/api/post/slug?slug=slug1');
    assert.deepEqual(result_1.body, true);
  });
  it('slug false', async () => {
    const result = await app.httpRequest()
      .get('/api/post/slug?slug=slug');
    assert.deepEqual(result.body, false);
  });
  it('get index success', async () => {
    const result = await app.httpRequest()
      .get('/api/post?start=0&length=10');
    assert.deepEqual(result.body.code, 200);
  });
  it('create success', async () => {
    const result = await app.httpRequest()
      .post('/api/post')
      .send({
        title: 'title',
        slug: 'title',
      });
    assert.deepEqual(result.body.code, 200);
  });
  it('update success', async () => {
    const ctx = app.mockContext();
    const post = await ctx.model.Post.findOne({ where: { slug: 'title' } });
    const result = await app.httpRequest()
      .post('/api/post')
      .send({
        id: post.id,
        title: 'title1',
        'editormd-post-markdown-doc': 'editormd-post-markdown-doc',
        'editormd-post-html-code': 'editormd-post-html-code',
      });
    assert.deepEqual(result.body.code, 200);
  });
  it('get show success', async () => {
    const ctx = app.mockContext();
    const post = await ctx.model.Post.findOne({ where: { slug: 'title1' } });
    const result = await app.httpRequest()
      .get(`/api/post/${post.id}`);
    assert.deepEqual(result.body.code, 200);
  });
  it('get show 404', async () => {
    const result = await app.httpRequest()
      .get('/api/post/2');
    assert.deepEqual(result.body.code, 404);
  });
  it('publish/retract success', async () => {
    const ctx = app.mockContext();
    const post = await ctx.model.Post.findOne({ where: { slug: 'title1' } });
    const result = await app.httpRequest()
      .post('/api/post/publish')
      .send({
        id: post.id,
      });
    assert.deepEqual(result.body.code, 200);
    const result_1 = await app.httpRequest()
      .post('/api/post/retract')
      .send({
        id: post.id,
      });
    assert.deepEqual(result_1.body.code, 200);
  });
  it('publish/retract error', async () => {
    const result = await app.httpRequest()
      .post('/api/post/publish');
    assert.deepEqual(result.body.code, 400);
    const result_1 = await app.httpRequest()
      .post('/api/post/retract');
    assert.deepEqual(result_1.body.code, 400);
  });
  it('delete success', async () => {
    const ctx = app.mockContext();
    const post = await ctx.model.Post.findOne({ where: { slug: 'title1' } });
    const result = await app.httpRequest()
      .delete(`/api/post/${post.id}`);
    assert.deepEqual(result.body.code, 200);
  });
  it('delete error', async () => {
    const result = await app.httpRequest()
      .delete('/api/post/12');
    assert.deepEqual(result.body.code, 400);
  });
});
