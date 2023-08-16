import { expect } from "chai";
import sinon from "sinon";
import isValid from "..email-validator.js";

import {
  validateAsync,
  validateWithThrow,
  validateWithLog,
} from "../validate-email.js";
describe("first test", () => {
  it("should return 2", () => {
    expect(2).to.equal(2);
  });
});
describe("isValid", () => {
  it("should return true for valid email endings", () => {
    expect(isValid("example@gmail.com")).to.be.true;
    expect(isValid("user@outlook.com")).to.be.true;
    expect(isValid("test@yandex.ru")).to.be.true;
  });

  it("should return false for invalid email endings", () => {
    expect(isValid("invalid@yahoo.com")).to.be.false;
    expect(isValid("test@invalid.com")).to.be.false;
    expect(isValid("example@invalid.net")).to.be.false;
  });

  // it("should be case-insensitive", () => {
  //   expect(isValid("example@GMAIL.COM")).to.be.true;
  //   expect(isValid("user@Outlook.com")).to.be.true;
  // });
});

describe("validateAsync function", function () {
  it("should return true for valid email", async function () {
    const isValid = await validateAsync("test@gmail.com");
    expect(isValid).to.be.true;
  });

  it("should return false for invalid email", async function () {
    const isValid = await validateAsync("invalid");
    expect(isValid).to.be.false;
  });

  it("should return true for valid email ending asynchronously", async function () {
    const isValid = await validateAsync("test@outlook.com");
    expect(isValid).to.be.true;
  });

  it("should return false for invalid email ending asynchronously", async function () {
    const isValid = await validateAsync("test@invalid.com");
    expect(isValid).to.be.false;
  });
});

describe("validateWithThrow function", function () {
  it("should throw an error for invalid email", function () {
    const invalidEmail = "invalid";
    expect(() => validateWithThrow(invalidEmail)).to.throw(
      Error,
      /Invalid email: .+/
    );
  });

  it("should not throw an error for valid email", function () {
    const validEmail = "test@gmail.com";
    expect(() => validateWithThrow(validEmail)).to.not.throw();
  });

  it("should not throw an error for valid email ending", function () {
    const validEmail = "test@outlook.com";
    expect(() => validateWithThrow(validEmail)).to.not.throw();
  });

  it("should throw an error for invalid email ending", function () {
    const invalidEmail = "test@invalid.com";
    expect(() => validateWithThrow(invalidEmail)).to.throw(
      Error,
      /Invalid email: .+/
    );
  });
});

describe("validateWithLog function", function () {
  let consoleLogStub;

  beforeEach(function () {
    consoleLogStub = sinon.stub(console, "log");
  });

  afterEach(function () {
    consoleLogStub.restore();
  });

  it("should log the correct message for valid email", function () {
    const email = "test@gmail.com";

    const isValid = validateWithLog(email);

    expect(isValid).to.be.true;
    expect(consoleLogStub.calledWith(`Email "${email}" is valid`)).to.be.true;
  });

  it("should log the correct message for invalid email", function () {
    const email = "invalid";

    const isValid = validateWithLog(email);

    expect(isValid).to.be.false;
    expect(consoleLogStub.calledWith(`Email "${email}" is invalid`)).to.be.true;
  });

  it("should log the correct message for another valid email", function () {
    const email = "user@outlook.com";

    const isValid = validateWithLog(email);

    expect(isValid).to.be.true;
    expect(consoleLogStub.calledWith(`Email "${email}" is valid`)).to.be.true;
  });

  it("should log the correct message for another invalid email", function () {
    const email = "invalid@example.net";

    const isValid = validateWithLog(email);

    expect(isValid).to.be.false;
    expect(consoleLogStub.calledWith(`Email "${email}" is invalid`)).to.be.true;
  });
});
