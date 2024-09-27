declare global {
  namespace Express {
    interface Request {
      User: { id: string; email: string };
    }
  }
}
