import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";

import { AppDataSource } from "../app";
import { Token } from "../entity";
import { User } from "../entity";
import { apiService } from "../service/api.servce";

class ApiMiddleware {
  public async checkToken(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.get("Authorization");

      if (!token) {
        return res
          .status(400)
          .json({ success: false, message: "Token is not provided" });
      }
      const jwtPayload = await apiService.checkToken(token);

      const tokenFromDb = await AppDataSource.getRepository(Token).findOneBy({
        token: token,
      });

      if (!tokenFromDb) {
        return res
          .status(400)
          .json({ success: false, message: "Token is invalid" });
      }

      req.res.locals = { jwtPayload, tokenFromDb };

      next();
    } catch (e) {
      next(e);
    }
  }

  public async checkUniqueUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { userPhone, userEmail } = req.body;
      const existingUser = await AppDataSource.getRepository(User).findOne({
        where: [{ userPhone: userPhone }, { userEmail: userEmail }],
      });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "User with this phone or email already exists",
        });
      }
      next();
    } catch (e) {
      next(e);
    }
  }

  public async deleteToken(req: Request, res: Response, next: NextFunction) {
    try {
      const tokenFromDb = req.res.locals.tokenFromDb;
      const token = tokenFromDb.token;
      await AppDataSource.getRepository(Token).remove({ token });
      next();
    } catch (error) {
      next(error);
    }
  }

  public userValidation(validator: ObjectSchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        // const { userPhoto, ...userData } = req.body;
        const { ...userData } = req.body;
        const files = req.files;
        const userPhotoFile = Array.isArray(files.userPhoto)
          ? files.userPhoto[0]
          : files.userPhoto;

        if (userPhotoFile && req.files?.userPhoto) {
          userData.userPhoto = req.files.userPhoto;
        }
        // console.log(userData);
        const { error } = validator.validate(userData, { abortEarly: false });

        if (error) {
          const fails = error.details.reduce((acc: any, current: any) => {
            acc[current.context.key] = acc[current.context.key] || [];
            acc[current.context.key].push(current.message);
            return acc;
          }, {});
          return res
            .status(400)
            .json({ success: false, message: "Validation failed", fails });
        }
        next();
      } catch (error) {
        next(error);
      }
    };
  }

  public userWithPaginationValidation(validator: ObjectSchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { page, count } = req.query;

        const { error } = validator.validate(
          { page, count },
          { abortEarly: false },
        );
        if (error) {
          const fails: Record<string, string[]> = error.details.reduce(
            (acc: any, current: any) => {
              acc[current.context.key] = acc[current.context.key] || [];
              acc[current.context.key].push(current.message);
              return acc;
            },
            {},
          );
          return res
            .status(422)
            .json({ success: false, message: "Validation failed", fails });
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  public async checkUserId(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    const id = req.params.id;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        fails: {
          user_id: ["The user_id must be an integer."],
        },
      });
    }
    next();
  }
}

export const apiMiddleware = new ApiMiddleware();
