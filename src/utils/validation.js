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


const validateEditProfileData = (req) => {
  
  const isEditAllowed = [
    "firstName",
    "lastName",
    
    "about",
    
    "age",
    "gender",
    "photoUrl",
    "skills"
  ];

  const isAllowed = Object.keys(req.body).every((field) => isEditAllowed.includes(field));
  
  return isAllowed;


}

module.exports = { validateSignUpData, validateEditProfileData };
