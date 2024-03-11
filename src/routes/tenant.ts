import express, { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import logger from "../config/logger";
import { Roles } from "../constants";
import { TenantController } from "../controllers/TenantController";
import { Tenant } from "../entity/Tenant";
import authenticate from "../middlewares/authenticate";
import { canAccess } from "../middlewares/canAccess";
import { TennatService } from "../services/TenantService";
import tenantValidator from "../validators/tenantValidator";
const router = express.Router();

const tenantRepository = AppDataSource.getRepository(Tenant);
const tenantService = new TennatService(tenantRepository);
const tenantController = new TenantController(tenantService, logger);

router.post(
  "/",
  authenticate,
  canAccess([Roles.ADMIN]),
  tenantValidator,
  (req: Request, res: Response, next: NextFunction) =>
    tenantController.create(req, res, next),
);

export default router;
