import { CustomError } from "./ICustomError";

export class NotFoundException extends CustomError {
  constructor(name: string) {
    super(name);
  }
}
