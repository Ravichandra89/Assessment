// middlewares/validateRequest.ts
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import apiResponse from "../utils/apiResponse";

export const validateRequest =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      apiResponse(res, 400, false, "Validation Error", {
        errors: error.errors || error.message,
      });
    }
  };
