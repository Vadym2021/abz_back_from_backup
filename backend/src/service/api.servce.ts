import path from "node:path";

import { faker } from "@faker-js/faker";
import { UploadedFile } from "express-fileupload";
import * as jwt from "jsonwebtoken";
import tinify from "tinify";
import { v4 } from "uuid";

import { AppDataSource } from "../app";
import { configs } from "../configs/config";
import { Positions } from "../entity";
import { IToken } from "../entity";
import {
  ILink,
  IPositionst,
  IResponse,
  IUser,
  IUserCreate,
  IUserFake,
  IUserRequest,
  User,
} from "../entity";
import { ApiError } from "../errors";

class ApiService {
  public async createToken(): Promise<IToken> {
    try {
      const token = jwt.sign({}, configs.JWT_TOKEN_SECRET, {
        expiresIn: "40m",
      });
      return { success: true, token: token };
    } catch (e) {
      throw e;
    }
  }

  // public async getAllUsersWithPagination(
  //   page: number,
  //   count: number,
  // ): Promise<IResponse> {
  //   try {
  //     const totalCount = await AppDataSource.getRepository(User)
  //       .createQueryBuilder("users")
  //       .getCount();
  //
  //     const totalPages = Math.ceil(totalCount / count);
  //
  //     if (page > totalPages) {
  //       throw new ApiError("Page not found", false, 422);
  //     }
  //
  //     const skip = count * (page - 1);
  //
  //     const users = await AppDataSource.getRepository(User)
  //       .createQueryBuilder("users")
  //       .leftJoinAndSelect("users.position", "position")
  //       .orderBy("users.registration_timestamp", "DESC")
  //       .skip(skip)
  //       .take(count)
  //       .getMany();
  //
  //     const nextLink =
  //       page < totalPages ? `?page=${page + 1}&count=${count}` : null;
  //     const prevLink = page > 1 ? `?page=${page - 1}&count=${count}` : null;
  //
  //     const links: ILink = {
  //       next_url: nextLink,
  //       prev_url: prevLink,
  //     };
  //
  //     const formattedUsers = await Promise.all(
  //       users.map(async (user) => {
  //         const position = await AppDataSource.getRepository(Positions).findOne(
  //           {
  //             where: { positionId: user.position_id },
  //           },
  //         );
  //         return {
  //           userId: user.userId,
  //           userName: user.userName,
  //           userEmail: user.userEmail,
  //           userPhone: user.userPhone,
  //           position: position ? position.positionName : null,
  //           position_id: user.position_id,
  //           registration_timestamp: user.registration_timestamp,
  //           userPhoto: user.userPhoto,
  //         };
  //       }),
  //     );
  //
  //     const response: IResponse = {
  //       success: true,
  //       page: page,
  //       total_pages: totalPages,
  //       total_users: totalCount,
  //       count: count,
  //       links: links,
  //       users: formattedUsers,
  //     };
  //
  //     return response;
  //   } catch (e) {
  //     throw e;
  //   }
  // }

  public async getAllUsersWithPagination(
      page: number,
      offset: number,
      count: number,
  ): Promise<IResponse> {
    try {
      const totalCount = await AppDataSource.getRepository(User)
          .createQueryBuilder("users")
          .getCount();

      let skip;
      let totalPages;
      if (offset) {
        skip = offset;
      } else {
        totalPages = Math.ceil(totalCount / count);
        if (page > totalPages) {
          throw new ApiError("Page not found", false, 422);
        }
        skip = count * (page - 1);
      }

      const users = await AppDataSource.getRepository(User)
          .createQueryBuilder("users")
          .leftJoinAndSelect("users.position", "position")
          .orderBy("users.registration_timestamp", "DESC")
          .skip(skip)
          .take(count)
          .getMany();

      const nextLink =
          offset
              ? null
              : page < totalPages ? `?page=${page + 1}&count=${count}` : null;
      const prevLink = offset ? null : page > 1 ? `?page=${page - 1}&count=${count}` : null;

      const links: ILink = {
        next_url: nextLink,
        prev_url: prevLink,
      };

      const formattedUsers = await Promise.all(
          users.map(async (user) => {
            const position = await AppDataSource.getRepository(Positions).findOne(
                {
                  where: { positionId: user.position_id },
                },
            );
            return {
              userId: user.userId,
              userName: user.userName,
              userEmail: user.userEmail,
              userPhone: user.userPhone,
              position: position ? position.positionName : null,
              position_id: user.position_id,
              registration_timestamp: user.registration_timestamp,
              userPhoto: user.userPhoto,
            };
          }),
      );

      const response: IResponse = {
        success: true,
        page: page,
        total_pages: totalPages,
        total_users: totalCount,
        count: count,
        links: links,
        users: formattedUsers,
      };

      return response;
    } catch (e) {
      throw e;
    }
  }


