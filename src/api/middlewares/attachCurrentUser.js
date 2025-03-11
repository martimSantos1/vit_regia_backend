import UserService from '../../services/userService.js';

const userService = new UserService();

const attachCurrentUser = async (req, res, next) => {
  try {
    console.log('req.user:', req.user);
    const user = await userService.findUserById(req.user.id);
    if (!user) {
      return res.status(401).end();
    }
    req.user = user;
    return next();
  } catch (e) {
    console.error('Error attaching user to req:', e);
    return res.status(500).end();
  }
};

export default attachCurrentUser;