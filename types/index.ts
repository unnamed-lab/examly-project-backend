export interface CustomRequest extends Request {
  user?: {
    userId: number;
  };
}
