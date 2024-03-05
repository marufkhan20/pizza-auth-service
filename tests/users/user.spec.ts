import createJWKSMock from "mock-jwks";
import request from "supertest";
import { DataSource } from "typeorm";
import app from "../../src/app";
import { AppDataSource } from "../../src/config/data-source";
import { Roles } from "../../src/constants";
import { User } from "../../src/entity/User";

describe("GET /auth/self", () => {
  let connection: DataSource;
  let jwsk: ReturnType<typeof createJWKSMock>;

  beforeAll(async () => {
    jwsk = createJWKSMock("http://localhost:5501");
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    jwsk.start();

    await connection.dropDatabase();
    await connection.synchronize();
  });

  afterEach(() => {
    jwsk.stop();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe("Given all fields", () => {
    it("should return 200 status code", async () => {
      const accessToken = jwsk.token({ sub: String(1), role: "customer" });

      // Act
      const response = await request(app)
        .get("/auth/self")
        .set("Cookie", [`accessToken=${accessToken}`])
        .send();

      expect(response.statusCode).toBe(200);
    });

    it("should return the user data", async () => {
      // Arrange
      const userData = {
        firstName: "Rakesh",
        lastName: "K",
        email: "rakesh@mern.space2",
        password: "password",
        role: Roles.CUSTOMER,
      };

      // Register User
      const userRepository = connection.getRepository(User);
      const user = await userRepository.save(userData);

      // Generate token
      const accessToken = jwsk.token({ sub: String(user.id), role: user.role });

      // Act
      const response = await request(app)
        .get("/auth/self")
        .set("Cookie", [`accessToken=${accessToken}`])
        .send();

      expect((response.body as Record<string, string>).id).toBe(user.id);
    });

    it("should not return the password field", async () => {
      // Arrange
      const userData = {
        firstName: "Rakesh",
        lastName: "K",
        email: "rakesh@mern.space2",
        password: "password",
        role: Roles.CUSTOMER,
      };

      // Register User
      const userRepository = connection.getRepository(User);
      const user = await userRepository.save(userData);

      // Generate token
      const accessToken = jwsk.token({ sub: String(user.id), role: user.role });

      // Act
      const response = await request(app)
        .get("/auth/self")
        .set("Cookie", [`accessToken=${accessToken}`])
        .send();

      expect(response.body as Record<string, string>).not.toHaveProperty(
        "password",
      );
    });
  });
});
