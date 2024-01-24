const User = require("../models/user");

class UserManager {
  constructor(userModel) {
    this.User = userModel;
  }
  async createUser(uid, displayName, email) {
    try {
      const [user, created] = await this.User.findOrCreate({
        where: { firebaseUID: uid },
        defaults: {
          firebaseUID: uid,
          displayName: displayName,
          email: email,
        },
      });
      if (created) {
        console.log("A new user was created:", user);
        return user;
      } else {
        console.log("An existing user was found:", user);
      }
    } catch (error) {
      console.error(
        "Error in creating user with uid" + uid + "with error of: ",
        error.message
      );
      throw error;
    }
  }
  async getUserByUID(uid) {
    try {
      const user = await this.User.findOne({
        where: { firebaseUID: uid },
      });
      if (user) {
        return user;
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      console.error(
        "Error in finding user with uid" + uid + "with error of: ",
        error
      );
      throw error;
    }
  }
  async getDisplayNameByUserId(uid) {
    try {
      const user = await this.User.findOne({
        where: { firebaseUID: uid },
      });
      if (user) {
        return user.displayName;
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      console.error(
        "Error in finding user with uid" + uid + "with error of: ",
        error
      );
      throw error;
    }
  }
  async setDisPlayNameByUserId(uid, displayName) {
    try {
      const user = await this.User.findOne({
        where: { firebaseUID: uid },
      });
      if (user) {
        user.displayName = displayName;
        await user.save();
        return;
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      console.error(
        "Error in finding user with uid" + uid + "with error of: ",
        error
      );
      throw error;
    }
  }
}
