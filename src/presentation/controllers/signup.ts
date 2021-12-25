import { Controller } from './../protocols/controller';
import { MissingParamError } from './../protocols/errors/missing-param-error';
import { badRequest } from './../helpers/http-helper';

import { HttpRequest, HttpResponse } from './../protocols/https';


export class SignUpController implements Controller {
    handle(httpRequest: HttpRequest): HttpResponse {
        const requiredFilds = ['name', 'email', 'password', 'passwordConfirmation']

        for (const field of requiredFilds) {
            if (!httpRequest.body[field]) {
                return badRequest(new MissingParamError(field))
            }
        }
    }
}