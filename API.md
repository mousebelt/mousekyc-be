# KYC Backend APIS
KYC backend apis : admin, user

## Summary
### Admin apis
[admin signup](#signup)  
[admin login](#login)  
[admin approve user](#approve_user)  
### User
[get info from token](#getinfotoken)  
[Update user from token, email](#updateuser)  

***

## Admin apis

<a name="signup"/>

- signup
```
/**
 * @function: Admin user signup
 * 
 * @method: POST /signup
 * 
 * @param {String|Required} email
 * @param {String|Required} password
 * 
 * @return
 * { "status": 200, "msg": "success" }
*/
```

<a name="login"/>

- login
```
/**
 * @function: Admin user login
 * 
 * @method: POST /login
 * 
 * @param {String|Required} email
 * @param {String|Required} password
 * 
 * @return
 * { "status": 200, "msg": "success", data: { token } }
*/
```

<a name="approve_user"/>

- approve_user
```
/**
 * @function: Set approval status, approval description of user
 * 
 * @method: POST /approve_user
 * 
 * @param {String|Required} token
 * @param {String|Required} useremail
 * @param {String|Required} approvalStatus
 * @param {String} approvalDescription
 * 
 * @return
 * { "status": 200, "msg": "success", data: userInfo }
*/
```

***

## User apis

<a name="getinfotoken"/>

- getinfo from token
```
/**
 * @function: Get user info from token
 * 
 * @method: GET /info/:token
 * 
 * @param {String|Required} token
 * 
 * @return
 * { "status": 200, "msg": "success", data: userInfo }
 * 
 * userInfo = {
 *  email, token, approvalStatus, approvalDescriptin
 * }
*/
```

<a name="generatetoken"/>

- Generate token for user email
```
/**
 * @function: Generate token for user email
 * 
 * @method: POST /gentoken
 * 
 * @param {String|Required} email
 * 
 * @return
 * { "status": 200, "msg": "success", data: { token, email } }
*/
```

<a name="updateuser"/>

- Update user from token, email
```
/**
 * @function: Update user from token, email
 * 
 * @method: POST /update
 * 
 * @param {String|Required} email
 * @param {String|Required} token
 * @param {String} name
 * @param {String} phone
 * @param {String} dob
 * @param {String} nationalityCountry
 * @param {String} residenceCountry
 * @param {String} residenceAddress
 * @param {String} adminContact
 * @param {String} checkStatus
 * @param {String} adminMessage
 * @param {String} backgroundCheckId
 * 
 * @return
 * { "status": 200, "msg": "success", data: userInfo }
*/
```
