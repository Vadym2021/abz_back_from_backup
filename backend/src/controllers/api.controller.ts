import {NextFunction, Request, Response} from "express";

import {AppDataSource} from "../app";
import {IToken, Token} from "../entity";
import {IPositionst, IUser, IUserRequest, User} from "../entity";
import {apiService} from "../service/api.servce";

class ApiController {
    public async createToken(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response<IToken>> {
        try {
            const token = await apiService.createToken();
            const results = await AppDataSource.getRepository(Token).save(token);
            return res.send(results);
        } catch (e) {
            next(e);
        }
    }

    public async getAllUsersWithPagination(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response<IUser[]>> {
        try {
            const page = parseInt(req.query.page as string, 10);
            const offset = parseInt(req.query.offset as string, 10);
            const count = parseInt(req.query.count as string, 10);

            const users = await apiService.getAllUsersWithPagination(page, offset, count);

            return res.json(users);
        } catch (e) {
            next(e);
        }
    }

    public async createUser(req: Request, res: Response): Promise<any> {
        const {userName, userEmail, userPhone, position_id} = req.body;

        const userPhoto = req.files["userPhoto"];

        const userData = {
            userName,
            userEmail,
            userPhone,
            position_id,
            userPhoto: userPhoto,
        };

        const user = await apiService.createUser(userData);

        const results = await AppDataSource.getRepository(User).save(user);
        return res.send({
            success: true,
            user_id: results.userId,
            message: "New user successfully registered",
        });
    }

    public async getUserById(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response<IUserRequest>> {
        const id = +req.params.id;
        const user = await apiService.getUserById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "The user with the requested identifier does not exist",
                fails: {
                    user_id: ["User not found"],
                },
            });
        }

        const formattedUser = {
            id: user.userId,
            name: user.userName,
            email: user.userEmail,
            phone: user.userPhone,
            position: user.position,
            position_id: user.position_id,
            photo: user.userPhoto,
        };

        return res.json({
            success: true,
            user: formattedUser,
        });
    }

    public async getPositions(
        req: Request,
        res: Response,
    ): Promise<Response<IPositionst>> {
        const positions = await apiService.getPositions();
        return res.json(positions);
    }
}

export const apiController = new ApiController();