  public async createUser(data: IUserCreate): Promise<IUser> {
    let userPhoto: UploadedFile;

    if (Array.isArray(data.userPhoto)) {
      userPhoto = data.userPhoto[0];
    } else {
      userPhoto = data.userPhoto;
    }

    const user: IUserFake = {
      userName: data.userName,
      userEmail: data.userEmail,
      userPhone: data.userPhone,
      position_id: data.position_id,
      registration_timestamp: Math.floor(Date.now() / 1000),
      userPhoto: this.TinifyPhoto(userPhoto),
    };
    const createdUser = AppDataSource.getRepository(User).create(user);
    return createdUser;
  }

  public async getUserById(id: number): Promise<IUserRequest> {
    const user = await AppDataSource.getRepository(User).findOneBy({
      userId: id,
    });
    if (!user) {
      return undefined;
    }

    const position = await AppDataSource.getRepository(Positions).findOne({
      where: { positionId: user.position_id },
    });
    const formattedUser: IUserRequest = {
      userId: user.userId,
      userName: user.userName,
      userEmail: user.userEmail,
      userPhone: user.userPhone,
      position: position ? position.positionName : null,
      position_id: user.position_id,
      userPhoto: user.userPhoto,
    };

    return formattedUser;
  }

  public async getPositions(): Promise<IPositionst> {
    const positions = await AppDataSource.getRepository(Positions).find();
    const formattedPositions = positions.map((position) => ({
      id: position.positionId,
      name: position.positionName,
    }));

    return {
      success: true,
      positions: formattedPositions,
    };
  }

  public async generateUsers(numUsers: number) {
    try {
      for (let i = 0; i < numUsers; i++) {
        const user: IUserFake = {
          userName: faker.internet.userName(),
          userEmail: faker.internet.email(),
          userPhone: faker.phone.number("+380#########"),
          position_id: Math.floor(Math.random() * 10) + 1,
          registration_timestamp: Math.floor(Date.now() / 1000),
          userPhoto: this.TinifyPhotoFake(faker.image.avatar()),
        };
        await AppDataSource.getRepository(User).save(user);
      }
    } catch (err) {}
  }

  private TinifyPhoto(file: UploadedFile): string {
    const filePath = this.buildPath(configs.AWS_S3_NAME, "abz_user", file.name);

    tinify.key = configs.TINYFY_KEY;

    const source = tinify.fromFile(file.tempFilePath);
    const resized = source.resize({
      method: "cover",
      width: 70,
      height: 70,
    });
    const converted = resized.convert({ type: ["image/jpg"] });

    converted.store({
      service: "s3",
      aws_access_key_id: configs.AWS_ACCESS_KEY,
      aws_secret_access_key: configs.AWS_SECRET_KEY,
      region: configs.AWS_S3_REGION,
      path: filePath,
    });
    return filePath;
  }

  private TinifyPhotoFake(data: string): string {
    const filePath = this.buildPath(configs.AWS_S3_NAME, "abz_user", data);

    tinify.key = configs.TINYFY_KEY;
    const source = tinify.fromUrl(data);
    const resized = source.resize({
      method: "cover",
      width: 70,
      height: 70,
    });
    const converted = resized.convert({ type: ["image/jpg"] });

    converted.store({
      service: "s3",
      aws_access_key_id: configs.AWS_ACCESS_KEY,
      aws_secret_access_key: configs.AWS_SECRET_KEY,
      region: configs.AWS_S3_REGION,
      path: filePath,
    });
    return filePath;
  }

  private buildPath(bucket: string, type: string, fileName: string): string {
    return `${bucket}/${type}/${v4()}${path.extname(fileName)}`;
  }

  public checkToken(token: string): IToken {
    try {
      const secret = configs.JWT_TOKEN_SECRET;

      return jwt.verify(token, secret) as IToken;
    } catch (e) {
      throw new ApiError("The token expired.", false, 401);
    }
  }
}

export const apiService = new ApiService();
