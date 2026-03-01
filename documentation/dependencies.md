# Dependencies

## Production

- dotenv - Environment variables accessible in code
- Express - Routing and HTTP request handling
- bcrypt - Password hashing
- pg - PostgreSQL database interface

## Development

- cross-env - Command line environment variables across OS platforms
- Jest - JavaScript testing

## Setup

### From Repo

When package.json, package-lock.json, and jest.config.json are present (as they should be), backend setup is straightforward.

From the backend root:

```
npm install
```

Then, use .env.example and env_example.ps1 as guides to set environment variables in .env and .env.ps1, respectively.

### From Scratch

If package.json, package-lock.json, and jest.config.json are missing, they can be recreated.

From the backend root:

```
npm init -y
npm install dotenv
npm install express
npm install bcrypt
npm install pg
npm install --save-dev cross-env
npm install --save-dev jest
```

In package.json:

```
"type": "module"
```

```
"scripts": {
    "test": "cross-env NODE_ENV=test node --experimental-vm-modules node_modules/jest/bin/jest.js"
}
```

Manually create jest.config.json in the backend root:

```
{
    "verbose": true,
    "globalSetup": "./setup.js"
}
```

Then, use .env.example and env_example.ps1 as guides to set environment variables in .env and .env.ps1, respectively.

---

[Back to README](../README.md)
