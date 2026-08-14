import { test, expect, APIResponse } from '@playwright/test';
import { Data_Dictionary } from '../Test_data/Page Object Definition';
import * as fs from 'fs';
import * as path from 'path';


interface DataEntry {
  name: string;
  description: string;
  // Add other expected fields here if necessary
}

test.beforeAll(async () => {
  // Runs once before all tests in this file/block per worker
    
    const filePath = path.resolve(__dirname, "../Test_data/UsersList.json")
  // To completely clear the file content:
    await fs.writeFileSync(filePath, JSON.stringify([]));

    const jsonData = [{'id':1, 'email':'admin@juice-sh.op', 'password': 'admin123', 'uniqueAnswer':''}]

    await fs.writeFileSync(filePath, JSON.stringify(jsonData,null,2),'utf-8')

});

//USER REGISTRATION/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

test('Register a new user', async ({ page, request}) => {
    const driver= new Data_Dictionary(page, request);

    const Logup_response = await driver.API_Register_a_new_user()

    expect.soft(( Logup_response).status()).toEqual(201)

    const json = await Logup_response.json()
    console.log(json)

    expect.soft(json).toHaveProperty("status","success")
    expect.soft(json).toHaveProperty('data.role','customer')
    expect.soft(json).toHaveProperty('data.email')
    expect.soft(json.data.email).toBeTruthy();

});

test('Attempt to add a new user: Email is NULL', async ({ page, request}) => {
    
    const driver= new Data_Dictionary(page, request);
    const email = driver.generateRandomUser();//USES CUSTOM FUNCTION TO GENERATE A RANDOM EMAIL
    const password = email.substring(4,12);//USERXYZ12345@TEST.NET => XYZ12345
    const unique_answer = password;
    
    const response = await driver.API_Attempt_Register_a_new_user("",password,password,"Mother's maiden name?",unique_answer)
    expect.soft(response.status()).toEqual(400)

    
    const login_response = await driver.request.post('http://localhost:3000/rest/user/login',

    {
    headers:{
      "Accept":"application/json, text/plain, */*",
      "Accept-Encoding":"gzip, deflate, br, zstd",
      "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
      "Content-Type": "application/json",
      "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
      "Origin":"http://localhost:3000",
      "Priority":"u=0",
      "Referer":"http://localhost:3000/"
    },

    data:{
        "email": "",
        "password": password,
    }
    })

    expect.soft(login_response.status()).toEqual(401)

});

test('Attempt to add a new user: Email does not have domain value', async ({ page, request}) => {
    
    const driver= new Data_Dictionary(page, request);
    const email = driver.generateRandomUser();//USES CUSTOM FUNCTION TO GENERATE A RANDOM EMAIL
    const password = email.substring(4,12);//USERXYZ12345@TEST.NET => XYZ12345
    const unique_answer = password;
    
    const response = await driver.API_Attempt_Register_a_new_user(email.substring(4,9),password,password,"Mother's maiden name?",unique_answer)
    expect.soft(response.status()).toEqual(422)//Unprocessable Entity response

    
    const login_response = await driver.request.post('http://localhost:3000/rest/user/login',

    {
    headers:{
      "Accept":"application/json, text/plain, */*",
      "Accept-Encoding":"gzip, deflate, br, zstd",
      "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
      "Content-Type": "application/json",
      "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
      "Origin":"http://localhost:3000",
      "Priority":"u=0",
      "Referer":"http://localhost:3000/"
    },

    data:{
        "email": email.substring(4,9),
        "password": password,
    }
    })

    expect.soft(login_response.status()).toEqual(401)

});

test('Attempt to add a new user: Email has an incomplete domain value', async ({ page, request}) => {
    
    const driver= new Data_Dictionary(page, request);
    const email = driver.generateRandomUser();//USES CUSTOM FUNCTION TO GENERATE A RANDOM EMAIL
    const password = email.substring(4,12);//USERXYZ12345@TEST.NET => XYZ12345
    const unique_answer = password;
    
    const response = await driver.API_Attempt_Register_a_new_user(email.substring(4,email.indexOf(".")),password,password,"Mother's maiden name?",unique_answer)
    expect.soft(response.status()).toEqual(422)//Unprocessable Entity response

    
    const login_response = await driver.request.post('http://localhost:3000/rest/user/login',

    {
    headers:{
      "Accept":"application/json, text/plain, */*",
      "Accept-Encoding":"gzip, deflate, br, zstd",
      "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
      "Content-Type": "application/json",
      "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
      "Origin":"http://localhost:3000",
      "Priority":"u=0",
      "Referer":"http://localhost:3000/"
    },

    data:{
        "email": email.substring(4,email.indexOf(".")),
        "password": password,
    }
    })

    expect.soft(login_response.status()).toEqual(401)

});

