import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { Repository } from "typeorm";
import { User } from "../entity/User";
import { UserData } from "../types";

export class UserService {
  constructor(private userRepository: Repository<User>) {}

  // create a new user
  async create({ firstName, lastName, email, password, role }: UserData) {
    // check user
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      const err = createHttpError(400, "Email is already exists!");
      throw err;
    }

    // hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    try {
      return await this.userRepository.save({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
      });
    } catch (err) {
      const error = createHttpError(
        500,
        "Failed to store tehe data in the database",
      );
      throw error;
    }
  }

  // find user by email
  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    return user;
  }

  // find user by id
  async findById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    return user;
  }
}
