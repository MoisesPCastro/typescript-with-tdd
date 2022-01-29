import { AccountMongoRepository } from './account';
import { MongoHelper } from './helpes/mongo-helpes';

describe("Account mongo repository", () => {

    beforeAll(async () => {
       await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll( async () => {
       await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        const accountCollection = MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany({})
    })
    
    test("should return an account on success", async ()=> {
        const sut = new AccountMongoRepository()
        const account = await sut.add({
            name: 'any_name',
            email: 'any_email',
            password: 'any_password'
        })
        expect(account).toBeTruthy()
        expect(account.id).toBeTruthy()
        expect(account.name).toBe('any_name')
        expect(account.email).toBe('any_email')
        expect(account.password).toBe('any_password')
    })
})