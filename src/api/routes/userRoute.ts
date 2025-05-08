import { Router } from "express";
import { container } from "../../loaders/dependencyInjector";
import { UserController } from "../../application/controllers/userController";

const router = Router();

export default (app: Router) => {
    app.use("/users", router);

    const userController = container.resolve(UserController);

    router.post("/signup", async (req, res, next) => {
        try {
            await userController.create(req, res);
        } catch (error) {
            next(error);
        }
    });
    router.get("/all", async (req, res, next) => {
        try {
            await userController.getAll(req, res);
        } catch (error) {
            next(error);
        }
    });
};