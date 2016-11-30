import mongoose from 'mongoose'
import faker from 'Faker'

import Achievement from './models/achievement'
import Class from './models/class'
// import Department from './models/department'
// import Major from './models/major'
import Mood from './models/mood'
import Notification from './models/notification'
import Optique from './models/optique'
import Permission from './models/permissions'
import Punishment from './models/Punishment'
import Role from './models/role'
import Tag from './models/tag'
import Task from './models/task'
import User from './models/user'
import Collect from './models/collect'

import { getYmd, getHm, getDuration } from './utils/timer'

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

mongoose.connect('mongodb://127.0.0.1/EtuSystem');
mongoose.set('debug', true);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  // viewTasks.save((err) => { if (err) throw err });
  faker.locale = "zh_CN";

  //roles 
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

  //faker classes
  let classes = [];
  for (let i = 0; i < 10; i++) {
    // let rdmMajor = majors[parseInt(randomIntFromInterval(0, majors.length - 1))].id;
    let cls = new Class({
      // major: rdmMajor,
      grade: randomIntFromInterval(1, 4),
      name: randomIntFromInterval(1, 10) + '班'
    });
    cls.save();
    classes.push(cls)
  }

  //faker users -> student
  let users = [];
  let id = 2016001

  for (let i = 0; i < classes.length; i++) {
    let cls = classes[i];
    for (let j = 0; j < 10; j++) {
      let usr = new User({
        userId: id++,
        password: '$2a$10$BuyTAneBm3srcJg5LmRU4.ozuB3.mdn3bzrVLvX6rZmF8bJF7do5i',
        name: faker.name.firstName() + faker.name.lastName(),
        sex: faker.random.boolean() ? 'M' : 'F',
        role: student.id,
        birthday: faker.date.past().toISOString(),
        address: faker.address.city(),
        phone: faker.phone.phoneNumber(),
        grade: cls.grade,
        room: faker.address.city(),
        class: cls.id
      });
      usr.save((err) => { if (err) throw err });
      users.push(usr)
    }
  }

  //faker teachers
  for (let i = 0; i < 50; i++) {
    let cs = [];
    let num = 3;
    for (let j = 0; j < num; j++) {
      let c = classes[randomIntFromInterval(0, classes.length - 1)].id;
      cs.push(c);
    }

    let usr = new User({
      userId: id++,
      password: '$2a$10$BuyTAneBm3srcJg5LmRU4.ozuB3.mdn3bzrVLvX6rZmF8bJF7do5i',
      name: faker.name.firstName() + faker.name.lastName(),
      sex: faker.random.boolean() ? 'M' : 'F',
      role: teacher.id,
      birthday: faker.date.past().toISOString(),
      address: faker.address.city(),
      phone: faker.phone.phoneNumber(),
      room: faker.address.city(),
      classes: cs
    });
    usr.save((err) => { if (err) throw err });
    users.push(usr)
  }

  //faker users -> admin
  for (let i = 0; i < 5; i++) {
    let ua = new User({
      userId: id++,
      password: '$2a$10$BuyTAneBm3srcJg5LmRU4.ozuB3.mdn3bzrVLvX6rZmF8bJF7do5i',
      name: faker.name.firstName() + faker.name.lastName(),
      sex: faker.random.boolean() ? 'M' : 'F',
      role: admin.id,
      birthday: faker.date.past().toISOString(),
      address: faker.address.city(),
      phone: faker.phone.phoneNumber()
    });
    ua.save((err) => { if (err) throw err });
    users.push(ua);
  }

  let moods = ['verySatisfied', 'satisfied', 'neutral', 'dissatisfied', 'veryDissatisfied', 'angry',];
  let colors = ['#673ab7', '#2196f3', '#9ccc65', '#f44336', '#3e2723', '#bf360c'];

  //datas for every students
  let studentsNumber = classes.length * 10;
  for (let i = 0; i < studentsNumber; i++) {
    let random = randomIntFromInterval(10, 50);

    for (let j = 0; j < random; j++) {
      //faker achievements
      let achievement = new Achievement({
        user: users[i].id,
        happenAt: faker.date.past().toISOString(),
        title: "奖励:" + faker.lorem.sentence(),
        content: faker.lorem.paragraph()
      })
      achievement.save((err) => { if (err) throw err });

      //faker punishments
      let punishment = new Punishment({
        user: users[i].id,
        happenAt: faker.date.past().toISOString(),
        title: "惩罚:" + faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
      });
      punishment.save((err) => { if (err) throw err });

      //faker moods
      let randomMoods = randomIntFromInterval(0, moods.length);
      let mood = new Mood({
        user: users[i].id,
        slug: moods[randomMoods],
        color: colors[randomMoods],
        text: faker.lorem.sentence()
      })
      mood.save((err) => { if (err) throw err });

      let optique = new Optique({
        user: users[i].id,
        date: faker.date.past().toISOString(),
        left: randomIntFromInterval(3, 5.4),
        right: randomIntFromInterval(3, 5.4)
      })
      optique.save((err) => { if (err) throw err });

      let tag = new Tag({
        user: users[i].id,
        name: faker.company.companyName(),
        color: faker.commerce.color()
      })
      tag.save(err => {if(err) throw err});

      let date = new Date(faker.date.past());
      let task = new Task({
        user: users[i].id,
        created_at: date,
        date: getYmd(date, '-'),
        startAt: getHm(date),
        stopAt: getHm(date),
        duration: 9210929,
        tag: tag.id,
        text: faker.lorem.sentence()
      })
      task.save(err => {if(err) throw err});
    }
  }

  for (let i = 0; i < 100; i++) {
    let notification = new Notification({
      from: users[101].id,
      to: faker.random.boolean() ? 'student' : 'teacher',
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph()
    })
    notification.save();
  }

  for (let i = 0; i < 100; i++) {
    let collect = new Collect({
      user: users[101].id,
      isSubmit: faker.random.boolean(),  //是否提交？已提交的会发送到管理员那里
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      students: [users[0].id, users[1].id]
    })
    collect.save();
  }

});

