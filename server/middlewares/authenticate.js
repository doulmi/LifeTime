import jwt from 'jsonwebtoken'
import config from '../config'
import User from '../models/user'

export default (req, res, next) => {
  const authorizationHeader = req.headers['authorization'];
  let token;

  if (authorizationHeader) {
    token = authorizationHeader.split(' ')[1];
  }

  if (token) {
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if (err) {
        res.status(401).json({ error: '身份验证失败' })
      } else {
        User.findOne({ userId: decoded.userId })
          .populate('role')
          .exec((err, user) => {
            if (!user) {
              res.status(404).json({ error: '该用户不存在' });
            }
            req.user = user;
            next();
          });
      }
    });
  } else {
    res.status(403).json({ error: '必须提供对应的token才能访问该页面' })
  }
}