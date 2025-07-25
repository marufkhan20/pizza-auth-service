import express from "express";
import { AppDataSource } from "../config/data-source";
import { AuthController } from "../controllers/AuthController";
import { User } from "../entity/User";
import { UserService } from "../services/UserService";

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const authController = new AuthController(userService);

router.post("/register", (req, res) => authController.register(req, res));

export default router;
