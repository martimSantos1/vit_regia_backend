import { Router } from "express";
import { container } from "../../loaders/dependencyInjector";
import { RoleController } from "../../application/controllers/roleController";

const router = Router();

export default (app: Router) => {
	app.use("/roles", router);

	const roleController = container.resolve(RoleController);

	router.post("/create", async (req, res, next) => {
		try {
			await roleController.create(req, res);
		} catch (error) {
			next(error);
		}
	});
	router.get("/all", async (req, res, next) => {
		try {
			await roleController.getAll(req, res);
		} catch (error) {
			next(error);
		}
	});
}
