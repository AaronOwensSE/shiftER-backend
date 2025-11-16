"use strict";

import testing from "./validation.js";

// Valid
test("isValidUserId: Condition Coverage 1", () => {
    const userId = "User1";
    const idValid = testing.isValidUserId(userId);

    expect(idValid).toBe(true);
});

// Not a string, length undefined
test("isValidUserId: Condition Coverage 2", () => {
    const userId = 5;
    const idValid = testing.isValidUserId(userId);

    expect(idValid).toBe(false);
});

// Valid
test("isValidUserPassword: Condition Coverage 1", () => {
    const password = "123456789012345";
    const passwordValid = testing.isValidUserPassword(password);

    expect(passwordValid).toBe(true);
});

// Not a string, length undefined
test("isValidUserPassword: Condition Coverage 2", () => {
    const password = 5;
    const passwordValid = testing.isValidUserPassword(password);

    expect(passwordValid).toBe(false);
});

// Valid
test("isValidUserName: Condition Coverage 1", () => {
    const userName = "User Name";
    const userNameValid = testing.isValidUserName(userName);

    expect(userNameValid).toBe(true);
});

// Not a string, length undefined
test("isValidUserName: Condition Coverage 2", () => {
    const userName = 5;
    const userNameValid = testing.isValidUserName(userName);

    expect(userNameValid).toBe(false);
});

// Valid
test("isValidUserEmail: Condition Coverage 1", () => {
    const userEmail = "user1@example.com";
    const userEmailValid = testing.isValidUserEmail(userEmail);

    expect(userEmailValid).toBe(true);
});

// Not a string, length undefined
test("isValidUserEmail: Condition Coverage 2", () => {
    const userEmail = 5;
    const userEmailValid = testing.isValidUserEmail(userEmail);

    expect(userEmailValid).toBe(false);
});

// Valid
test("isValidUser: Condition Coverage 1", () => {
    const userId = "user1";
    const userPassword = "12345678901234567890";
    const userName = "User One";
    const userEmail = "user1@example.com";
    const userValid = testing.isValidUser(userId, userPassword, userName, userEmail);

    expect(userValid).toBe(true);
});

// Not strings
test("isValidUser: Condition Coverage 2", () => {
    const userId = 1;
    const userPassword = 2;
    const userName = 3;
    const userEmail = 4;
    const userValid = testing.isValidUser(userId, userPassword, userName, userEmail);

    expect(userValid).toBe(false);
});
