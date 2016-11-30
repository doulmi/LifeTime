export default (req, res, next) => {
  let role = req.user.role.slug;
  if (req.user && (role == 'teacher' || role == 'admin' || role == 'superAdmin')) {
    next();
  } else {
    res.status(403).json({ error: '必须提供对应的教师token才能访问该页面' })
  }
}