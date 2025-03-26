import { Router } from "express";
import { getAllClients, createClient, updateClient, deleteClient} from "../controllers/clientController";

const router = Router();

router.get("/clients", getAllClients);
router.post("/clients", createClient);
router.put("/clients/:id", updateClient);
router.delete("/clients/:id", deleteClient); 

export default router;
