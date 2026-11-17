import { Request, Response } from "express";

import { UserRepository } from "../../domain/repositories/user.repository";
import { SearchUserDto, UpdateProfileDto } from "../../domain/dtos/users";
import { GetProfile, UpdateProfile, SearchUsers } from "../../domain/use-cases/users";

export class UserController {
    
    constructor(
        private readonly userRepository: UserRepository,
        private readonly handleError: (res: Response<any, Record<string, any>>, error: unknown) => Response<any, Record<string, any>>
    ) {}

    public getProfile = (req: Request, res: Response) => {

    }
}