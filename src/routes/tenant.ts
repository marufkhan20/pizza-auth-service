import express, { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import logger from "../config/logger";
import { Roles } from "../constants";
import { TenantController } from "../controllers/TenantController";
import { Tenant } from "../entity/Tenant";
import authenticate from "../middlewares/authenticate";
import { canAccess } from "../middlewares/canAccess";
import { TennatService } from "../services/TenantService";
import { CreateTenantRequest } from "../types";
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
  (req: CreateTenantRequest, res: Response, next: NextFunction) =>
    tenantController.create(req, res, next),
);
router.patch(
  "/:id",
  authenticate,
  canAccess([Roles.ADMIN]),
  tenantValidator,
  (req: CreateTenantRequest, res: Response, next: NextFunction) =>
    tenantController.update(req, res, next),
);

router.get("/", (req: Request, res: Response, next: NextFunction) =>
  tenantController.getAll(req, res, next),
);
router.get("/:id", (req: Request, res: Response, next: NextFunction) =>
  tenantController.getOne(req, res, next),
);
router.delete(
  "/:id",
  authenticate,
  canAccess([Roles.ADMIN]),
  (req: Request, res: Response, next: NextFunction) =>
    tenantController.destroy(req, res, next),
);

export default router;
