import { InvalidParamError, MissingParamError } from '../protocols/errors';
import { badRequest, serverError} from './../helpers/http-helper';

import { HttpRequest, HttpResponse, EmailValidator, Controller } from './../protocols';


export class SignUpController implements Controller {
private readonly emailValidator: EmailValidator

    constructor (emailValidator: EmailValidator) {
        this.emailValidator = emailValidator
    }
    handle(httpRequest: HttpRequest): HttpResponse {
       
        try {
            const requiredFilds = ['name', 'email', 'password', 'passwordConfirmation']
            for (const field of requiredFilds) {
                if (!httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field))
                }
            }

            if( httpRequest.body.password !== httpRequest.body.passwordConfirmation){
                return badRequest(new InvalidParamError('passwordConfirmation'))
            }
    
            const isValid = this.emailValidator.isValid(httpRequest.body.email)
            if(!isValid) {
                return badRequest(new InvalidParamError('email'))
            }
            
        } catch (error) {
            return serverError()
        }
      
    }
}