test('Attempt to add a new user: Password is NULL', async ({ page, request}) => {
    
    const driver= new Data_Dictionary(page, request);
    const email = driver.generateRandomUser();//USES CUSTOM FUNCTION TO GENERATE A RANDOM EMAIL
    const password = ""
    const unique_answer = password;
    
    const response = await driver.API_Attempt_Register_a_new_user(email,password,password,"Mother's maiden name?",unique_answer)
    expect.soft(response.status()).toEqual(400)

    
    const login_response = await driver.request.post('http://localhost:3000/rest/user/login',

    {
    headers:{
      "Accept":"application/json, text/plain, */*",
      "Accept-Encoding":"gzip, deflate, br, zstd",
      "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
      "Content-Type": "application/json",
      "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
      "Origin":"http://localhost:3000",
      "Priority":"u=0",
      "Referer":"http://localhost:3000/"
    },

    data:{
        "email": email,
        "password": password,
    }
    })

    expect.soft(login_response.status()).toEqual(401)

});

test('Attempt to add a new user: Password is TOO SHORT, has a maximum of 7 characters', async ({ page, request}) => {
    
    const driver= new Data_Dictionary(page, request);
    const email = driver.generateRandomUser();//USES CUSTOM FUNCTION TO GENERATE A RANDOM EMAIL
    const password = email.substring(4,11);//USERXYZ12345@TEST.NET => XYZ1234
    const unique_answer = password;
    
    const response = await driver.API_Attempt_Register_a_new_user(email,password,password,"Mother's maiden name?",unique_answer)
    expect.soft(response.status()).toEqual(422)//Unprocessable Entity response

    
    const login_response = await driver.request.post('http://localhost:3000/rest/user/login',

    {
    headers:{
      "Accept":"application/json, text/plain, */*",
      "Accept-Encoding":"gzip, deflate, br, zstd",
      "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
      "Content-Type": "application/json",
      "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
      "Origin":"http://localhost:3000",
      "Priority":"u=0",
      "Referer":"http://localhost:3000/"
    },

    data:{
        "email": email,
        "password": password,
    }
    })

    expect.soft(login_response.status()).toEqual(401)

});

test('Attempt to add a new user: Password is TOO LONG, has a minimum of 41 characters', async ({ page, request}) => {
    
    const driver= new Data_Dictionary(page, request);
    const email = driver.generateRandomUser();//USES CUSTOM FUNCTION TO GENERATE A RANDOM EMAIL
    const password = email.substring(4,11)+"CONCATENATESTRINGconcatenatestring"//Substring of 7 chars + any string of 34 chars = 41 chars. More than ALLOWED (40)
    const unique_answer = password;
    
    const response = await driver.API_Attempt_Register_a_new_user(email,password,password,"Mother's maiden name?",unique_answer)
    expect.soft(response.status()).toEqual(422)//Unprocessable Entity response

    
    const login_response = await driver.request.post('http://localhost:3000/rest/user/login',

    {
    headers:{
      "Accept":"application/json, text/plain, */*",
      "Accept-Encoding":"gzip, deflate, br, zstd",
      "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
      "Content-Type": "application/json",
      "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
      "Origin":"http://localhost:3000",
      "Priority":"u=0",
      "Referer":"http://localhost:3000/"
    },

    data:{
        "email": email,
        "password": password,
    }
    })

    expect.soft(login_response.status()).toEqual(401)

});

