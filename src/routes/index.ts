import { Router, type Request, type Response } from "express";

const router: Router = Router();

// Health check
router.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

export default router;
