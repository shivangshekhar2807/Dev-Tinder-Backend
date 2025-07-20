const validator = require('validator');

const validateSignUpData = (req) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName) {
      throw new Error("Name is Not Valid");
    }
    else if (!validator.isEmail(email)) {
      throw new Error("Email is Not Valid");
    }
    else if (!validator.isStrongPassword(password)) {
      throw new Error("Enter a Strong Password");
    }
}

module.exports = {validateSignUpData};
