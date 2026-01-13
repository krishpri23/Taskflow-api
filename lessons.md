## Middleware

- Adds additional functionality to API
- Preliminary req processing before getting to the controllers
- It accepts req, res, next in the fns

## Auth

- We need 2 packages, `express-rate-limit` and `jsonwebtoken`
- To generate random tokens, in terminal type `node` enter. then enter `require("crypto").randomBytes(64).toString("hex")`
- These token are not changed, they are used for signing the token for verification purpose.
- We are adding limiting middleware in the application to restrict user from logging in after 5 failed attempts
- refreshToken is sent as cookie (security) and accesstoken as json

### log out

- It is important to clear cookie as it might prevent user from logging in again after logout
- Security purpose

### VerifyJWT

- Check if the req has token attached
- If yes, then attach the roles and username to the request which can be accessible for subsequent requests

## challenges

- /notes is not working. cant log backend logs, not available on render also
- throws 500 internal error
- Works fine in local environment though