// let addTeacher = new Permission({
//   name: '增加老师',
//   slug: 'addTeacher'
// })
// addTeacher.save((err) => { if (err) throw err });

// let deleteTeacher = new Permission({
//   name: '删除老师',
//   slug: 'deleteTeacher'
// })
// deleteTeacher.save((err) => { if (err) throw err });

// let updateTeacher = new Permission({
//   name: '修改老师',
//   slug: 'modifyTeacher'
// })
// updateTeacher.save((err) => { if (err) throw err });

// let addStudent = new Permission({
//   name: '增加学生',
//   slug: 'addStudent',
// })
// addStudent.save((err) => { if (err) throw err });

// let deleteStudent = new Permission({
//   name: '删除学生',
//   slug: 'deleteStudent'
// })
// deleteStudent.save((err) => { if (err) throw err });

// let updateStudent = new Permission({
//   name: '修改学生',
//   slug: 'modifyStudent'
// })
// updateStudent.save((err) => { if (err) throw err });

// let viewTeachedStudent = new Permission({
//   name: '查看自己教授的学生',
//   slug: 'viewTeachedStudent'
// })
// viewTeachedStudent.save((err) => { if (err) throw err });

// let viewStudent = new Permission({
//   name: '查看所有学生',
//   slug: 'viewStudent'
// })
// viewStudent.save((err) => { if (err) throw err });

// let addAd = new Permission({
//   name: '添加公告',
//   slug: 'addAd'
// })
// addAd.save((err) => { if (err) throw err });

// let updateAd = new Permission({
//   name: '修改公告',
//   slug: 'modifyAd'
// })
// updateAd.save((err) => { if (err) throw err });

// let deleteAd = new Permission({
//   name: '删除公告',
//   slug: 'deleteAd'
// })
// deleteAd.save((err) => { if (err) throw err });

// let viewTasks = new Permission({
//   name: '查看自己的任务',
//   slug: 'viewTasks'
// })