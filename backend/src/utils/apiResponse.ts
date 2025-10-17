import { Response } from "express";
import { Document } from "mongoose";

type ApiResponseData = Record<string, unknown> | Document | unknown[] | null;

const apiResponse = (
  res: Response,
  status: number,
  success: boolean,
  message: string,
  data?: ApiResponseData
): void => {
  res.status(status).json({
    success,
    message,
    data: data ?? null,
  });
};

export default apiResponse;
