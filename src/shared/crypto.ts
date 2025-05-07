import {
  SHA3,
} from "sha3"
// import crypto from 'crypto';
// import generator from 'generate-password';
// const ENC_KEY = 'bf3c199c2470cb477d907b1e0917c17b';
// const IV = '5183666c72eec9e4';

export const cryptoSHA3 = async (inpVal: string) => {
  const hash = new SHA3(512)
  hash.update(inpVal)
  const encrypted = hash.digest("hex")
  return encrypted
}
