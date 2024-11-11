export abstract class CustomError extends Error {
  constructor(readonly name: string) {
    super(name);
  }
}
