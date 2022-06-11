import { InvalidParamError, MissingParamError } from "../../errors";
import { ServerParamError } from "../../errors/server-param-error";
import { EmailValidator} from "../../protocols";
import { SignUpController } from "./signup";

interface SutTypes {
  sut: SignUpController;
  emailValidatorSut: EmailValidator;
};

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorSut implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    };
  };
  return new EmailValidatorSut();
};

const makeEmailValidatorError = (): EmailValidator => {
  class EmailValidatorSut implements EmailValidator {
    isValid(email: string): boolean {
      throw new Error();
    };
  };
  return new EmailValidatorSut();
};

const makeSut = (): SutTypes => {

  const emailValidatorSut = makeEmailValidator();
  const sut = new SignUpController(emailValidatorSut);

  return {
    sut,
    emailValidatorSut,
  };
};

describe("SignUp Controller", () => {
  test("Shold return 400 if no name is provide", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
  });

  test("Shold return 400 if no email is provide", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });

  test("Shold return 400 if no password is provide", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        passwordConfirmation: "any_password",
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });

  test("Shold return 400 if no password Confirmation is provide", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError("passwordConfirmation")
    );
  });
  test("Shold return 400 if an invalid email provide", () => {
    const { sut, emailValidatorSut } = makeSut();

    jest.spyOn(emailValidatorSut, "isValid").mockReturnValueOnce(false);
    const httpRequest = {
      body: {
        name: "any_name",
        email: "invalid_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("email"));
  });
  test("Shold call EmailValidator with correct email", () => {
    const { sut, emailValidatorSut } = makeSut();

    const isValidSpy = jest.spyOn(emailValidatorSut, "isValid");
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };

    sut.handle(httpRequest);

    expect(isValidSpy).toHaveBeenCalledWith("any_email@mail.com");
  });
  test("Shold return 500 if EmailValidator thows", () => {

    const emailValidatorSut = makeEmailValidatorError();
    const sut = new SignUpController(emailValidatorSut);
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerParamError());
  });
});
