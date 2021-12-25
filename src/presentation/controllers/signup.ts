import { badRequest } from './../helpers/http-helper';
import { MissingParamError } from './../protocols/errors/missing-param-error';
import { HttpRequest, HttpResponse } from './../protocols/https';


export class SignUpController {
    handle(httpRequest: HttpRequest): HttpResponse {
        const requiredFilds = ['name', 'email']

        for (const field of requiredFilds) {
            if (!httpRequest.body[field]) {
                return badRequest(new MissingParamError(field))
            }
        }
    }
}