import { UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "../guards/admin-auth.guard";

export const Admin = () => UseGuards(AdminAuthGuard)