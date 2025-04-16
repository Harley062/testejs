import express from "express";
import morgan from "morgan";
import reviewRoutes from "./routes/review.routes";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger";

const app = express();
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/properties/:propertyId/reviews", reviewRoutes);

export default app;
