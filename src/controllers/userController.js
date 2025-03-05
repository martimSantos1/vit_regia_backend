import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserService from "../services/userService.js";
import UserDTO from "../dto/userDTO.js";

const userService = new UserService();

const signup = async (req, res) => {
  try {
    console.log("Signup request body:", req.body);
    let uDTO = new UserDTO({ 
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password
    });
    const result = await userService.SignUp(uDTO);
    if (!result) {
      return res.status(500).send("Error signing up");
    }
    const { user, token } = result;

    if (user) {
      res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
      console.log("user", JSON.stringify(user, null, 2));
      console.log(token);
      return res.status(201).send(user);
    } else {
      return res.status(409).send("Details are not correct");
    }
  } catch (error) {
    console.log("Error in signup:", error);
    res.status(500).send("Internal Server Error");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.findUserByEmail(email);

    if (user) {
      const isSame = await bcrypt.compare(password, user.password);

      if (isSame) {
        let token = jwt.sign({ id: user.id }, process.env.secretKey, {
          expiresIn: 1 * 24 * 60 * 60 * 1000,
        });

        res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
        console.log("user", JSON.stringify(user, null, 2));
        console.log(token);
        return res.status(201).send(new UserDTO(user));
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

export default {
  signup,
  login,
};