test('Attempt to add a new user: Repeat Password value is NULL', async ({ page, request}) => {
    
    const driver= new Data_Dictionary(page, request);
    const email = driver.generateRandomUser();//USES CUSTOM FUNCTION TO GENERATE A RANDOM EMAIL
    const password = email.substring(4,12)
    const unique_answer = password;
    
    const response = await driver.API_Attempt_Register_a_new_user(email,password,"","Mother's maiden name?",unique_answer)
    expect.soft(response.status()).toEqual(400)

    
    const login_response = await driver.request.post('http://localhost:3000/rest/user/login',

    {
    headers:{
      "Accept":"application/json, text/plain, */*",
      "Accept-Encoding":"gzip, deflate, br, zstd",
      "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
      "Content-Type": "application/json",
      "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
      "Origin":"http://localhost:3000",
      "Priority":"u=0",
      "Referer":"http://localhost:3000/"
    },

    data:{
        "email": email,
        "password": password
    }
    })

    expect.soft(login_response.status()).toEqual(401)

});

test('Attempt to add a new user: Repeat Password value is slightly different than Password value (one missing letter)', async ({ page, request}) => {
    
    const driver= new Data_Dictionary(page, request);
    const email = driver.generateRandomUser();//USES CUSTOM FUNCTION TO GENERATE A RANDOM EMAIL
    const password = email.substring(4,12)
    const unique_answer = password;
    
    const response = await driver.API_Attempt_Register_a_new_user(email,password,password.substring(0,7),"Mother's maiden name?",unique_answer)//Remove one char from Password value as RepeatPassword
    expect.soft(response.status()).toEqual(400)//Passwords Mismatch

    
    const login_response = await driver.request.post('http://localhost:3000/rest/user/login',

    {
    headers:{
      "Accept":"application/json, text/plain, */*",
      "Accept-Encoding":"gzip, deflate, br, zstd",
      "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
      "Content-Type": "application/json",
      "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
      "Origin":"http://localhost:3000",
      "Priority":"u=0",
      "Referer":"http://localhost:3000/"
    },

    data:{
        "email": email,
        "password": password
    }
    })

    expect.soft(login_response.status()).toEqual(401)

});

test('Attempt to add a new user: Repeat Password value is slightly different than Password value (one extra letter)', async ({ page, request}) => {
    
    const driver= new Data_Dictionary(page, request);
    const email = driver.generateRandomUser();//USES CUSTOM FUNCTION TO GENERATE A RANDOM EMAIL
    const password = email.substring(4,12)
    const unique_answer = password;
    
    const response = await driver.API_Attempt_Register_a_new_user(email,password,password+" ","Mother's maiden name?",unique_answer)//Remove one char from Password value as RepeatPassword
    expect.soft(response.status()).toEqual(400)//Passwords Mismatch

    
    const login_response = await driver.request.post('http://localhost:3000/rest/user/login',

    {
    headers:{
      "Accept":"application/json, text/plain, */*",
      "Accept-Encoding":"gzip, deflate, br, zstd",
      "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
      "Content-Type": "application/json",
      "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
      "Origin":"http://localhost:3000",
      "Priority":"u=0",
      "Referer":"http://localhost:3000/"
    },

    data:{
        "email": email,
        "password": password
    }
    })

    expect.soft(login_response.status()).toEqual(401)

});

test('Attempt to add a new user: Secret Question value is NULL)', async ({ page, request}) => {
    
    const driver= new Data_Dictionary(page, request);
    const email = driver.generateRandomUser();//USES CUSTOM FUNCTION TO GENERATE A RANDOM EMAIL
    const password = email.substring(4,12)
    const unique_answer = password;
    
    const response = await driver.API_Attempt_Register_a_new_user(email,password,password,"",unique_answer)//Clear secret question value to submit
    expect.soft(response.status()).toEqual(400)
    
    const login_response = await driver.request.post('http://localhost:3000/rest/user/login',

    {
    headers:{
      "Accept":"application/json, text/plain, */*",
      "Accept-Encoding":"gzip, deflate, br, zstd",
      "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
      "Content-Type": "application/json",
      "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
      "Origin":"http://localhost:3000",
      "Priority":"u=0",
      "Referer":"http://localhost:3000/"
    },

    data:{
        "email": email,
        "password": password
    }
    })

    expect.soft(login_response.status()).toEqual(401)

});

