import userService from "../../services/userService.js";
import UserDTO from "../../dto/userDTO.js";

const attachCurrentUser = async (req, res, next) => {
  try {
    if (!req.token || req.token == undefined) {
      return next(new Error("Token inexistente ou inválido"));
    }

    const id = req.token.id;
    const user = await userService.findUserById(id);

    if (user) {
      req.user = new UserDTO(user);
      next();
    } else {
      return next(new Error("Token não corresponde a qualquer utilizador do sistema"));
    }
  } catch (error) {
    console.error('Error attaching user to req:', error);
    return next(error);
  }
};

export default attachCurrentUser;