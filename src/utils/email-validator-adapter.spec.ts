import { EmailValidatorAdapter } from "./email-validator"
import validator from 'validator'

jest.mock('validator', () => ({
    isEmail (): boolean {
        return true
    }
}))

const makeSut = (): EmailValidatorAdapter => {
    return new EmailValidatorAdapter()
}


describe('EmailValidator Adapter', () => {
    test('Shold return false if validator returns false', () => {
        const sut = makeSut()
        jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
        const isValid = sut.isValid('invalid-email@mail.com')
        expect(isValid).toBe(false)
    })

    test('Shold return true if validator returns true', () => {
        const sut = makeSut()
        const isValid = sut.isValid('valid-email@mail.com')
        expect(isValid).toBe(true)
    })

    test('Shold call validator with correct email', () => {
        const sut = makeSut()
        const isEmailSpy = jest.spyOn(validator, 'isEmail')
        sut.isValid('any_email@mail.com')
        expect(isEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
    })
})