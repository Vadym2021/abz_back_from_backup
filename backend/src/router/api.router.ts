import { Router } from "express";

import { apiController } from "../controllers/api.controller";
import { apiMiddleware } from "../middlewares";
import { PageValidator, UserValidator } from "../validators";

const router = Router();

router.get("/token", apiController.createToken);

router.get(
  "/users",
  apiMiddleware.userWithPaginationValidation(PageValidator.pageValidate),
  apiController.getAllUsersWithPagination,
);

router.post(
  "/users",
  apiMiddleware.checkToken,
  apiMiddleware.userValidation(UserValidator.create),
  apiMiddleware.checkUniqueUser,
  apiMiddleware.deleteToken,
  apiController.createUser,
);

router.get("/users/:id", apiMiddleware.checkUserId, apiController.getUserById);

router.get("/positions", apiController.getPositions);

export const apiRouter = router;
