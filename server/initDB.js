import mongoose from 'mongoose'

import Role from './models/role'
import User from './models/user'
import { DB_NAME } from './share/constants'

mongoose.connect('mongodb://' + DB_NAME);
mongoose.set('debug', true);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  let student = new Role({
    name: '学生',
    slug: 'student'
  })
  student.save((err) => { if (err) throw err });

  let teacher = new Role({
    name: '老师',
    slug: 'teacher'
  })
  teacher.save((err) => { if (err) throw err });

  let admin = new Role({
    name: '管理员',
    slug: 'admin'
  })
  admin.save((err) => { if (err) throw err });

  let superAdmin = new Role({
    name: '超级管理员',
    slug: 'superAdmin'
  });

  superAdmin.save();

  let user = new User({
    userId: 'superAdmin',
    password: '$2a$10$BuyTAneBm3srcJg5LmRU4.ozuB3.mdn3bzrVLvX6rZmF8bJF7do5i',
    name: 'SuperAdmin',
    sex: 'M',
    role: superAdmin._id,
    birthday: new Date(),
  })
  user.save();
});
