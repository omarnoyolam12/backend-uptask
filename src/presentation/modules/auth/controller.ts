import { Request, Response } from "express";

import { UserRepository, ConfirmationCodeRepository, RefreshTokenRepository } from "../../../domain/repositories";
import { RegisterDto, ConfirmAccountDto, ResendConfirmationDto, LoginDto, RefreshSessionDto, LogoutDto } from "../../../domain/dtos/auth";
import { Register, ConfirmAccount, ResendConfirmation, Login, RefreshSession, Logout } from "../../../domain/use-cases/auth";
import { PasswordHasher, EmailSender, TokenSigner, RefreshTokenGenerator } from "../../../domain/adapters";
import { handleError } from "../../helpers/handle-error";

interface AuthControllerDependecies {
    userRepository: UserRepository
    confirmationCodeRepository: ConfirmationCodeRepository
    refreshTokenRepository: RefreshTokenRepository
    passwordHasher: PasswordHasher
    tokenSigner: TokenSigner
    refreshTokenGenerator: RefreshTokenGenerator
    emailSender: EmailSender
}

export class AuthController {

    private readonly userRepository: UserRepository;
    private readonly confirmationCodeRepository: ConfirmationCodeRepository;
    private readonly refreshTokenRepository: RefreshTokenRepository;
    private readonly passwordHasher: PasswordHasher;
    private readonly tokenSigner: TokenSigner;
    private readonly refreshTokenGenerator: RefreshTokenGenerator;
    private readonly emailSender: EmailSender;

    constructor(
        dependencies: AuthControllerDependecies
    ){
        this.userRepository = dependencies.userRepository;
        this.confirmationCodeRepository = dependencies.confirmationCodeRepository;
        this.refreshTokenRepository = dependencies.refreshTokenRepository;
        this.passwordHasher = dependencies.passwordHasher;
        this.tokenSigner = dependencies.tokenSigner;
        this.refreshTokenGenerator = dependencies.refreshTokenGenerator;
        this.emailSender = dependencies.emailSender;
    }

    public register = (req: Request, res: Response) => {
        const [error, registerDto] = RegisterDto.create(req.body);
        if(error) return res.status(400).json({error});

        new Register(
            this.userRepository, 
            this.confirmationCodeRepository, 
            this.passwordHasher, 
            this.emailSender
        )
            .execute(registerDto!)
            .then(user => res.json({
                success: true,
                status: 201,
                message: "Usuario registrado exitosamente",
                data: user
            }))
            .catch(error => handleError(error, res));
    }

    public confirmAccount = (req: Request, res: Response) => {
        const [error, confirmAccountDto] = ConfirmAccountDto.create(req.body);
        if(error) return res.status(400).json({error});

        new ConfirmAccount(
            this.userRepository,
            this.confirmationCodeRepository
        )
            .execute(confirmAccountDto!)
            .then(user => res.json({
                success: true,
                status: 200,
                message: "Cuenta confirmada exitosamente",
                data: user
            }))
            .catch(error => handleError(error, res));
    }

    public resendConfirmation = (req: Request, res: Response) => {
        const [error, resendConfirmationDto] = ResendConfirmationDto.create(req.body);
        if(error) return res.status(400).json({error});

        new ResendConfirmation(
            this.userRepository,
            this.confirmationCodeRepository,
            this.emailSender
        )
            .execute(resendConfirmationDto!)
            .then(user => res.json({
                success: true,
                status: 200,
                message: "Código de confirmación reenviado exitosamente",
                data: user
            }))
            .catch(error => handleError(error, res));
    }

    public login = (req: Request, res: Response) => {
        const [error, loginDto] = LoginDto.create(req.body);
        if(error) return res.status(400).json({error});

        new Login(
            this.userRepository,
            this.refreshTokenRepository,
            this.passwordHasher,
            this.tokenSigner,
            this.refreshTokenGenerator,
        )
            .execute(loginDto!)
            .then(user => res.json({
                success: true,
                status: 200,
                message: "Usuario logueado exitosamente",
                data: user
            }))
            .catch(error => handleError(error, res));
    }

    public refreshSession = (req: Request, res: Response) => {
        const [error, refreshSessionDto] = RefreshSessionDto.create(req.body);
        if(error) return res.status(400).json({error});

        new RefreshSession(
            this.userRepository,
            this.refreshTokenRepository,
            this.tokenSigner,
            this.refreshTokenGenerator,
        )
            .execute(refreshSessionDto!)
            .then(user => res.json({
                success: true,
                status: 200,
                message: "Sesión actualizada exitosamente",
                data: user
            }))
            .catch(error => handleError(error, res));
    }  

    public logout = (req: Request, res: Response) => {
        const [error, logoutDto] = LogoutDto.create(req.body);
        if(error) return res.status(400).json({error});

        new Logout(
            this.refreshTokenRepository,
            this.refreshTokenGenerator
        )
            .execute(logoutDto!)
            .then(() => res.json({
                success: true,
                status: 200,
                message: "Sesión cerrada exitosamente",
            }))
            .catch(error => handleError(error, res));
    }  
}