test('Attempt to add a new user: Secret Question value is different than listed UI items)', async ({ page, request}) => {
    
    const driver= new Data_Dictionary(page, request);
    const email = driver.generateRandomUser();//USES CUSTOM FUNCTION TO GENERATE A RANDOM EMAIL
    const password = email.substring(4,12)
    const unique_answer = password;
    
    const response = await driver.API_Attempt_Register_a_new_user(email,password,password,"Fake question (Not listed in UI)",unique_answer)//Clear secret question value to submit
    expect.soft(response.status()).toEqual(400)
    
    const login_response = await driver.request.post('http://localhost:3000/rest/user/login',

    {
    headers:{
      "Accept":"application/json, text/plain, */*",
      "Accept-Encoding":"gzip, deflate, br, zstd",
      "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
      "Content-Type": "application/json",
      "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
      "Origin":"http://localhost:3000",
      "Priority":"u=0",
      "Referer":"http://localhost:3000/"
    },

    data:{
        "email": email,
        "password": password
    }
    })

    expect.soft(login_response.status()).toEqual(401)

});

test('Attempt to add a new user: Secret Question value is UPPERCASED)', async ({ page, request}) => {
    
    const driver= new Data_Dictionary(page, request);
    const email = driver.generateRandomUser();//USES CUSTOM FUNCTION TO GENERATE A RANDOM EMAIL
    const password = email.substring(4,12)
    const unique_answer = password;
    
    const response = await driver.API_Attempt_Register_a_new_user(email,password,password,"Mother's maiden name?".toLocaleUpperCase(),unique_answer)//Uppercase secret question value to submit. Same phrase, different build
    expect.soft(response.status()).toEqual(400)
    
    const login_response = await driver.request.post('http://localhost:3000/rest/user/login',

    {
    headers:{
      "Accept":"application/json, text/plain, */*",
      "Accept-Encoding":"gzip, deflate, br, zstd",
      "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
      "Content-Type": "application/json",
      "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
      "Origin":"http://localhost:3000",
      "Priority":"u=0",
      "Referer":"http://localhost:3000/"
    },

    data:{
        "email": email,
        "password": password
    }
    })

    expect.soft(login_response.status()).toEqual(401)

});

test('Attempt to add a new user: Unique Answer value is NULL)', async ({ page, request}) => {
    
    const driver= new Data_Dictionary(page, request);
    const email = driver.generateRandomUser();//USES CUSTOM FUNCTION TO GENERATE A RANDOM EMAIL
    const password = email.substring(4,12)
    const unique_answer = "";
    
    const response = await driver.API_Attempt_Register_a_new_user(email,password,password,"Mother's maiden name?",unique_answer)//Uppercase secret question value to submit. Same phrase, different build
    expect.soft(response.status()).toEqual(400)
    
    const login_response = await driver.request.post('http://localhost:3000/rest/user/login',

    {
    headers:{
      "Accept":"application/json, text/plain, */*",
      "Accept-Encoding":"gzip, deflate, br, zstd",
      "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
      "Content-Type": "application/json",
      "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
      "Origin":"http://localhost:3000",
      "Priority":"u=0",
      "Referer":"http://localhost:3000/"
    },

    data:{
        "email": email,
        "password": password
    }
    })

    expect.soft(login_response.status()).toEqual(401)

});

test('Attempt to add a new user: Submit request without any headers)', async ({ page, request}) => {
    
    const driver= new Data_Dictionary(page, request);
    const email = driver.generateRandomUser();//USES CUSTOM FUNCTION TO GENERATE A RANDOM EMAIL
    const password = email.substring(4,12)
    const unique_answer = password;
    
    const response = await driver.request.post('http://localhost:3000/api/Users/',
    
    {
      data:{
        "email": email,
        "password": password,
        "passwordRepeat": password,
        "securityAnswer": unique_answer,
        "securityQuestion": {
            "question": "Mother's maiden name?"
        }
      }
    })

    expect.soft(response.status()).toEqual(400)
    
    const login_response = await driver.request.post('http://localhost:3000/rest/user/login',

    {
    headers:{
      "Accept":"application/json, text/plain, */*",
      "Accept-Encoding":"gzip, deflate, br, zstd",
      "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
      "Content-Type": "application/json",
      "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
      "Origin":"http://localhost:3000",
      "Priority":"u=0",
      "Referer":"http://localhost:3000/"
    },

    data:{
        "email": email,
        "password": password
    }
    })

    expect.soft(login_response.status()).toEqual(401)

});

//LOGIN/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

test('Log in', async ({ page, request}) => {
    const driver= new Data_Dictionary(page, request);

    const Login_response = await driver.API_Login()

    expect.soft(Login_response.status()).toEqual(200);

    const json = await Login_response.json()
    console.log(json);

    expect.soft(json).toHaveProperty("authentication.token")
    expect.soft(json.authentication.token).toBeTruthy();
    expect.soft(json).toHaveProperty('authentication.umail')
    expect.soft(json.authentication.umail).toBeTruthy();

});

