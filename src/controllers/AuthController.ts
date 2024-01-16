import { NextFunction, Response } from "express";
import { Logger } from "winston";
import { UserService } from "../services/UserService";
import { RegisterUserRequest } from "../types";

export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger,
  ) {}

  async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
    const { firstName, lastName, email, password } = req.body;
    this.logger.debug("New request to register a user", {
      firstName,
      lastName,
      email,
      password: password ? "*****" : "undefined",
    });

    try {
      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
      });

      this.logger.info("User has been registered", { id: user.id });

      res.status(201).json(user);
    } catch (err) {
      return next(err);
    }
  }
}
