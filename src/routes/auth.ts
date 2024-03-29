import express, { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import logger from "../config/logger";
import { AuthController } from "../controllers/AuthController";
import { RefreshToken } from "../entity/RefreshToken";
import { User } from "../entity/User";
import authenticate from "../middlewares/authenticate";
import parseRefreshToken from "../middlewares/parseRefreshToken";
import validateRefreshToken from "../middlewares/validateRefreshToken";
import { CredentialService } from "../services/CredentialService";
import { TokenService } from "../services/TokenService";
import { UserService } from "../services/UserService";
import { AuthRequest } from "../types";
import loginValidator from "../validators/loginValidator";
import registerValidator from "../validators/registerValidator";

const router = express.Router();

// get user repository
const userRepository = AppDataSource.getRepository(User);

const userService = new UserService(userRepository);
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
const tokenService = new TokenService(refreshTokenRepository);
const credentialService = new CredentialService();
const authController = new AuthController(
  userService,
  logger,
  tokenService,
  credentialService,
);

// register route
router.post(
  "/register",
  registerValidator,
  (req: Request, res: Response, next: NextFunction) =>
    authController.register(req, res, next),
);

// login route
router.post(
  "/login",
  loginValidator,
  (req: Request, res: Response, next: NextFunction) =>
    authController.login(req, res, next),
);

// self route
router.get(
  "/self",
  authenticate,
  (req: Request, res: Response, next: NextFunction) =>
    authController.self(req as AuthRequest, res, next),
);

// refresh route
router.post(
  "/refresh",
  validateRefreshToken,
  (req: Request, res: Response, next: NextFunction) =>
    authController.refresh(req as AuthRequest, res, next),
);

// logout route
router.post(
  "/logout",
  authenticate,
  parseRefreshToken,
  (req: Request, res: Response, next: NextFunction) =>
    authController.logout(req as AuthRequest, res, next),
);

export default router;
