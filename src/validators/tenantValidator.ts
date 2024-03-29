import { checkSchema } from "express-validator";

export default checkSchema({
  name: {
    errorMessage: "Tenant Name is required!",
    notEmpty: true,
    // trim: true,
  },
  address: {
    errorMessage: "Tenant Name is required!",
    notEmpty: true,
    // trim: true,
  },
});

// export default [body("email").notEmpty().withMessage("Email is required!")];
