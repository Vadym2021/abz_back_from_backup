import Joi from "joi";

import { regexConstants } from "../constants";

export class UserValidator {
  static userName = Joi.string().min(2).max(60).trim().messages({
    "string.min": "The name must be at least 2 characters.",
  });
  static userEmail = Joi.string()
    .min(2)
    .max(100)
    .regex(regexConstants.EMAIL)
    .lowercase()
    .trim()
    .messages({
      "string.empty": "The email must be a valid email address.",
      "string.email": "The email must be a valid email address.",
    });
  static userPhone = Joi.string().regex(regexConstants.PHONE).messages({
    "string.empty": "The phone field is required.",
  });
  static position_id = Joi.number().integer().min(1).max(10).required().messages({
    "any.required": "The position id field is required.",
    "number.base": "The position id must be an integer.",
    "number.min": "The position id must be at least 1.",
    "number.max": "The position id must be at most 10."
  });

  static userPhoto = Joi.object()
    .keys({
      mimetype: Joi.string().valid("image/jpeg", "image/png").required(),
      size: Joi.number()
        .max(5 * 1024 * 1024)
        .required(),
    })
    .unknown()
    .messages({
      "object.base": "Image is invalid.",
      "string.empty": "Image is invalid.",
      "string.max": "The photo may not be greater than 5 Mbytes.",
      "any.required": "Image is invalid.",
      "string.valid": "Image is invalid.",
    });

  static create = Joi.object({
    userName: this.userName.required(),
    userEmail: this.userEmail.required(),
    userPhone: this.userPhone.required(),
    position_id: this.position_id.required(),
    userPhoto: this.userPhoto.required(),
  });
}