//Send an API POST request with wrong credentials.
test('Log in with wrong credentials', async ({ page, request}) => {
    const driver= new Data_Dictionary(page, request);

    const user_info = await driver.get_LoginInfo();

    //#1. Send an API POST request to login using empty credentials.
    let response = await driver.request.post('http://localhost:3000/rest/user/login',

    {
        headers:{
        "Accept":"application/json, text/plain, */*",
        "Accept-Encoding":"gzip, deflate, br, zstd",
        "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
        "Content-Type": "application/json",
        "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
        "Origin":"http://localhost:3000",
        "Priority":"u=0",
        "Referer":"http://localhost:3000/"
    },

        data:{
            "email": "",
            "password": ""
        }

    })

    //Print negative response
    await console.log(response)

    //Verify response code status is set to 401 (Unauthorized)
    await expect.soft(response.status()).toEqual(401);

    //#2. Send an API POST request to login using a wrong username/correct password credentials set.
    //A) Add a whitespace character at the beginning of the username string.
    response = await driver.request.post('http://localhost:3000/rest/user/login',

    {
        headers:{
        "Accept":"application/json, text/plain, */*",
        "Accept-Encoding":"gzip, deflate, br, zstd",
        "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
        "Content-Type": "application/json",
        "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
        "Origin":"http://localhost:3000",
        "Priority":"u=0",
        "Referer":"http://localhost:3000/"
    },

        data:{
            "email": " " + user_info[0],
            "password": user_info[1]
        }

    })

    //Print negative response
    await console.log(response)

    //Verify response code status is set to 401 (Unauthorized)
    await expect.soft(response.status()).toEqual(401);

    //B) Add a whitespace character at the end of the username string.
    response = await driver.request.post('http://localhost:3000/rest/user/login',

    {
        headers:{
        "Accept":"application/json, text/plain, */*",
        "Accept-Encoding":"gzip, deflate, br, zstd",
        "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
        "Content-Type": "application/json",
        "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
        "Origin":"http://localhost:3000",
        "Priority":"u=0",
        "Referer":"http://localhost:3000/"
    },

        data:{
            "email": user_info[0] + " ",
            "password": user_info[1]
        }

    })

    //Print negative response
    await console.log(response)

    //Verify response code status is set to 401 (Unauthorized)
    await expect.soft(response.status()).toEqual(401);

    //C) Uppercase username string
    response = await driver.request.post('http://localhost:3000/rest/user/login',

    {
        headers:{
        "Accept":"application/json, text/plain, */*",
        "Accept-Encoding":"gzip, deflate, br, zstd",
        "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
        "Content-Type": "application/json",
        "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
        "Origin":"http://localhost:3000",
        "Priority":"u=0",
        "Referer":"http://localhost:3000/"
    },

        data:{
            "email": user_info[0].toLocaleUpperCase(),
            "password": user_info[1]
        }

    })

    //Print negative response
    await console.log(response)

    //Verify response code status is set to 401 (Unauthorized)
    await expect.soft(response.status()).toEqual(401);

    //#3. Send an API POST request to login using a correct username/wrong password credentials set.
    //A) Add a whitespace character at the beginning of the password string.
    response = await driver.request.post('http://localhost:3000/rest/user/login',

    {
        headers:{
        "Accept":"application/json, text/plain, */*",
        "Accept-Encoding":"gzip, deflate, br, zstd",
        "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
        "Content-Type": "application/json",
        "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
        "Origin":"http://localhost:3000",
        "Priority":"u=0",
        "Referer":"http://localhost:3000/"
    },

        data:{
            "email": user_info[0],
            "password": " " + user_info[1]
        }

    })

    //Print negative response
    await console.log(response)

    //Verify response code status is set to 401 (Unauthorized)
    await expect.soft(response.status()).toEqual(401);

    //B) Add a whitespace character at the end of the password string.
    response = await driver.request.post('http://localhost:3000/rest/user/login',

    {
        headers:{
        "Accept":"application/json, text/plain, */*",
        "Accept-Encoding":"gzip, deflate, br, zstd",
        "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
        "Content-Type": "application/json",
        "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
        "Origin":"http://localhost:3000",
        "Priority":"u=0",
        "Referer":"http://localhost:3000/"
    },

        data:{
            "email": user_info[0],
            "password": user_info[1] + " "
        }

    })

    //Print negative response
    await console.log(response)

    //Verify response code status is set to 401 (Unauthorized)
    await expect.soft(response.status()).toEqual(401);

    //C) Uppercase password string
    response = await driver.request.post('http://localhost:3000/rest/user/login',

    {
        headers:{
        "Accept":"application/json, text/plain, */*",
        "Accept-Encoding":"gzip, deflate, br, zstd",
        "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
        "Content-Type": "application/json",
        "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
        "Origin":"http://localhost:3000",
        "Priority":"u=0",
        "Referer":"http://localhost:3000/"
    },

        data:{
            "email": user_info[0],
            "password": user_info[1].toLocaleUpperCase()
        }

    })

    //Print negative response
    await console.log(response)

    //Verify response code status is set to 401 (Unauthorized)
    await expect.soft(response.status()).toEqual(401);

});

