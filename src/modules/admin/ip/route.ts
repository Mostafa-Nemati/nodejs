import { Router } from "express";
import { validate } from "../../../middlewares/validate";
import { ipSchema } from "./validate";
import { createIp } from "./controller";

const router = Router();

//POST
router.post('/create', validate(ipSchema), createIp);


export default router;