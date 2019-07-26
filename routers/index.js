const Router = require('koa-router');

module.exports = (app) => {
  const router = new Router();
  const User = require('../models/User.js');
  router.get('/api/users', async ctx => {
    let result = await User.find();
    if(result) {
      ctx.body = {
        code: 0,
        msg: '查询成功',
        data: result
      };
    }else {
      ctx.body = {
        code: 0,
        msg: '用户名不存在'
      };
    }

  });

  router.post('/api/login', async ctx => {
    let {username, password} = ctx.request.body;
    let result = await User.find({username});
    if(result) {
      //ctx.cookies.set('username', result[0].username);
      ctx.body = {
        code: 0,
        msg: '登录成功',
        data: result[0]
      };
    }else {
      ctx.body = {
        code: -1,
        msg: '用户名不存在'
      };
    }

  });

  router.post('/api/register', async ctx => {
    let data = await User.create(ctx.request.body);
    ctx.body = {
      code: 0,
      msg: '注册成功',
      data
    };
  });

  app.use(router.routes());
}