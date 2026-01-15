import express from "express";
import { SaveURL } from "../Controllers/SaveURL.js";

const router = express.Router();

router.post("/save", SaveURL);

export default router;