test("Log in attempting to use SQL injection (Line comments ''--')", async ({ page, request}) => {
    const driver= new Data_Dictionary(page, request);

    const user_info = await driver.get_LoginInfo();

    //#1. Send an API POST request to login using empty credentials.
    let response = await driver.request.post('http://localhost:3000/rest/user/login',

    {
        headers:{
        "Accept":"application/json, text/plain, */*",
        "Accept-Encoding":"gzip, deflate, br, zstd",
        "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
        "Content-Type": "application/json",
        "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
        "Origin":"http://localhost:3000",
        "Priority":"u=0",
        "Referer":"http://localhost:3000/"
    },

        data:{
            "email": user_info[0]+"'--",
            "password": "A"
        }

    })

    //Print negative response
    await console.log(response)

    //Verify response code status is set to 401 (Unauthorized)
    await expect.soft(response.status()).toEqual(401);

    if (response.status()!=401)
        console.log("CRITICAL SECURITY BREACH: SQL Injection method breached login security mechanism. An immediate fix is REQUIRED and URGENT.")

});

test("Log in attempting to use SQL injection (Line comments: USERNAME+''#')", async ({ page, request}) => {
    const driver= new Data_Dictionary(page, request);

    const user_info = await driver.get_LoginInfo();

    //#1. Send an API POST request to login using empty credentials.
    let response = await driver.request.post('http://localhost:3000/rest/user/login',

    {
        headers:{
        "Accept":"application/json, text/plain, */*",
        "Accept-Encoding":"gzip, deflate, br, zstd",
        "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
        "Content-Type": "application/json",
        "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
        "Origin":"http://localhost:3000",
        "Priority":"u=0",
        "Referer":"http://localhost:3000/"
    },

        data:{
            "email": user_info[0]+"'#",
            "password": "A"
        }

    })

    //Print negative response
    await console.log(response)

    //Verify response code status is set to 401 (Unauthorized)
    await expect.soft(response.status()).toEqual(401);

    if (response.status()!=401)
        console.log("CRITICAL SECURITY BREACH: SQL Injection method breached login security mechanism. An immediate fix is REQUIRED and URGENT.")

});

test("Log in attempting to use SQL injection (Inline comments: USERNAME+''/*')", async ({ page, request}) => {
    const driver= new Data_Dictionary(page, request);

    const user_info = await driver.get_LoginInfo();

    //#1. Send an API POST request to login using empty credentials.
    let response = await driver.request.post('http://localhost:3000/rest/user/login',

    {
        headers:{
        "Accept":"application/json, text/plain, */*",
        "Accept-Encoding":"gzip, deflate, br, zstd",
        "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
        "Content-Type": "application/json",
        "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
        "Origin":"http://localhost:3000",
        "Priority":"u=0",
        "Referer":"http://localhost:3000/"
    },

        data:{
            "email": user_info[0]+"'/*",
            "password": "A"
        }

    })

    //Print negative response
    await console.log(response)

    //Verify response code status is set to 401 (Unauthorized)
    await expect.soft(response.status()).toEqual(401);

    if (response.status()!=401)
        console.log("CRITICAL SECURITY BREACH: SQL Injection method breached login security mechanism. An immediate fix is REQUIRED and URGENT.")

});

