import app from "./app.js";
import { config } from "./config.js";
import { prisma } from "./lib/prisma.js";

const startServer = async () => {
  try {
    await prisma.$connect();
    // Start server
    const server = app.listen(config.port, () => {
      console.info(
        `Server running on port ${config.port} in ${config.env} mode`
      );
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      console.info(`${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        console.info("HTTP server closed");

        await prisma.$disconnect();
        console.info("Database connection closed");

        process.exit(0);
      });

      // Force shutdown after timeout
      setTimeout(() => {
        console.error("Forced shutdown after timeout");
        process.exit(1);
      }, 30000);
    };

    // Handle shutdown signals
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    // Handle uncaught errors
    process.on("uncaughtException", (error: Error) => {
      console.error("Uncaught Exception:", error);
      process.exit(1);
    });

    process.on("unhandledRejection", (reason: any) => {
      console.error("Unhandled Rejection:", reason);
      process.exit(1);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
