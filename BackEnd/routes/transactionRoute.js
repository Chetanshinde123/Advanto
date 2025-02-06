import express from "express";
import { Router } from "express";
import { getBarChartData, getCombinedData, getPieChartData, getStatistics, initialize } from "../controllers/transactionCtrl.js";

const router = Router();

router.get("/init", initialize);
router.get("/statistics", getStatistics);
router.get("/barChart", getBarChartData);
router.get("/pie",getPieChartData)
router.get("/combined-data", getCombinedData)


export default router;


