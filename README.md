# AUTHENTICATION MICROSERVICE
A microservice for session based authentication using JSON web tokens and a Neo4j database for session based management.

### Intended usage

This service is intended to be accessed by the API to authenticate RESTless API requests. It is advised that you run this inside
a docker container (or similar) to control access. **Do not run this API publicly**.

To effectively use this microservice, ensure your API does the following:

 * Call 'verify token' before allowing privileged API functionality
 * Check token expiry and 'PATCH' token if expiry date is nearing
 * Invalidate token when user logs out

### User and session tracking

Users and sessions are stored in a Neo4j database. As of present, expired sessions are not automatically deleted from the database.
Sessions have been abstracted from the API for simplicity. Tokens are seen as being either _valid_, _invalid_, _blacklisted_ or
_expired_.

### Configuration
See _private/config.js_ to configure JSON web token and Neo4j settings.


# API FUNCTIONS


## CREATE USER

_Create new user_

#### Url

* `/auth/user`

#### Method

* `POST`

#### Parameters

Required

* `username=[String]`

* `password=[String]`

#### Success responses

* Status: `201`

* Message: `Success`

#### Failure responses

* Status: `400`

* Message: `Username validation failed`

or

* Status: `400`

* Message: `Password validation failed`

or

 * Status: `409`

 * Message: `User already exists`

or

 * Status: `500`

 * Message: `Unknown server error`

---

## CREATE TOKEN
_Create and return token_

#### Url

* `/auth`

#### Method

* `POST`

#### Parameters
Required

* `username=[String]`

* `password=[String]`

#### Success Response

* Status: `200`

* Message: `Success`

#### Failure responses

* Status: `403`

* Message: `Bad credentials`

or

 * Status: `500`

 * Message: `Unknown server error`

---

## VERIFY TOKEN
_Verify token is valid_

#### Url

* `/auth`

#### Method

* `GET`

#### Parameters
Required

* `token=[String]`

#### Success Response

* Status: `200`

* Valid: `1`

or

* Status: `200`

* Valid: `0`

#### Failure responses

* Status: `400`

* Message: `Token must be provided`

or

* Status: `400`

* Message: `Token is invalid`

or

* Status: `401`

* Message: `Token is expired`

or

* Status: `403`

* Message: `Token is blacklisted`

or

* Status: `500`

* Message: `Unknown server error`

---

## UPDATE TOKEN
_Create new token from existing valid token_

#### Url

* `/auth`

#### Method

* `PATCH`

#### Parameters
Required

* `token=[String]`

#### Success Response

* Status: `200`

* Token: `[token string]`

#### Failure responses

* Status: `400`

* Message: `Token must be provided`

or

* Status: `400`

* Message: `Token is invalid`

or

* Status: `401`

* Message: `Token is expired`

or

* Status: `403`

* Message: `Token is blacklisted`

or

* Status: `500`

* Message: `Unknown server error`

---

## INVALIDATE TOKEN
_Blacklist token_

#### Url

* `/auth`

#### Method

* `DELETE`

#### Parameters
Required

* `token=[String]`

#### Success Response

* Status: `200`

* Message: `Success`

#### Failure responses

* Status: `400`

* Message: `Token must be provided`

or

* Status: `400`

* Message: `Token is invalid`

or

* Status: `401`

* Message: `Token is expired`

or

* Status: `403`

* Message: `Token is blacklisted`

or


* Status: `500`

* Message: `Unknown server error`
