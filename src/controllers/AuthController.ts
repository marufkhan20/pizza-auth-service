import { Response } from "express";
import { UserService } from "../services/UserService";
import { RegisterUserRequest } from "../types";

export class AuthController {
  constructor(private userService: UserService) {}

  async register(req: RegisterUserRequest, res: Response) {
    await this.userService.create(req.body);

    res.status(201).json();
  }
}
