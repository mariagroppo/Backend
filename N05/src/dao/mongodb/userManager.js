import UserModel from "./models/userModel.js";

class UserManager {

  verifyMail = async (email) => {
    try {
        let ok = await UserModel.findOne({userEmail: email}).lean();
        if (ok) {
            return false
        }
        return true
    } catch (error) {
        return false
    }
  }
  
  createUser = async (user) => {
    try {
        const verification = await this.verifyMail(user.userEmail);
        if (verification) {
            return { status: 'success', message: "User created ok.", value: UserModel.create(user)}
        }
        return { status: 'error', message: "User not created. Email already exists.", value: null}
    } catch (error) {
        return { status: 'error', message: "User not created - Error: " + error, value: null}
    }
  };

  checkPassword = async (email, password) => {
    try {
        let user = await UserModel.findOne({userEmail: email}).lean();
        if (user) {
            if (user.inputPassword === password) {
                return { status: 'success', message: "User logged in ok.", value: user}
            } else {
                return { status: 'error', message: "User not logged in. Password incorrect.", value: null}
            }
        } else {
            return { status: 'error', message: "User not logged in. Email not found.", value: null}
        }
    } catch (error) {
        return { status: 'error', message: "User not logged in - Error: " + error, value: null}
    }
  };

}


export default UserManager;