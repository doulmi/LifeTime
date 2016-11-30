export default (req, res, next) => {
  if (req.user.role.slug == 'student') {
    next();
  } else {
    res.status(403).json({ error: '必须提供对应的学生token才能访问该页面' })
  }
}