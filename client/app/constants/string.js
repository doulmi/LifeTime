
export default {
  loadMore: '加载更多',
  noMore: '已经到底了...',
  close: '关闭',
  more: '更多',

  cancel: '取消',
  submit: '确认',
  read: '查看',
  delete: '删除',
  modify: '修改',
  new: '新建',
  addTag: '添加标签',
  noTag: '无标签',
  tag: '标签',
  newTag: '添加标签',

  //login
  connetFailed: '连接服务器失败',

  //tasks
  uDoWhat: '做了什么？',
  start: '始于',
  stop: '终于',
  taskDate: '日期',
  tagname: '标签名称',
  modifyTag: '修改标签',

  //mood
  noMoodAdd: '您还未发布过任何身心健康',
  yourMood: '现在身心状况如何？',
  expressMood: '现在状况如何？',

  //achivement
  ok: '确认',
  achievementDate: '获得该荣誉的日期',
  yourAchievementTitle: '获得的荣誉',
  yourAchievementContent: '荣誉的描述(可多行)',
  achievementTitle: '荣誉',
  achievementContent: '描述',
  noAchievement: '暂无任何荣誉',
  achievementCount: (count) => { return '您已有' + count + '项荣誉' },
  allAchievements: '所获得荣誉',

  //punishment
  allPunishments: '所受惩罚',
  yourPunishmentTitle: '受到的惩罚',
  yourPunishmentContent: '惩罚的描述(可多行)',
  punishmentTitle: '受到的惩罚',
  details: '详细信息',
  punishmentDate: '受该惩罚的日期',
  punishmentCount: (count) => { return '你已受' + count + '次惩罚' },
  noPunishment: '暂无受到任何惩罚',

  //optique
  yourLeftOptique: '您的左眼视力',
  yourRightOptique: '您的右眼视力',
  leftOptique: '左眼',
  rightOptique: '右眼',
  optiqueDate: '视力测试时间',
  hintOptique: '5.3',
  toggleOptiqueDetails: '展示视力细节',
  optiqueStatistics: '视力曲线图',
  modifyOptiqueDialog: '修改视力',

  //navbar
  schedual: '时间规划',
  statistic: '数据分析',
  achievement: '荣誉',
  punishment: '惩罚',
  optique: '视力信息',
  notification: '通知',
  mood: '身心健康',

  //task errors
  endShouldAfterStart: '终止时间需要在初始时间之后',
  startFieldShouldBeDate: '初始时间是必填项',
  stopFieldShouldBeDate: '终止时间是必填项',
  taskNameIsRequired: '任务名称是必填项',

  //dashboard
  totalTime: '总计',
  dashboard: '数据分析',
  mostTracked: '执行的任务',
  percentage: '百分比:',
  selectPeriod: '选择时期',
  today: '今天',
  yesterday: '昨天',
  thisWeek: '本周',
  lastWeek: '上周',
  thisMonth: '本月',
  lastMonth: '上个月',
  thisYear: '今年',
  lastYear: '去年',
  timeCount: '计时',
  hour: '小时',

  //teacher navbar
  manageStudent: '学生管理',
  manageNotification: '公告管理',
  manageList: '名单管理',
  managePunishment: '惩罚管理',
  manageAchievement: '荣誉管理',

  publishNotification: '发布公告',
  pageNotFound: '未找到该页面',
  selectClass: '选择班级',
  publish: '发布',
  newNotification: '发布新公告',
  notificationTitle: '公告标题',

  addNotificationSucces: '公告发布成功',
  updateNotificationSuccess: '公告更新成功',
  allNotifications: '所有公告',
  nextPage: '下一页',
  prePage: '上一页',
  noNotifications: '没有任何公告',

  //manage students
  id: 'ID',
  date: '日期',
  studentId: '学号',
  department: '学院',
  major: '专业',
  grade: '年级',
  class: '班级',
  name: '姓名',
  sex: '性别',
  birthday: '出生日期',
  room: '宿舍',
  male: '男',
  female: '女',

  searchInput: '搜索条件',
  classs: '班级',
  all: '全部',
  grade1: '一年级',
  grade2: '二年级',
  grade3: '三年级',
  grade4: '四年级',
  invalidDateFormat: '错误的时间格式',
  noStudent: '没有学生',

  addAchievement: '添加荣誉',
  addPunishment: '添加惩罚',
  GaddPunishment: '添加惩罚',
  modifyPunishment: '修改惩罚',
  readPunishment: '查看惩罚',
  studentName: '学生',
  addToList: '添加入名单',
  readAchievements: '查看荣誉',
  readPunishments: '查看惩罚',
  editStudent: '编辑学生',
  deleteStudent: '删除学生',

  //manage collects
  collectTitle: '名单标题',
  collectFrom: '名单收集者',
  isSubmit: '是否已提交',

  //personal page
  userId: '学号',
  phone: '电话',
  address: '地址',
  classes: '所教授的班级',
  selectSomeValue: '请选择',
  back: '后退',

  taskInfo: '生活规律',
  optiqueInfo: '视力',
  moodInfo: '身心健康',

  chartLang: {
    downloadJPEG: "下载JPEG",
    downloadPDF: "下载PDF",
    downloadPNG: "下载PNG",
    downloadSVG: "下载SVG",
    loading: "加载中...",
    noData: "没有任何数据",
    printChart: "打印表格"
  },

  verySatisfied: '非常乐观',
  satisfied: '积极向上',
  neutral: '一般般',
  dissatisfied: '失落',
  veryDissatisfied: "非常失落",
  angry: '暴躁',

  studentList: '学生列表',

  content: '内容',
  title: '标题',
  student: '学生',
  teacher: '老师',
  collect: '名单',
  save: "保存",
  saveAndSubmit: '保存并提交',
  saveAndSubmitTooltip: '保存并提交名单到管理员',
  saveSuccess: '保存成功',
  saveFail: '保存失败',
  addStudentToList: '添加学生到名单',
  selectCollect: '选择名单',

  //teacher
  teacherId: '工号',
  manageTeacher: '教师管理',
  manageRole: '角色管理',
  manageCours: '课程管理',
  editTeacher: '编辑老师',
  deleteTeacher: '删除老师',
  to: '发给',
  sendTo: '发送给',
  import: '导入',
  export: '导出',
  downgrade: '降为普通老师',
  upgrade: '升为管理员',
  getClasss: (grade, classs) => { return grade + '年' + classs },

  nameIsRequired: '名字是必填项',
  birthdayShouldBeDate: '出生日期是必填项',
  classIsRequired: '班级是必填项',
  userIdIsRequired: '学号/工号是必填项',
  createUserSuccess: '添加用户成功',
  createUserFail: '添加用户失败',
  updateUserSuccess: '更新用户成功',
  updateUserFail: '更新用户失败',
  manageClass: '班级管理',

  //classes
  noClasses: '没有任何班级',
  editClass: '编辑班级',
  deleteClass: '删除班级',
  addClass: '添加班级',
  className: '班级名',

  //courses
  semester1: '第一学期',
  semester2: '第二学期',
  semester: '学期',
  noCourses: '没有任何课程',
  course: '课程',
  operations: '操作',
  courseName: '课程名',
  deleteCourse: '删除',
  editCourse: '编辑',
  description: '描述',
  courseHours: '课时数',
  credits: '学分',
  code: '课程缩写',
  hours: '课时',
  getSemester: (grade, semester) => { return '大' + grade + '第' + semester + '学期' },
  getScores: (name) => { return name + '的成绩单' },

  //login
  passwordIsRequired: '密码是必填项',
  useridIsRequired: '账号是必填项',
  courseNameIsRequired: '课程名是必填项',
  hoursMustBeNumber: '课时数必须为整数',
  creditsMustBeNumber: '学分必须为数字',

  achievementContentIsRequired: '荣誉内容是必填项',
  achievementTitleIsRequired: '荣誉名称是必填项',
  happenAtIsRequired: '发生日期是必填项',

  punishmentTitleIsRequired: '惩罚名称是必填项',
  punishmentContentIsRequired: '惩罚内容是必填项',
  classNameIsRequired: '班级名是必填项',

  collectTitleIsRequired: '名单名是必填项',
  collectContentIsRequired: '名单内容是必填项',

  phoneIsRequired: '电话是必填项',
  addressIsRequired: '地址是必填项',

  info: '个人信息',
  moodTextIsRequired: '心情内容是必填项',
  newPassword: '新密码',
  oldPassword: '旧密码',
  viewSchedual: '查看课表',
  changePassword: '修改密码',
  modifyPasswordSuccess: '密码修改成功',
  modifyPasswordFail: '密码修改失败',
  nextWeek: '下周',
  prevWeek: '上周',

  index: '选择课时',
  index1: '第一节课',
  index2: '第二节课',
  index3: '第三节课',
  index4: '第四节课',
  index5: '第五节课',
  index6: '第六节课',
  index7: '第七节课',
  index8: '第八节课',

  monday: '星期一',
  tuesday: '星期二',
  wednesday: '星期三',
  thursday: '星期四',
  friday: '星期五',
  saturday: '星期六',
  sunday: '星期日',
  isAdmin: '管理员',
  scores: '查看成绩',
  teacherCourse: '所授课程',
  score: '分数',
  giveScore: '成绩管理',
  noScore: '没有任何成绩',
  mySchedual: '我的课表',
  checks: '签到次数',
  onArchive: '后台归档中...',
  arrangeSchedual: '自动排序课程表',
  logout: '退出登录',
  tagnameIsRequired: '标签名是必填项',
  deleteSuccess: '删除成功',
  deleteFail: '删除失败',
  rightOptiqueMustBeNumber: '右眼度数必须是数字',
  leftOptiqueMustBeNumber: '左眼度数必须是数字',
  noTeacher : '没有老师',
  myScores: '我的成绩',

  manageClassroom: '教室管理',
  classroomTitle: '教室',
  classroom: '教室',
  inoccupe: '未被使用',
  usedBy: '当前使用者:',
  classroomNameIsRequired: '教室名称是必须的',
}