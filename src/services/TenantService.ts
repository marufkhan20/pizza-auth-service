import { Repository } from "typeorm";
import { Tenant } from "../entity/Tenant";
import { ITenant } from "../types";

export class TennatService {
  constructor(private tenantRepository: Repository<Tenant>) {}

  async create(tenantData: ITenant) {
    return await this.tenantRepository.save(tenantData);
  }
}
