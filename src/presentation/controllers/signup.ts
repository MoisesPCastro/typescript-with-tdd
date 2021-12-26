import { InvalidParamError } from './../protocols/errors/invalid-param-error';
import { EmailValidator } from './../protocols/email-validator';
import { Controller } from './../protocols/controller';
import { MissingParamError } from './../protocols/errors/missing-param-error';
import { badRequest } from './../helpers/http-helper';

import { HttpRequest, HttpResponse } from './../protocols/https';


export class SignUpController implements Controller {
private readonly emailValidator: EmailValidator

    constructor (emailValidator: EmailValidator) {
        this.emailValidator = emailValidator
    }
    handle(httpRequest: HttpRequest): HttpResponse {
        const requiredFilds = ['name', 'email', 'password', 'passwordConfirmation']

        for (const field of requiredFilds) {
            if (!httpRequest.body[field]) {
                return badRequest(new MissingParamError(field))
            }
        }

        const isValid = this.emailValidator.isValid(httpRequest.body.email)
        if(!isValid) {
            return badRequest(new InvalidParamError('email'))
        }
    }
}