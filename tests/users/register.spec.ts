import request from "supertest";
import { DataSource } from "typeorm";
import app from "../../src/app";
import { AppDataSource } from "../../src/config/data-source";
import { Roles } from "../../src/constants";
import { User } from "../../src/entity/User";
import { isJwt } from "../utils";

describe("POST /auth/register", () => {
  let connection: DataSource;

  beforeAll(async () => {
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    // database truncate
    await connection.dropDatabase();
    await connection.synchronize();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe("Given all fields", () => {
    it("should return the 201 status code", async () => {
      // Arrange
      const userData = {
        firstName: "Md",
        lastName: "Maruf",
        email: "maruf@gmail.com",
        password: "marufkhan",
      };

      // Act
      const response = await request(app).post("/auth/register").send(userData);

      // Assert
      expect(response.statusCode).toBe(201);
    });

    it("should return valid json response", async () => {
      // Arrange
      const userData = {
        firstName: "Md",
        lastName: "Maruf",
        email: "maruf@gmail.com",
        password: "marufkhan",
      };

      // Act
      const response = await request(app).post("/auth/register").send(userData);

      // Assert
      expect(
        (response.headers as Record<string, string>)["content-type"],
      ).toEqual(expect.stringContaining("json"));
    });

    it("should persist the user in the database", async () => {
      // Arrange
      const userData = {
        firstName: "Md",
        lastName: "Maruf",
        email: "maruf@gmail.com",
        password: "marufkhan",
      };

      // Act
      await request(app).post("/auth/register").send(userData);

      // Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(1);
      expect(users[0].firstName).toBe(userData.firstName);
      expect(users[0].lastName).toEqual(userData.lastName);
      expect(users[0].email).toEqual(userData.email);
    });

    it("should return an id of the created user", async () => {
      // Arrange
      const userData = {
        firstName: "Md",
        lastName: "Maruf",
        email: "maruf@gmail.com",
        password: "marufkhan",
      };

      // Act
      const response = await request(app).post("/auth/register").send(userData);

      // Assert
      expect(response.body).toHaveProperty("id");
    });

    it("should assign a customer role", async () => {
      // Arrange
      const userData = {
        firstName: "Md",
        lastName: "Maruf",
        email: "maruf@gmail.com",
        password: "marufkhan",
      };

      // Act
      await request(app).post("/auth/register").send(userData);

      // Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users[0]).toHaveProperty("role");
      expect(users[0].role).toBe(Roles.CUSTOMER);
    });

    it("should store the hashed password in the database", async () => {
      // Arrange
      const userData = {
        firstName: "Md",
        lastName: "Maruf",
        email: "maruf@gmail.com",
        password: "marufkhan",
      };

      // Act
      await request(app).post("/auth/register").send(userData);

      // Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users[0].password).not.toBe(userData.password);
      expect(users[0].password).toHaveLength(60);
      expect(users[0].password).toMatch(/^\$2b\$\d+\$/);
    });

    it("should return 400 status code if email is already exists", async () => {
      // Arrange
      const userData = {
        firstName: "Md",
        lastName: "Maruf",
        email: "maruf20@gmail.com",
        password: "marufkhan",
        role: Roles.CUSTOMER,
      };

      const userRepository = connection.getRepository(User);
      await userRepository.save(userData);

      // Act
      const response = await request(app).post("/auth/register").send(userData);

      // Assert
      const users = await userRepository.find();
      expect(response.statusCode).toBe(400);
      expect(users).toHaveLength(1);
    });

    it("should return the access and refresh token inside a cookie", async () => {
      // Arrange
      const userData = {
        firstName: "Md",
        lastName: "Maruf",
        email: "maruf20@gmail.com",
        password: "marufkhan",
        role: Roles.CUSTOMER,
      };

      // Act
      const response = await request(app).post("/auth/register").send(userData);

      interface Headers {
        ["set-cookie"]: string[];
      }

      // Assert
      let accessToken = null;
      let refreshToken = null;
      const cookies =
        (response.headers as unknown as Headers)["set-cookie"] || [];

      cookies.forEach((cookie) => {
        if (cookie.startsWith("accessToken=")) {
          accessToken = cookie.split(";")[0].split("=")[1];
        }

        if (cookie.startsWith("refreshToken=")) {
          refreshToken = cookie.split(";")[0].split("=")[1];
        }
      });

      expect(accessToken).not.toBeNull();
      expect(refreshToken).not.toBeNull();

      expect(isJwt(accessToken)).toBeTruthy();
      expect(isJwt(refreshToken)).toBeTruthy();
    });
  });

  describe("Fields are missing", () => {
    it("should return 400 status code if email field is missing", async () => {
      // Arrange
      const userData = {
        firstName: "Md",
        lastName: "Maruf",
        email: "",
        password: "marufkhan",
      };

      // Act
      const response = await request(app).post("/auth/register").send(userData);

      // Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(response.statusCode).toBe(400);
      expect(users).toHaveLength(0);
    });

    it("should return 400 status code if firstName field is missing", async () => {
      // Arrange
      const userData = {
        firstName: "",
        lastName: "Maruf",
        email: "maruf@gmail.com",
        password: "marufkhan",
      };

      // Act
      const response = await request(app).post("/auth/register").send(userData);

      // Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(response.statusCode).toBe(400);
      expect(users).toHaveLength(0);
    });

    it("should return 400 status code if lastName field is missing", async () => {
      // Arrange
      const userData = {
        firstName: "Md",
        lastName: "",
        email: "maruf@gmail.com",
        password: "marufkhan",
      };

      // Act
      const response = await request(app).post("/auth/register").send(userData);

      // Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(response.statusCode).toBe(400);
      expect(users).toHaveLength(0);
    });

    it("should return 400 status code if password field is missing", async () => {
      // Arrange
      const userData = {
        firstName: "Md",
        lastName: "Maruf",
        email: "maruf@gmail.com",
        password: "",
      };

      // Act
      const response = await request(app).post("/auth/register").send(userData);

      // Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(response.statusCode).toBe(400);
      expect(users).toHaveLength(0);
    });
  });

  describe("Fields are not in proper format", () => {
    it("should trim the email field", async () => {
      // Arrange
      const userData = {
        firstName: "Md",
        lastName: "Maruf",
        email: " maruf@gmail.com ",
        password: "marufkhan",
        role: Roles.CUSTOMER,
      };

      const userRepository = connection.getRepository(User);
      await userRepository.save(userData);

      // Act
      await request(app).post("/auth/register").send(userData);

      // Assert
      const users = await userRepository.find();
      const user = users[1];
      expect(user.email).toBe("maruf@gmail.com");
    });

    it("should return an array of error messages if email is missing", async () => {
      // Arrange
      const userData = {
        firstName: "Md",
        lastName: "Maruf",
        email: "",
        password: "marufkhan",
        role: Roles.CUSTOMER,
      };

      const userRepository = connection.getRepository(User);
      await userRepository.save(userData);

      // Act
      const response = await request(app).post("/auth/register").send(userData);

      // Assert
      expect(response.body).toHaveProperty("errors");
      expect(
        (response.body as Record<string, string>).errors.length,
      ).toBeGreaterThan(0);
    });

    it("should return 400 status code if email is not a valid email", async () => {
      // Arrange
      const userData = {
        firstName: "Md",
        lastName: "Maruf",
        email: "maruf",
        password: "marufkhan",
        role: Roles.CUSTOMER,
      };

      const userRepository = connection.getRepository(User);
      await userRepository.save(userData);

      // Act
      const response = await request(app).post("/auth/register").send(userData);

      // Assert
      expect(response.statusCode).toBe(400);
    });

    it("should return 400 status code if password length is less than 8 chars", async () => {
      // Arrange
      const userData = {
        firstName: "Md",
        lastName: "Maruf",
        email: "maruf@gmail.com",
        password: "maruf",
        role: Roles.CUSTOMER,
      };

      const userRepository = connection.getRepository(User);
      await userRepository.save(userData);

      // Act
      const response = await request(app).post("/auth/register").send(userData);

      // Assert
      expect(response.statusCode).toBe(400);
    });
  });
});
