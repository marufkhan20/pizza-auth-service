import request from "supertest";
import app from "../../src/app";

describe("POST /auth/register", () => {
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
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json"),
      );
    });

    it("should persist user in the database", async () => {
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
    });
  });

  describe("Fields are missing", () => {});
});
