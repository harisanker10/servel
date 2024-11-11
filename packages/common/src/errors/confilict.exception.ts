import { CustomError } from "./ICustomError";

export class ConfilictException extends CustomError {
  constructor(readonly name: string) {
    super(name);
  }
}
