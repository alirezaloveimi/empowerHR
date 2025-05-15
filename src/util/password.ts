import { compareSync, hashSync } from "bcryptjs";

export function hashPassword(password: string, salt = 10) {
  const hashed = hashSync(password, salt);
  return hashed;
}

export function verifyPassword(password: string, hashed: string) {
  const isMatchedPassword = compareSync(password, hashed);
  return isMatchedPassword;
}
