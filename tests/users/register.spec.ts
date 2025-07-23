import request from "supertest";
import { App } from "supertest/types";
import { DataSource } from "typeorm";
import app from "../../src/app";
import { AppDataSource } from "../../src/config/data-source";
import { truncateTables } from "../utils";

describe("POST /auth/register", () => {
  let connection: DataSource;

  beforeAll(async () => {
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    // Database truncate
    await truncateTables(connection);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe("Given all fields", () => {
    it("should return 201 status code", async () => {
      // Arrange
      const userData = {
        firstName: "Md",
        lastName: "Maruf",
        email: "maruf@gmail.com",
        password: "marufkhan",
      };

      // Act
      const response = await request(app as unknown as App)
        .post("/auth/register")
        .send(userData);

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
      const response = await request(app as unknown as App)
        .post("/auth/register")
        .send(userData);

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
      await request(app as unknown as App)
        .post("/auth/register")
        .send(userData);

      // Assert
      const userRepository = connection.getRepository("User");
      const users = await userRepository.find();

      expect(users).toHaveLength(1);
      expect(users[0].firstName).toBe(userData.firstName);
      expect(users[0].lastName).toBe(userData.lastName);
      expect(users[0].email).toBe(userData.email);
      expect(users[0].password).toBe(userData.password);
    });
  });

  describe("Fields are missing", () => {});
});