test("Log in attempting to use SQL injection (USERNAME+' OR '1' ='1)", async ({ page, request}) => {
    const driver= new Data_Dictionary(page, request);

    const user_info = await driver.get_LoginInfo();

    //#1. Send an API POST request to login using empty credentials.
    let response = await driver.request.post('http://localhost:3000/rest/user/login',

    {
        headers:{
        "Accept":"application/json, text/plain, */*",
        "Accept-Encoding":"gzip, deflate, br, zstd",
        "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
        "Content-Type": "application/json",
        "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
        "Origin":"http://localhost:3000",
        "Priority":"u=0",
        "Referer":"http://localhost:3000/"
    },

        data:{
            "email": user_info[0]+"' or 1=1--",
            "password": "A"
        }

    })

    //Print negative response
    await console.log(response)

    //Verify response code status is set to 401 (Unauthorized)
    await expect.soft(response.status()).toEqual(401);

    if (response.status()!=401)
        console.log("CRITICAL SECURITY BREACH: SQL Injection method breached login security mechanism. An immediate fix is REQUIRED and URGENT.")

});

test("Log in attempting to use SQL injection (' or 1=1#)", async ({ page, request}) => {
    const driver= new Data_Dictionary(page, request);

    //#1. Send an API POST request to login using empty credentials.
    let response = await driver.request.post('http://localhost:3000/rest/user/login',

    {
        headers:{
        "Accept":"application/json, text/plain, */*",
        "Accept-Encoding":"gzip, deflate, br, zstd",
        "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
        "Content-Type": "application/json",
        "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
        "Origin":"http://localhost:3000",
        "Priority":"u=0",
        "Referer":"http://localhost:3000/"
    },

        data:{
            "email": "' or 1=1#",
            "password": "A"
        }

    })

    //Print negative response
    await console.log(response)

    //Verify response code status is set to 401 (Unauthorized)
    await expect.soft(response.status()).toEqual(401);

    if (response.status()!=401)
        console.log("CRITICAL SECURITY BREACH: SQL Injection method breached login security mechanism. An immediate fix is REQUIRED and URGENT.")

});

test("Log in attempting to use SQL injection (' or 1=1/*)", async ({ page, request}) => {
    const driver= new Data_Dictionary(page, request);

    //#1. Send an API POST request to login using empty credentials.
    let response = await driver.request.post('http://localhost:3000/rest/user/login',

    {
        headers:{
        "Accept":"application/json, text/plain, */*",
        "Accept-Encoding":"gzip, deflate, br, zstd",
        "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
        "Content-Type": "application/json",
        "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
        "Origin":"http://localhost:3000",
        "Priority":"u=0",
        "Referer":"http://localhost:3000/"
    },

        data:{
            "email": "' or 1=1/*",
            "password": "A"
        }

    })

    //Print negative response
    await console.log(response)

    //Verify response code status is set to 401 (Unauthorized)
    await expect.soft(response.status()).toEqual(401);

    if (response.status()!=401)
        console.log("CRITICAL SECURITY BREACH: SQL Injection method breached login security mechanism. An immediate fix is REQUIRED and URGENT.")

});

test("Log in attempting to use SQL injection (') or '1'='1--)", async ({ page, request}) => {
    const driver= new Data_Dictionary(page, request);

    //#1. Send an API POST request to login using empty credentials.
    let response = await driver.request.post('http://localhost:3000/rest/user/login',

    {
        headers:{
        "Accept":"application/json, text/plain, */*",
        "Accept-Encoding":"gzip, deflate, br, zstd",
        "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
        "Content-Type": "application/json",
        "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
        "Origin":"http://localhost:3000",
        "Priority":"u=0",
        "Referer":"http://localhost:3000/"
    },

        data:{
            "email": "') or '1'='1--",
            "password": "A"
        }

    })

    //Print negative response
    await console.log(response)

    //Verify response code status is set to 401 (Unauthorized)
    await expect.soft(response.status()).toEqual(401);

    if (response.status()!=401)
        console.log("CRITICAL SECURITY BREACH: SQL Injection method breached login security mechanism. An immediate fix is REQUIRED and URGENT.")

});

