import { ServerParamError } from "../errors/server-param-error";
import { HttpResponse } from "./../protocols/https";

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
});

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerParamError(),
});
