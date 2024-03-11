import express from "express";
import { AppDataSource } from "../config/data-source";
import logger from "../config/logger";
import { TenantController } from "../controllers/TenantController";
import { Tenant } from "../entity/Tenant";
import authenticate from "../middlewares/authenticate";
import { TennatService } from "../services/TenantService";
const router = express.Router();

const tenantRepository = AppDataSource.getRepository(Tenant);
const tenantService = new TennatService(tenantRepository);
const tenantController = new TenantController(tenantService, logger);

router.post("/", authenticate, (req, res, next) =>
  tenantController.create(req, res, next),
);

export default router;
