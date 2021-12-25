import { SignUpController } from './signup';

describe('SignUp Contoller', () => {
    test('Should return 400 if no name is provided', () => {
        const sut = new SignUpController()
        const httpRequest = {
            body: {
            email: 'moi_teste@teste.com',
            password: '1234',
            passwordConfirmation: '1234'
        }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing param: name'))
    
    })
    
})