import { AddAccountRepository } from './../../protocols/add-account-repository';
import { Encrypter, AccountModel, AddAccountModel } from './db-add-account-protocol';
import { DbAddAccount } from './db-add-account';

const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter{
        async encrypt (value: string): Promise <string> {
            return new Promise(resolve => resolve('hashed_password'))
        }
    }

    return new EncrypterStub
}

const makeAddAccountRepository = (): AddAccountRepository => {
    class addAccountRepositoryStub implements AddAccountRepository{
        async add (accountData: AddAccountModel): Promise <AccountModel> {
            const fakeAccount = {
                id: 'valid-id',
                name: 'valid_name',
                email: 'valid_email',
                password: 'hashed_password'
            }
            return new Promise(resolve => resolve(fakeAccount))
        }
    }

    return new addAccountRepositoryStub()
}


interface SutTypes {
    sut: DbAddAccount,
    encrypterStub: Encrypter,
    addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
    const addAccountRepositoryStub = makeAddAccountRepository()
    const encrypterStub = makeEncrypter()
    const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)

    return {
        sut,
        encrypterStub,
        addAccountRepositoryStub
    }
}

describe('DbAddAccount Usecase', () => {
    test('Shold call Encrypter with correct password', async() => {
        const {sut, encrypterStub} = makeSut()
        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
        const accountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password'
        }
        await sut.add(accountData)
        expect(encryptSpy).toHaveBeenCalledWith('valid_password')
    })

    test('Shold throw if Encrypter throw', async() => {
        const {sut, encrypterStub} = makeSut()
        jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject)=> reject(new Error())))
        const accountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password'
        }
        const promise = sut.add(accountData)
        expect(promise).rejects.toThrow()
    })

    test('Shold call AddAccountRepository with correct values', async() => {
        const {sut, addAccountRepositoryStub} = makeSut()
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
        const accountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password'
        }
        await sut.add(accountData)
        expect(addSpy).toHaveBeenCalledWith({
            name: 'valid_name',
            email: 'valid_email',
            password: 'hashed_password'
        })
    })
})