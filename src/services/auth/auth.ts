import config from "config";
import passport from "passport";
import { model as User } from "../../models/user";
import { genToken, getStrategy } from "../../utils/authStrategy";

class Auth {
  /**
   * Initialize passport strategy
   */
  public initialize = () => {
    passport.use("jwt", getStrategy(User, 1));
    return passport.initialize();
  };

  public session = () => {
    return passport.session();
  };

  public authenticate = (callback: any) =>
    passport.authenticate(
      "jwt",
      { session: true, failWithError: true },
      callback
    );

  /**
   * User login
   * @param req
   * @param res
   */
  public login = async (req: any, res: any) => {
    try {
      req.checkBody("username", "Invalid username").notEmpty();
      req.checkBody("password", "Invalid password").notEmpty();

      const errors = req.validationErrors();
      if (errors) {
        throw errors;
      }

      const user = await User.findOne({ username: req.body.username }).exec();

      if (user === null) {
        throw new Error("User not found");
      }

      const success = await user.comparePassword(req.body.password);
      if (!success) {
        throw new Error("");
      }

      res.status(200).json(genToken(user), user.id);
    } catch (err) {
      res.status(401).json({ message: "Invalid credentials", errors: err });
    }
  };
}

export default new Auth();