test("Log in attempting to use SQL injection (') or ('1'='1--)", async ({ page, request}) => {
    const driver= new Data_Dictionary(page, request);


    //#1. Send an API POST request to login using empty credentials.
    let response = await driver.request.post('http://localhost:3000/rest/user/login',

    {
        headers:{
        "Accept":"application/json, text/plain, */*",
        "Accept-Encoding":"gzip, deflate, br, zstd",
        "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
        "Content-Type": "application/json",
        "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
        "Origin":"http://localhost:3000",
        "Priority":"u=0",
        "Referer":"http://localhost:3000/"
    },

        data:{
            "email": "') or ('1'='1--",
            "password": "A"
        }

    })

    //Print negative response
    await console.log(response)

    //Verify response code status is set to 401 (Unauthorized)
    await expect.soft(response.status()).toEqual(401);

    if (response.status()!=401)
        console.log("CRITICAL SECURITY BREACH: SQL Injection method breached login security mechanism. An immediate fix is REQUIRED and URGENT.")

});

test("Search for valid products", async ({ page, request}) => {
    const driver= new Data_Dictionary(page, request);
    const keyword: string [] = ["Juice", "Fruit", "apple", "Pineapple", "green", "Smoothie", "Grape", "berry", "Lemon", "DRINK", "STRAWBERRY", "ORANGE", "vitaMiN", "rich", "owasp", "sweet", "tangy", "antioxidants", "tasty", "melon", "HEALTHY","SPINACH", "KIWI", "exotic", "refreshing", "ginger","eggfruit"]
    
    //DEFINITION
    let num=0
    let APIresponse: APIResponse
    let lc_keyword: string
    let allEntriesValid: boolean
    let matchesTitle: boolean
    let matchesDescription: boolean
    let isValid: boolean

    //LOOP EXECUTION
    for (let i = 0; i < 10; i++) {
        num = Math.floor(Math.random()*keyword.length)
        APIresponse = await driver.API_Search_for(keyword[num])

        await expect.soft (APIresponse.status()).toEqual(200)

        let JSON_file = await APIresponse.json()
        
        
        //Look for matches at response entries
        
        lc_keyword = keyword[num].toLocaleLowerCase()
        
        
        allEntriesValid = JSON_file.data.every((entry: DataEntry) => {
            
            matchesTitle = entry.name.toLocaleLowerCase().includes(lc_keyword)
            matchesDescription = entry.description.toLowerCase().includes(lc_keyword);

            isValid = matchesTitle || matchesDescription
            return isValid
            
        });

        await expect.soft (allEntriesValid).toBe(true)
    }
    
});

test("Search for non-valid products", async ({ page, request}) => {
    const driver= new Data_Dictionary(page, request);
    const keyword: string [] = ["oak", "bed", "hat", "MacBook","computer", "cellphone", "chocolate", "fish", "TRUCK", "TV", "garden", "music", "dairy", "soda", "floss", "headphones", "NOTEBOOK", "Android", "SmartTV", "LOTION"]
    
    //DEFINITION
    let num=0
    let APIresponse: APIResponse


    //LOOP EXECUTION
    for (let i = 0; i < 10; i++) {
        num = Math.floor(Math.random()*keyword.length)
        APIresponse = await driver.API_Search_for(keyword[num])

        await expect.soft (APIresponse.status()).toEqual(200)
        
        let JSON_file = await APIresponse.json()
        
        
        //Look for NO matches at JSON

        await expect.soft (JSON_file.data).toHaveLength(0)
    }
});

test("Search attempting to use SQL injection (Line comments ''--')", async ({ page, request}) => {
    const driver= new Data_Dictionary(page, request);

    const line_comment = "'--"

    //#1. Send an API GET request to search by employing SQL injections
    let response = await driver.request.get("http://localhost:3000/rest/products/search?q="+line_comment,

    {
        headers:{
        "Accept":"application/json, text/plain, */*",
        "Accept-Encoding":"gzip, deflate, br, zstd",
        "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
        "Content-Type": "application/json",
        "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
        "Origin":"http://localhost:3000",
        "Priority":"u=0",
        "Referer":"http://localhost:3000/"
        }


    })

    //Print response
    await console.log(response)

    expect.soft(response).toHaveProperty("status")
    expect.soft(response).toHaveProperty("data")

    //Verify response payload does not c
    await expect.soft (response.data).toHaveLength(0)

    //Verify response code status is set to 200 (OK)
    await expect.soft(response.status()).toEqual(200);

    if (response.status()!=200)
        await console.warn("SERVER ERROR DETECTED ("+response.status()+")")

});

    


