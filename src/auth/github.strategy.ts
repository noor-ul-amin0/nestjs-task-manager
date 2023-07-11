import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-github";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, "github") {
  constructor(
    private userService: AuthService,
    private jwtService: JwtService,
  ) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URI,
      scope: ["public_profile"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: any,
  ): Promise<any> {
    const { displayName, emails, id } = profile;
    const user = await this.userService.findOrCreateUser(
      displayName,
      emails[0].value,
      id,
    );

    const payload = { userId: user.id, email: user.email };
    const jwtToken = this.jwtService.sign(payload);

    done(null, { accessToken: jwtToken });
  }
}
