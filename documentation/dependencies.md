# Dependencies

## Production

- dotenv - Environment variables injected from .env file
- Express - Routing and HTTP request handling
- bcrypt - Password hashing
- pg - PostgreSQL database interface

## Development

- Jest - JavaScript testing

## Setup

### From Repo

When package.json, package-lock.json, and jest.config.js are present (as they should be), backend setup is straightforward.

From the backend root:

```
npm install
```

Then, use .env.example as a guide to set environment variables in .env.

### From Scratch

If package.json, package-lock.json, and jest.config.js are missing, they can be recreated.

From the backend root:

```
npm init -y
npm install dotenv
npm install express
npm install bcrypt
npm install pg
npm install --save-dev jest
```

In package.json:

```
"type": "module"
```

```
"scripts": {
    "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js"
}
```

Manually create jest.config.js in the backend root:

```
export default {
    testEnvironment: "node",
    setupFiles: ["dotenv/config"],
    "verbose": true
};
```

Then, use .env.example as a guide to set environment variables in .env.

---

[Back to README](../README.md)
