"use strict";

import crypt from "../crypt.js";
import pool from "../db/pool.js";
import userModel from "../db/models/user-model.js";
import { testing } from "./authentication-controller.js";

beforeEach(async () => {
    await pool.query("BEGIN;");
});

afterEach(async () => {
    await pool.query("ROLLBACK;");
});

afterAll(async () => {
    await pool.end();
});

// Success
test("authenticateCredentials: Statement Coverage 1", async () => {
    const id = "authCredUser1";
    const password = "12345678901234567890";
    const hash = await crypt.generateHash(password);
    const name = "Authenticate Credentials Test User";
    const email = "authcreduser1@example.com";
    const user = { id: id, hash: hash, name: name, email: email };
    await userModel.createUser(user);
    const credentialsValid = await testing.authenticateCredentials(id, password);

    expect(credentialsValid).toBe(true);
});

// Failure
test("authenticateCredentials: Statement Coverage 2", async () => {
    const id = "authCredUser1";
    const password = "12345678901234567890";
    await userModel.deleteUser(id);
    const credentialsValid = await testing.authenticateCredentials(id, password);

    expect(credentialsValid).toBe(false);
});

// Success
test("getSessionId: Statement Coverage 1", async () => {
    const id = "getSessionIdTestUser";
    const password = "12345678901234567890";
    const hash = await crypt.generateHash(password);
    const name = "Get Session ID Test User";
    const email = "getsessionidtestuser@example.com";
    const user = { id: id, hash: hash, name: name, email: email };
    await userModel.createUser(user);
    const result = await testing.getSessionId(id);

    expect(result.ok).toBe(true);
    expect(typeof result.value).toBe("string");
});

// Invalid userId - Should not occur in logIn, which validates first.
test("getSessionId: Statement Coverage 2", async () => {
    const id = 5
    const result = await testing.getSessionId(id);

    expect(result.ok).toBe(false);
});

// Success
test("logIn: Statement Coverage 1", async () => {
    const id = "logInTestUser";
    const password = "12345678901234567890";
    const hash = await crypt.generateHash(password);
    const name = "Log In Test User";
    const email = "logintestuser@example.com";
    const user = { id: id, hash: hash, name: name, email: email };
    await userModel.createUser(user);
    const result = await testing.logIn(id, password);

    expect(result.ok).toBe(true);
    expect(typeof result.value).toBe("string");
});

// Invalid credentials
test("logIn: Statement Coverage 1", async () => {
    const id = 5;
    const password = "12345678901234567890";
    const result = await testing.logIn(id, password);

    expect(result.ok).toBe(false);
    expect(result.message).toBe("Unable to log in.");
});

/*
// Delete sessions failure
test("logIn: Statement Coverage 1", async () => {
});

// Get session ID failure
test("logIn: Statement Coverage 1", async () => {
});
*/
