// types/express.d.ts
import { IUser } from "../models/user.model"; // Import your User interface if you have one

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name?: string;
        email?: string;
        // add other fields your auth middleware attaches
      };
    }
  }
}
