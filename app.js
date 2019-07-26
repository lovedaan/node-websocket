const Koa = require('koa');
const Router = require('koa-router');
const koaStatic = require('koa-static');
const koaBody = require('koa-body');
const WebSocket = require('ws');

const app = new Koa();
app.use(koaBody({
  multipart: true
}));
app.use(koaStatic('./www/'));


require('./models/db.js')(app);
require('./routers/index.js')(app);



let server = app.listen(3000, () => {
  console.log('listen 3000');
})


const wss = new WebSocket.Server({ server });

function getCookie(cookieStr, name) {
  var arr = cookieStr.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
  if (arr != null) return unescape(arr[2]);
  return null;
}

wss.broadcast = function (data) {
    wss.clients.forEach(function (client) {
        client.send(data);
    });
};
let userList = [];
wss.on('connection', function connection(ws, req) {
  let username = req.url.split('?')[1].split('=')[1];
  username = decodeURIComponent(username);
  if(!userList.includes(username)) {
    userList.push(username);
  }
  wss.broadcast(JSON.stringify({
    message: '',
    users: userList
  }));
  console.log('有人进来了', username);
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    wss.broadcast(JSON.stringify({
      message: username +'说：<br />'+ message,
      users: userList
    }));
  });
});







