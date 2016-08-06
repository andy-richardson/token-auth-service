# AUTHENTICATION MICROSERVICE
A microservice for session based authentication using JSON web tokens and a Neo4j database for session based management.

### Intended usage

This service is intended to be accessed by the API to authenticate RESTless API requests. It is advised that you run this inside 
a docker container (or similar) to control access. **Do not run this API publicly**.

### User and session tracking

Users and sessions are stored in a Neo4j database. As of present, expired sessions are not automatically deleted from the database.
Sessions have been abstracted from the API for simplicity. Tokens are seen as being either _valid_, _invalid_, _blacklisted_ or 
_expired_.

### Effective use

To effectively use this microservice, ensure your API does the following:

 * Validate token before allowing privileged API functionality
 * Check token expiry and 'PATCH' token if expiry date is nearing
 * Invalidate token when user logs out

# API FUNCTIONS


## CREATE USER

_Create new user_

#### Url

* `/auth/user`

#### Method

* `GET`

#### Parameters

Required

* `username=[String]`

* `password=[String]`

#### Success response

* Code: `201`

* Content:
  * `status=[String]`

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

* Code: `200`
* Content:
 * `token=[String]`

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

* Code: `200`
* Content:
 * `status=[Boolean]`

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

* Code: `200`
* Content:
  * `token=[String]`

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

* Code: `200`
* Content:
  * `status=[String]`
