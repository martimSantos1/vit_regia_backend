import bcrypt from "bcrypt";
import UserService from "../services/userService.js";
import UserDTO from "../dto/userDTO.js";
import { col } from "sequelize";

const userService = new UserService();

const signup = async (req, res) => {
  try {
    let uDTO = new UserDTO({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
      roleId: req.body.role,
    });
    if (
      uDTO.userName === "" ||
      uDTO.email === "" ||
      uDTO.password === "" ||
      uDTO.role === ""
    ) {
      return res.status(403).send("Missing required fields");
    }
    const result = await userService.SignUp(uDTO);
    if (!result) {
      return res.status(500).send("Error signing up");
    }
    const { user, token } = result;

    if (user) {
      res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
      console.log("user", JSON.stringify(user, null, 2));
      console.log(token);
      return res.status(201).send({ user, token });
    } else {
      return res.status(409).send("Details are not correct");
    }
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).send("Internal Server Error");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userService.login(email, password);
    if (!result) {
      return res.status(401).send("Authentication failed");
    }
    const { user, token } = result;

    if (user) {
      const isSame = await bcrypt.compare(password, user.password);

      if (isSame) {
        res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
        console.log("user", JSON.stringify(user, null, 2));
        console.log(token);
        return res.status(201).send({ user, token });
      } else {
        return res.status(401).send("Authentication failed");
      }
    } else {
      return res.status(401).send("Authentication failed");
    }
  } catch (error) {
    console.log("Error in login:", error);
    res.status(500).send("Internal Server Error");
  }
};

const updateUserName = async (req, res) => {
  try {
    console.log("req.user", req.user);
    console.log("req.body", req.body);
    const result = await userService.updateUserName(req.user.id, req.body.userName);
    if (!result) {
      return res.status(500).send("Error updating user info");
    }
    return res.status(200).send(result);
  } catch (error) {
    console.error("Error in updateUserInfo:", error);
    res.status(500).send("Internal Server Error");
  }
}

export default {
  signup,
  login,
  updateUserName,
};