import Joi from "joi";

export class PageValidator {
  static page = Joi.number().integer().min(1).required().messages({
    "number.base": "The page must be an integer.",
    "number.integer": "The page must be an integer.",
    "number.min": "The page must be at least 1.",
    "any.required": "The page is required.",
  });
  static count = Joi.number().integer().min(1).required().messages({
    "number.base": "The count must be an integer.",
    "number.integer": "The count must be an integer.",
    "number.min": "The count must be at least 1.",
    "any.required": "The count is required.",
  });

  static pageValidate = Joi.object({
    page: this.page.required(),
    count: this.count.required(),
  });
}
