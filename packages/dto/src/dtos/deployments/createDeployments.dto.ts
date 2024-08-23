import { createDeploymentsSchema } from "src/deployments/createDeployment.dto";
import { z } from "zod";

export type CreateDeploymentDto = z.infer<typeof createDeploymentsSchema>;
