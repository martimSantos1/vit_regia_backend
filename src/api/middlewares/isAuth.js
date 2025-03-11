import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const isAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).end();
  }

  try {
    const decodedToken = jwt.verify(token, process.env.secretKey);
    req.user = decodedToken;
    console.log('decodedToken:', decodedToken);
    return next();
  } catch (e) {
    console.error('Error verifying token:', e);
    return res.status(401).end();
  }
};

export default isAuth;