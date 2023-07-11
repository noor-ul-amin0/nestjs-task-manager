import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthCredentialsDto, CreateUserDto } from "./dto/auth-credentials.dto";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./jwt-payload.interface";
import { InjectModel } from "@nestjs/sequelize";
import * as jwt from "jsonwebtoken";
import { MailService } from "../mail/mail.service";
import { User } from "src/users/users.model";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  // private methods
  //------------------------------------------------------------------------//
  private generateVerificationToken(payload: JwtPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
  }

  //------------------------------------------------------------------------//

  async signUp(createUserDto: CreateUserDto): Promise<string> {
    const { email, password, name } = createUserDto;
    const user = await this.userModel.findOne({
      where: { email: email.toLowerCase() },
    });
    if (user && user.isVerified) {
      throw new ConflictException("Email already exists");
    }
    if (user && !user.isVerified) {
      throw new UnauthorizedException(
        "An account already exists with this email. Please verify it.",
      );
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await this.userModel.create({
      email,
      password: hashedPassword,
      name,
    });
    // Send verification email with JWT token
    const verificationLink =
      process.env.APP_BASE_URL +
      "/auth/verify/email/" +
      this.generateVerificationToken({
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      });
    const mailOptions = {
      from: process.env.MAILTRAP_SENDER_EMAIL,
      to: email,
      subject: "Your Email Verification Link (valid for 2 hours)",
      message: "Write PUT request to this URL to verify your email",
      html: `
       <center>
       <h3>Email verification link is as follows:</h3> <br>
       <h4>Send a PUT request to this URL to verify your email</h4> <br>
       <a href="${verificationLink}">${verificationLink}</a>
       </center
    `,
    };
    await this.mailService.sendEmail(mailOptions);
    return "A verification email has been sent to your email address. Please verify it.";
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { email, password } = authCredentialsDto;
    const user = await this.userModel.findOne({
      where: { email, githubId: null },
      paranoid: false,
    });
    if (user && user.isSoftDeleted())
      throw new ForbiddenException(
        "Your account has been suspended, please contact support.",
      );
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { id: user.id, email, role: user.role };
      const accessToken: string = this.jwtService.sign(payload);
      return { accessToken };
    }
    if (user && !user.isVerified) {
      throw new UnauthorizedException("Please verify your email");
    } else {
      throw new UnauthorizedException("Invalid email or password");
    }
  }
  async findOrCreateUser(
    name: string,
    email: string,
    githubId: string,
  ): Promise<User> {
    let user = await this.userModel.findOne({
      where: { email },
    });
    if (user && !user.githubId)
      throw new BadRequestException("User already exists");
    if (!user) {
      user = await this.userModel.create({
        name,
        email,
        githubId,
        isVerified: true,
      });
    }

    return user;
  }
  async findOne(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ where: { email } });
  }

  async forgotPassword(email: string): Promise<string> {
    const user = await this.userModel.findOne({ where: { email } });

    if (user && user.isVerified && !user.githubId) {
      const passwordResetToken = this.generateVerificationToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      const resetPasswordLink = // Generate reset password link
        process.env.APP_BASE_URL + "/auth/reset-password/" + passwordResetToken;

      const mailOptions = {
        from: process.env.MAILTRAP_SENDER_EMAIL,
        to: email,
        subject: "Your password reset token  (valid for 2 hours)",
        message: "Write PUT request to this URL to reset your password",
        html: `
       <center>
       <h2>Password reset link is as follows:</h2> <br>
       <h4>Send a PUT request to this URL to reset your password</h4> <br>
       <a href="${resetPasswordLink}">${resetPasswordLink}</a>
       </center>
      `,
      };
      await this.mailService.sendEmail(mailOptions);

      await user.update({ passwordResetToken });
      return "A password reset link has been sent to your email address. Please check your inbox and follow the instructions to reset your password.";
    } else
      throw new BadRequestException(
        "Invalid email address or account not verified",
      );
  }

  async resetPassword(token: string, password: string): Promise<string> {
    try {
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET,
      ) as JwtPayload;

      const { id, email } = decodedToken;

      const user = await this.userModel.findOne({
        where: { id, email, githubId: null, isVerified: true },
      });
      if (!user) throw new BadRequestException("Something went wrong");
      if (!user.passwordResetToken || user.passwordResetToken !== token) {
        throw new UnauthorizedException("Invalid reset password token");
      }

      // Update user's password
      const hashedPassword = await bcrypt.hash(password, 12);
      user.password = hashedPassword;
      user.passwordResetToken = null;
      await user.save();

      return "Your password has been reset successfully";
    } catch (error) {
      throw new UnauthorizedException("Invalid reset password token");
    }
  }

  async verifyEmail(token: string): Promise<string> {
    try {
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET,
      ) as JwtPayload;

      const user = await this.userModel.findOne({
        where: {
          id: decodedToken.id,
          email: decodedToken.email,
          githubId: null,
          isVerified: false,
        },
      });

      if (!user) {
        throw new BadRequestException("Email already verified");
      }

      if (user) {
        user.isVerified = true; // Mark the user as verified
        await user.save();
      }
      return "Your email has been verified";
    } catch (error) {
      throw new BadRequestException("Invalid verification token");
    }
  }
}
