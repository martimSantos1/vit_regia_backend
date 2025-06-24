import { Router } from "express";
import { container } from "../../loaders/dependencyInjector";
import { UserController } from "../../application/controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

export default (app: Router) => {
    app.use("/users", router);

    const userController = container.resolve(UserController);

    router.post("/login", async (req, res, next) => {
        try {
            await userController.login(req, res);
        } catch (error) {
            next(error);
        }
    });
    router.post("/signup", async (req, res, next) => {
        try {
            await userController.create(req, res);
        } catch (error) {
            next(error);
        }
    });
    router.post("/logout", async (req, res, next) => {
        try {
            await userController.logout(req, res);
        } catch (error) {
            next(error);
        }
    });
    router.post("/refresh", async (req, res, next) => {
        try {
            await userController.refreshToken(req, res);
        } catch (error) {
            next(error);
        }
    });
    router.get("/all", authMiddleware, async (req, res, next) => {
        try {
            await userController.getAll(req, res);
        } catch (error) {
            next(error);
        }
    });
    router.get("/me", authMiddleware, async (req, res, next) => {
        try {
            await userController.getById(req, res);
        } catch (error) {
            next(error);
        }
    });
    router.patch("/update", authMiddleware, async (req, res, next) => {
        try {
            await userController.update(req, res);
        } catch (error) {
            next(error);
        }
    });
    router.delete("/delete", authMiddleware, async (req, res, next) => {
        try {
            await userController.delete(req, res);
        } catch (error) {
            next(error);
        }
    });
};