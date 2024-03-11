import express, { NextFunction, Response } from "express";
import { AppDataSource } from "../config/data-source";
import logger from "../config/logger";
import { Roles } from "../constants";
import { UserController } from "../controllers/UserController";
import { User } from "../entity/User";
import authenticate from "../middlewares/authenticate";
import { canAccess } from "../middlewares/canAccess";
import { UserService } from "../services/UserService";
import { UpdateUserRequest } from "../types";
import updateUserValidator from "../validators/updateUserValidator";
const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const userController = new UserController(userService, logger);

// create a user
router.post("/", authenticate, canAccess([Roles.ADMIN]), (req, res, next) =>
  userController.create(req, res, next),
);

router.patch(
  "/:id",
  authenticate,
  canAccess([Roles.ADMIN]),
  updateUserValidator,
  (req: UpdateUserRequest, res: Response, next: NextFunction) =>
    userController.update(req, res, next),
);

// get all users
router.get("/", authenticate, canAccess([Roles.ADMIN]), (req, res, next) =>
  userController.getAll(req, res, next),
);

// get single user
router.get("/:id", authenticate, canAccess([Roles.ADMIN]), (req, res, next) =>
  userController.getOne(req, res, next),
);

// delete user
router.delete(
  "/:id",
  authenticate,
  canAccess([Roles.ADMIN]),
  (req, res, next) => userController.destroy(req, res, next),
);

export default router;
