const { verifyUserJwt } = require('../utils/tokenUtils');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyUserJwt(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function professorOnly(req, res, next) {
  if (req.user?.role !== 'professor') {
    return res.status(403).json({ message: 'Access restricted to professors' });
  }
  next();
}

module.exports = { authMiddleware, professorOnly };
