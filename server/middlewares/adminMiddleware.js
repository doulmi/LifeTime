export default (req, res, next) => {
  if (req.user && (req.user.role.slug == 'admin' || req.user.role.slug == 'superAdmin')) {
    next();
  } else {
    res.status(403).json({ error: '必须提供对应的管理员token才能访问该页面' })
  }
}