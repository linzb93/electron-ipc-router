import { HTTP_CODE_MAP } from "./constant";
interface IResult {
  code?: number;
  message?: string;
  result: any;
}

export const logger = {
  error(text: string) {
    if (process.env.VITEST) {
      return;
    }
    console.log(text);
  },
};
