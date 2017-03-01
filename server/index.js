'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path')
const raven = require('raven');
var ueditor = require("ueditor")

import { SENTRY_API, DB_NAME, PORT} from './share/constants'
import authenticate from './middlewares/authenticate'
import mongoose from 'mongoose'
import log4js from 'log4js'

const app = express();

log4js.configure({
  appenders: [
    { type: 'console' }, //控制台输出
    {
      type: 'file', //文件输出
      filename: 'logs/access.log', 
      maxLogSize: 1024,
      backups:3,
      category: 'normal' 
    }
  ]
});
var logger = log4js.getLogger('normal');
logger.setLevel('INFO');
app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}));

app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect('mongodb://' + DB_NAME);

mongoose.set('debug', true);


app.use(bodyParser.json());

app.use(cors());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', authenticate, require('./routes/tasks'));
app.use('/api/tags', authenticate, require('./routes/tags'));
app.use('/api/moods', authenticate, require('./routes/moods'));
app.use('/api/achievements', authenticate, require('./routes/achievements'));
app.use('/api/punishments', authenticate, require('./routes/punishments'));
app.use('/api/optiques', authenticate, require('./routes/optiques'));
app.use('/api/notifications', authenticate, require('./routes/notifications'));
app.use('/api/students', authenticate, require('./routes/students'));
app.use('/api/teachers', authenticate, require('./routes/teachers'));
app.use('/api/collects', authenticate, require('./routes/collects'));
app.use('/api/users', authenticate, require('./routes/users'));
app.use('/api/class', authenticate, require('./routes/classes'));
app.use('/api/files', authenticate, require('./routes/files'));
app.use('/api/courses', authenticate, require('./routes/courses'));
app.use('/api/scheduals', authenticate, require('./routes/scheduals'));
app.use('/api/scores', authenticate, require('./routes/scores'));
app.use('/api/checks', authenticate, require('./routes/checks'));
app.use('/api/classrooms', authenticate, require('./routes/classrooms'));
app.use('/api/equipements', authenticate, require('./routes/equipements'));
app.use('/api/equipementRecords', authenticate, require('./routes/equipementRecords'));

app.use('/ueditor/ueditor.config.json', (req, res) => {
  res.json({
    'imageUrl': 'http://localhost:3333/ueditor/ue?action=uploadimage',
    'imagePath': '/ueditor/resources/img',
    'imageFieldName': 'upfile',
    'imageMaxSize': 2048,
    'imageAllowFiles': ['.png', '.jpg', '.jpeg', '.gif', '.bmp']
  })
});

app.use("/ueditor/ue", ueditor(path.join(__dirname, 'public'), function(req, res, next) {
  // ueditor 客户发起上传图片请求 
  if(req.query.action === 'uploadimage'){
    var foo = req.ueditor;
 
    var imgname = req.ueditor.filename;
 
    var img_url = '/images/ueditor/';
    res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做 
  }

  //  客户端发起图片列表请求 
  else if (req.query.action === 'listimage'){
    var dir_url = '/images/ueditor/';
    res.ue_list(dir_url);  // 客户端会列出 dir_url 目录下的所有图片 
  }

  // 客户端发起其它请求 
  else {
    res.setHeader('Content-Type', 'application/json');
    res.redirect('/ueditor/ueditor.config.json')
}}));

exports.logger=function(name){
  var logger = log4js.getLogger(name);
  logger.setLevel('INFO');
  return logger;
}

const server = app.listen(PORT, function () {
  const host = server.address().address;
  const port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});

process.on('uncaughtException', function (err) {
  if (err.errno === 'EADDRINUSE') {
    return console.log('Error: ', err);
  } else {
    console.log(err);
  }
});
