import { test, expect, APIResponse } from '@playwright/test';
import { Data_Dictionary } from '../Test_data/Page Object Definition';
import * as fs from 'fs';
import * as path from 'path';
import { get } from 'http';


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

//Verify login rejects authorization when SQL injection is performed. 
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

//Verify login rejects authorization when SQL injection is performed. 
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

//Verify login rejects authorization when SQL injection is performed. 
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

//Verify login rejects authorization when SQL injection is performed. 
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

//Verify login rejects authorization when SQL injection is performed.
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

//Verify login rejects authorization when SQL injection is performed.
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

//Verify login rejects authorization when SQL injection is performed.
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

//Verify login rejects authorization when SQL injection is performed.
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

//Verify a positive non-empty response is received when searching for valid products.
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

//Verify a positive empty response is received when searching for non-valid products.
test("Search for non-valid products", async ({ page, request}) => {
    const driver= new Data_Dictionary(page, request);
    const keyword: string [] = ["oak", "bed", "MacBook","computer", "cellphone", "chocolate", "fish", "TRUCK", "TV", "garden", "music", "dairy", "soda", "floss", "headphones", "NOTEBOOK", "Android", "SmartTV", "LOTION"]
    
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

//Verify a negative response (422) is received when attempting to perform SQL injection.
test("Search attempting to use SQL injection (Line comments ''--')", async ({ page, request}) => {
    const driver= new Data_Dictionary(page, request);

    const keyword: string [] = ["Juice", "Fruit", "apple", "Pineapple", "green", "Smoothie", "Grape", "berry", "Lemon", "DRINK", "STRAWBERRY", "ORANGE", "vitaMiN", "rich", "owasp", "sweet", "tangy", "antioxidants", "tasty", "melon", "HEALTHY","SPINACH", "KIWI", "exotic", "refreshing", "ginger","eggfruit"]
    const num = Math.floor(Math.random()*keyword.length)


    const line_comment = "'--"

    //#1. Send an API GET request to search by employing SQL injections
    let response = await driver.request.get("http://localhost:3000/rest/products/search?q="+keyword[num],line_comment,

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

//Verify a negative response (422) is received when attempting to perform SQL injection.
test("Search attempting to use SQL injection (Line comments ''#')", async ({ page, request}) => {
    const driver= new Data_Dictionary(page, request);
    
    const keyword: string [] = ["Juice", "Fruit", "apple", "Pineapple", "green", "Smoothie", "Grape", "berry", "Lemon", "DRINK", "STRAWBERRY", "ORANGE", "vitaMiN", "rich", "owasp", "sweet", "tangy", "antioxidants", "tasty", "melon", "HEALTHY","SPINACH", "KIWI", "exotic", "refreshing", "ginger","eggfruit"]
    const num = Math.floor(Math.random()*keyword.length)
    
    const line_comment = "'#"

    //#1. Send an API GET request to search by employing SQL injections
    let response = await driver.request.get("http://localhost:3000/rest/products/search?q="+keyword[num],line_comment,

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

//Verify a negative response (422) is received when attempting to perform SQL injection.
test("Search attempting to use SQL injection (Line comments ''/*')", async ({ page, request}) => {
    const driver= new Data_Dictionary(page, request);

    const keyword: string [] = ["Juice", "Fruit", "apple", "Pineapple", "green", "Smoothie", "Grape", "berry", "Lemon", "DRINK", "STRAWBERRY", "ORANGE", "vitaMiN", "rich", "owasp", "sweet", "tangy", "antioxidants", "tasty", "melon", "HEALTHY","SPINACH", "KIWI", "exotic", "refreshing", "ginger","eggfruit"]
    const num = Math.floor(Math.random()*keyword.length)

    const line_comment = "'/*"

    //#1. Send an API GET request to search by employing SQL injections
    let response = await driver.request.get("http://localhost:3000/rest/products/search?q="+keyword[num],line_comment,

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

//Verify a negative response (422) is received when attempting to perform SQL injection.
test("Search attempting to use SQL injection (Line comments '' or 1=1--')", async ({ page, request}) => {
    const driver= new Data_Dictionary(page, request);

    const line_comment = "' or 1=1--"

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

//Verify a negative response (422) is received when attempting to perform SQL injection.
test("Search attempting to use SQL injection (Line comments '' or 1=1#')", async ({ page, request}) => {
    const driver= new Data_Dictionary(page, request);

    const line_comment = "' or 1=1#"


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

//Verify a negative response (422) is received when attempting to perform SQL injection.
test("Search attempting to use SQL injection (Line comments '' or 1=1/*')", async ({ page, request}) => {
    const driver= new Data_Dictionary(page, request);

    const line_comment = "' or 1=1/*"


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

//Verify a negative response (422) is received when attempting to perform SQL injection.
test("Search attempting to use SQL injection (Line comments '') or '1'='1--')", async ({ page, request}) => {
    const driver= new Data_Dictionary(page, request);

    const line_comment = "') or '1'='1--"


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

//Verify a negative response (422) is received when attempting to perform SQL injection.
test("Search attempting to use SQL injection (Line comments '') or ('1'='1--')", async ({ page, request}) => {
    const driver= new Data_Dictionary(page, request);

    const line_comment = "') or ('1'='1--"


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

//Verify API adds a new item into basket.
test("Atempt to add a new item into basket without auth token", async ({ page, request}) => {
    const driver= new Data_Dictionary(page, request);

    const productinventory_response = await driver.request.get("http://localhost:3000/api/Quantitys/",
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

    let qty = 0
    let num = 0
    const  jsoncontent = await productinventory_response.json()

    while(qty==0){ 
        num = Math.floor(Math.random()*55.9)
        qty = jsoncontent.data[num].quantity

    }

    const pID = jsoncontent.data[num].ProductId

    const additem_response = await driver.request.post("http://localhost:3000/api/BasketItems/",
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
            "ProductId": pID,
            "BasketId": 1,
            "quantity":1
        }
    })

    expect (additem_response.status()).toEqual(401)

});

//Verify API adds a new item into basket.
test("Add a new item into basket", async ({ page, request}) => {
    const driver= new Data_Dictionary(page, request);
    const login_response = await driver.request.post("http://localhost:3000/rest/user/login",
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
            "email": "admin@juice-sh.op",
            "password": "admin123"
        }

    })

    const login_json = await login_response.json()
    const auth_token = "Bearer "+login_json.authentication.token
    const bid = login_json.authentication.bid

    const productinventory_response = await driver.request.get("http://localhost:3000/api/Quantitys/",
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

    const productinventory_json = await productinventory_response.json()
    let qty = 0
    let num = 0

    while(qty==0){ 
        num = Math.floor(Math.random()*55.9)
        qty = productinventory_json.data[num].quantity

    }

    const pID = productinventory_json.data[num].ProductId

    const additem_response = await driver.request.post("http://localhost:3000/api/BasketItems/",
    {
        headers:{
            "Accept":"application/json, text/plain, */*",
            "Accept-Encoding":"gzip, deflate, br, zstd",
            "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
            "Authorization":auth_token,
            "Content-Type": "application/json",
            "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
            "Origin":"http://localhost:3000",
            "Priority":"u=0",
            "Referer":"http://localhost:3000/"
        },
        
        data:{
            "ProductId": pID,
            "BasketId": bid,
            "quantity":1
        }
    })

    const additem_json = await additem_response.json()
    
    expect (additem_response.status()).toEqual(200)
    expect (additem_json).toHaveProperty("status","success")
    expect (additem_json).toHaveProperty("data")
    expect.soft (additem_json.data).toHaveProperty("id")
    expect.soft (additem_json.data).toHaveProperty("ProductId",pID)
    expect.soft (additem_json.data).toHaveProperty("BasketId",bid)
    expect.soft (additem_json.data).toHaveProperty("quantity",1)
    expect.soft (additem_json.data).toHaveProperty("updatedAt")
    expect.soft (additem_json.data).toHaveProperty("createdAt")


});

//Verify API sends an error response when post request attempts to add more than existing product items.
test("Attempt to add a non-affordable quantity of a product", async ({ page, request}) => {
    const driver= new Data_Dictionary(page, request);
    const login_response = await driver.request.post("http://localhost:3000/rest/user/login",
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
            "email": "admin@juice-sh.op",
            "password": "admin123"
        }

    })
    const login_json = await login_response.json()
    const auth_token =  "Bearer "+login_json.authentication.token
    const bid = login_json.authentication.bid

    const productinventory_response = await driver.request.get("http://localhost:3000/api/Quantitys/",
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

    const productinventory_json = await productinventory_response.json()
    let qty = 0
    let num = 0
    let limitperUser = 1

    while(qty==0 || limitperUser != null){ 
        num = Math.floor(Math.random()*55.9)
        qty = productinventory_json.data[num].quantity
        limitperUser = productinventory_json.data[num].limitPerUser
    }

    const pID = productinventory_json.data[num].ProductId

    const additem_response = await driver.request.post("http://localhost:3000/api/BasketItems/",
    {
        headers:{
            "Accept":"application/json, text/plain, */*",
            "Accept-Encoding":"gzip, deflate, br, zstd",
            "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
            "Authorization":auth_token,
            "Content-Type": "application/json",
            "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
            "Origin":"http://localhost:3000",
            "Priority":"u=0",
            "Referer":"http://localhost:3000/"
        },
        
        data:{
            "ProductId": pID,
            "BasketId": bid,
            "quantity": qty + 1
        }
    })

    expect (additem_response.status()).toEqual(400)
    expect (await additem_response.json()).toHaveProperty("error", "We are out of stock! Sorry for the inconvenience.")


});

//Verify API sends an error response when post request attempts to add more than permitted product items (specified by limitPerUser).
test("Attempt to add a not-allowed quantity of a product", async ({ page, request}) => {
    const driver= new Data_Dictionary(page, request);
    const login_response = await driver.request.post("http://localhost:3000/rest/user/login",
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
            "email": "admin@juice-sh.op",
            "password": "admin123"
        }

    })
    const login_json = await login_response.json()
    const auth_token =  "Bearer "+login_json.authentication.token
    const bid = login_json.authentication.bid

    const productinventory_response = await driver.request.get("http://localhost:3000/api/Quantitys/",
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

    const productinventory_json = await productinventory_response.json()
    let qty = 0
    let num = 0
    let limitperUser = null

    while(qty==0 || (limitperUser == null || limitperUser == 0)){ 
        num = Math.floor(Math.random()*55.9)
        qty = productinventory_json.data[num].quantity
        limitperUser = productinventory_json.data[num].limitPerUser
    }

    const pID = productinventory_json.data[num].ProductId

    const additem_response = await driver.request.post("http://localhost:3000/api/BasketItems/",
    {
        headers:{
            "Accept":"application/json, text/plain, */*",
            "Accept-Encoding":"gzip, deflate, br, zstd",
            "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
            "Authorization":auth_token,
            "Content-Type": "application/json",
            "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
            "Origin":"http://localhost:3000",
            "Priority":"u=0",
            "Referer":"http://localhost:3000/"
        },
        
        data:{
            "ProductId": pID,
            "BasketId": bid,
            "quantity": limitperUser + 1
        }
    })

    expect (additem_response.status()).toEqual(400)
    expect (await additem_response.json()).toHaveProperty("error", "You can order only up to "+limitperUser+" items of this product.")


});

//Verify API throws error response when there is no authorization header at request.
test("Attempt to get current basket status without any AUTH token", async ({ page, request}) => {
    const driver= new Data_Dictionary(page, request);
    const login_response = await driver.request.post("http://localhost:3000/rest/user/login",
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
            "email": "admin@juice-sh.op",
            "password": "admin123"
        }

    })

    const login_json = await login_response.json()
    const bid = login_json.authentication.bid

    const getbasket_response = await driver.request.get("http://localhost:3000/rest/basket/"+bid,
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

    expect (getbasket_response.status()).toEqual(401)
    expect.soft (await getbasket_response.json()).toHaveProperty("error")

});

//Verify API retrieves status of basket.
test("Get current basket status", async ({ page, request}) => {
    const driver= new Data_Dictionary(page, request);
    const login_response = await driver.request.post("http://localhost:3000/rest/user/login",
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
            "email": "admin@juice-sh.op",
            "password": "admin123"
        }

    })
    
    const login_json = await login_response.json()
    const auth_token = "Bearer "+login_json.authentication.token
    const bid = login_json.authentication.bid



    const getbasket_response = await driver.request.get("http://localhost:3000/rest/basket/"+bid,
    {
        headers:{
            "Accept":"application/json, text/plain, */*",
            "Accept-Encoding":"gzip, deflate, br, zstd",
            "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
            "Authorization":auth_token,
            "Content-Type": "application/json",
            "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
            "Origin":"http://localhost:3000",
            "Priority":"u=0",
            "Referer":"http://localhost:3000/"
        }
    
    })

    const getbasket_json = await getbasket_response.json()
    
    expect (getbasket_response.status()).toEqual(200)
    expect (getbasket_json).toHaveProperty("status","success")
    expect (getbasket_json).toHaveProperty("data")
    expect (getbasket_json.data).toHaveProperty("id")
    expect (getbasket_json.data).toHaveProperty("coupon")
    expect (getbasket_json.data).toHaveProperty("UserId")
    expect (getbasket_json.data).toHaveProperty("createdAt")
    expect (getbasket_json.data).toHaveProperty("updatedAt")
    expect (getbasket_json.data).toHaveProperty("Products")
    expect (getbasket_json.data.Products[0]).toHaveProperty("id")
    expect (getbasket_json.data.Products[0]).toHaveProperty("name")
    expect (getbasket_json.data.Products[0]).toHaveProperty("description")
    expect (getbasket_json.data.Products[0]).toHaveProperty("price")
    expect (getbasket_json.data.Products[0]).toHaveProperty("deluxePrice")
    expect (getbasket_json.data.Products[0]).toHaveProperty("image")
    expect (getbasket_json.data.Products[0]).toHaveProperty("createdAt")
    expect (getbasket_json.data.Products[0]).toHaveProperty("updatedAt")
    expect (getbasket_json.data.Products[0]).toHaveProperty("deletedAt",null)
    expect (getbasket_json.data.Products[0]).toHaveProperty("BasketItem")

});

//Verify API cannot delete items from basket without any auth token
test("Attempt to delete items from basket", async ({ page, request}) => {
    const driver= new Data_Dictionary(page, request);
    const login_response = await driver.request.post("http://localhost:3000/rest/user/login",
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
            "email": "admin@juice-sh.op",
            "password": "admin123"
        }

    })
    
    const login_json = await login_response.json()
    const auth_token = "Bearer "+login_json.authentication.token
    const bid = login_json.authentication.bid

    const getbasket_response = await driver.request.get("http://localhost:3000/rest/basket/"+bid,
    {
        headers:{
            "Accept":"application/json, text/plain, */*",
            "Accept-Encoding":"gzip, deflate, br, zstd",
            "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
            "Authorization":auth_token,
            "Content-Type": "application/json",
            "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
            "Origin":"http://localhost:3000",
            "Priority":"u=0",
            "Referer":"http://localhost:3000/"
        }
    
    })
    const getbasket_json = await getbasket_response.json()
    let basketitem = 0

    //If basket is NOT empty
    if(getbasket_json.data.Products.length!=0){
        const num = Math.floor(Math.random()*getbasket_json.data.Products.length*0.99)
        basketitem = getbasket_json.data.Products[num].BasketItem.id
    }

    else {
        console.error("No items to delete from basket")
    }
    
    const deleteitem_response = await driver.request.delete("http://localhost:3000/api/BasketItems/"+basketitem,
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

    await expect (deleteitem_response.status()).toEqual(401)

});

//Verify API deletes items from basket
test("Delete items from basket", async ({ page, request}) => {
    const driver= new Data_Dictionary(page, request);
    const login_response = await driver.request.post("http://localhost:3000/rest/user/login",
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
            "email": "admin@juice-sh.op",
            "password": "admin123"
        }

    })
    const login_json = await login_response.json()
    const auth_token = "Bearer "+login_json.authentication.token
    const bid = login_json.authentication.bid

    const getbasket_response = await driver.request.get("http://localhost:3000/rest/basket/"+bid,
    {
        headers:{
            "Accept":"application/json, text/plain, */*",
            "Accept-Encoding":"gzip, deflate, br, zstd",
            "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
            "Authorization":auth_token,
            "Content-Type": "application/json",
            "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
            "Origin":"http://localhost:3000",
            "Priority":"u=0",
            "Referer":"http://localhost:3000/"
        }
    
    })

    const getbasket_json = await getbasket_response.json()
    let basketitem = 0

    //If basket is NOT empty
    if(getbasket_json.data.Products.length!=0){
        const num = Math.floor(Math.random()*getbasket_json.data.Products.length*0.99)
        basketitem = await getbasket_json.data.Products[num].BasketItem.id
    }

    else {
        console.error("No items to delete from basket")
    }
    
    const deleteitem_response = await driver.request.delete("http://localhost:3000/api/BasketItems/"+basketitem,
    {
        headers:{
            "Authorization":auth_token,
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

    expect (deleteitem_response.status()).toEqual(200)
    expect (await deleteitem_response.json()).toHaveProperty("status", "success")
    expect (await deleteitem_response.json()).toHaveProperty("data",{})
});

//Verify API cannot retrieve addresses list when no auth token is attached at request.
test("Attempt to get available addresses list without any auth token", async ({ page, request}) => {

    const driver= new Data_Dictionary(page, request);

    const get_address_list =  await driver.request.get("http://localhost:3000/api/Addresss",
    {})

    expect (get_address_list.status()).toEqual(401)

});

//Verify API retrieves addresses list using auth token as input.
test("Get available addresses list", async ({ page, request}) => {

    const driver= new Data_Dictionary(page, request);
    const login_response = await driver.request.post("http://localhost:3000/rest/user/login",
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
            "email": "admin@juice-sh.op",
            "password": "admin123"
        }

    })
    const login_json = await login_response.json()
    const auth_token = "Bearer "+await login_json.authentication.token

    const get_address_list =  await driver.request.get("http://localhost:3000/api/Addresss",
    {
        headers:{
            "Authorization": auth_token,
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

    expect (await get_address_list.json()).toHaveProperty("status", "success")
    expect (await get_address_list.json()).toHaveProperty("data")

    
});

//Verify API cannot retrieve delivery methods list when no auth token is attached at request.
test("Attempt to get available delivery methods list without any auth token", async ({ page, request}) => {

    const driver= new Data_Dictionary(page, request);

    const get_deliveries_list =  await driver.request.get("http://localhost:3000/api/Deliverys",
    {})

    expect (get_deliveries_list.status()).toEqual(401)

});

//Verify API retrieves delivery methods list using auth token as input.
test("Get available delivery methods list", async ({ page, request}) => {

    const driver= new Data_Dictionary(page, request);
    const login_response = await driver.request.post("http://localhost:3000/rest/user/login",
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
            "email": "admin@juice-sh.op",
            "password": "admin123"
        }

    })
    
    const login_json = await login_response.json()
    const auth_token = "Bearer "+login_json.authentication.token

    const get_deliveries_list =  await driver.request.get("http://localhost:3000/api/Deliverys",
    {
        headers:{
            "Authorization": auth_token,
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

    expect (await get_deliveries_list.json()).toHaveProperty("status", "success")
    expect (await get_deliveries_list.json()).toHaveProperty("data")

    
});

//Verify API cannot retrieve payment methods list when no auth token is attached at request.
test("Attempt to get available payment methods list without any auth token", async ({ page, request}) => {

    const driver= new Data_Dictionary(page, request);

    const get_payment_list =  await driver.request.get("http://localhost:3000/api/Cards",
    {})

    expect (get_payment_list.status()).toEqual(401)

});

//Verify API retrieves payment methods list using auth token as input.
test("Get available payment methods list", async ({ page, request}) => {

    const driver= new Data_Dictionary(page, request);
    const login_response = await driver.request.post("http://localhost:3000/rest/user/login",
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
            "email": "admin@juice-sh.op",
            "password": "admin123"
        }

    })
    
    const login_json = await login_response.json()
    const auth_token = "Bearer "+login_json.authentication.token

    const get_payment_list =  await driver.request.get("http://localhost:3000/api/Cards",
    {
        headers:{
            "Authorization": auth_token,
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

    expect (await get_payment_list.json()).toHaveProperty("status", "success")
    expect (await get_payment_list.json()).toHaveProperty("data")

    
});

//Verify API sends request for checkout
test("Perform checkout", async ({ page, request}) => {

    const driver= new Data_Dictionary(page, request);
    //Get auth token for request
    const login_response = await driver.request.post("http://localhost:3000/rest/user/login",
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
            "email": "admin@juice-sh.op",
            "password": "admin123"
        }

    })
    
    const login_json = await login_response.json()
    const auth_token = "Bearer "+login_json.authentication.token
    const bid = login_json.authentication.bid

    //Prepare basket with a few items
    let productinventory_json
    let qty = 0
    let num = 0
    let pID
    let additem_response

    for(let i=0;i<3;i++){
        const productinventory_response = await driver.request.get("http://localhost:3000/api/Quantitys/",
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

        productinventory_json = await productinventory_response.json()
        qty = 0
        num = 0

        while(qty==0){ 
            num = Math.floor(Math.random()*55.9)
            qty = productinventory_json.data[num].quantity

        }

        pID = productinventory_json.data[num].ProductId

        additem_response = await driver.request.post("http://localhost:3000/api/BasketItems/",
        {
            headers:{
                "Accept":"application/json, text/plain, */*",
                "Accept-Encoding":"gzip, deflate, br, zstd",
                "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
                "Authorization":auth_token,
                "Content-Type": "application/json",
                "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
                "Origin":"http://localhost:3000",
                "Priority":"u=0",
                "Referer":"http://localhost:3000/",
                "Connection": "keep-alive"
            },
            
            data:{
                "ProductId": pID,
                "BasketId": bid,
                "quantity":1
            }
        })
    } 
    //Get Address
        const get_address_list =  await driver.request.get("http://localhost:3000/api/Addresss",
    {
        headers:{
            "Authorization": auth_token,
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
    const addresses_json = await get_address_list.json()
    const address_id = Math.floor(Math.random()*addresses_json.data.length*0.99)
    const address = addresses_json.data[address_id].id;

    //Get delivery method
    const get_deliveries_list =  await driver.request.get("http://localhost:3000/api/Deliverys",
    {
        headers:{
            "Authorization": auth_token,
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

    const delivery_json = await get_deliveries_list.json()
    const delivery_id = Math.floor(Math.random()*delivery_json.data.length*0.99)
    const delivery = delivery_json.data[delivery_id].id;

    //Get payment method
    const get_payments_list =  await driver.request.get("http://localhost:3000/api/Cards",
    {
        headers:{
            "Authorization": auth_token,
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

    const payment_json = await get_payments_list.json()
    const payment_id = Math.floor(Math.random()*payment_json.data.length*0.99)
    const payment = payment_json.data[payment_id].id;

    //Send request for checkout: address, payment and delivery methods should be ready
    const checkout_response = await driver.request.post("http://localhost:3000/rest/basket/1/checkout",
    {
        headers:{
            "Accept":"application/json, text/plain, */*",
            "Accept-Encoding":"gzip, deflate, br, zstd",
            "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
            "Authorization": auth_token,
            "Content-Type": "application/json",
            "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
            "Origin":"http://localhost:3000",
            "Priority":"u=0",
            "Referer":"http://localhost:3000/"
        },

        data:{
            "couponData":"",
            "orderDetails":
            {
                "paymentId":payment,
                "addressId":address,
                "deliveryMethodId":delivery
            }
        }

    })

    //Verify response
    expect (await checkout_response.status()).toEqual(200)
    expect (await checkout_response.json()).toHaveProperty("orderConfirmation")
});

//Verify API gets an error response when Checkout request lacks of an Auth token
test("Attempt to check out without any AUTH token", async ({ page, request}) => {

    const driver= new Data_Dictionary(page, request);
    //Get auth token for request
    const login_response = await driver.request.post("http://localhost:3000/rest/user/login",
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
            "email": "admin@juice-sh.op",
            "password": "admin123"
        }

    })
    
    const login_json = await login_response.json()
    const auth_token = "Bearer "+login_json.authentication.token
    const bid = login_json.authentication.bid

    //Prepare basket with a few items
    let productinventory_json
    let qty = 0
    let num = 0
    let pID
    let additem_response

    for(let i=0;i<3;i++){
        const productinventory_response = await driver.request.get("http://localhost:3000/api/Quantitys/",
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

        productinventory_json = await productinventory_response.json()
        qty = 0
        num = 0

        while(qty==0){ 
            num = Math.floor(Math.random()*55.9)
            qty = productinventory_json.data[num].quantity

        }

        pID = productinventory_json.data[num].ProductId

        additem_response = await driver.request.post("http://localhost:3000/api/BasketItems/",
        {
            headers:{
                "Accept":"application/json, text/plain, */*",
                "Accept-Encoding":"gzip, deflate, br, zstd",
                "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
                "Authorization":auth_token,
                "Content-Type": "application/json",
                "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
                "Origin":"http://localhost:3000",
                "Priority":"u=0",
                "Referer":"http://localhost:3000/",
                "Connection": "keep-alive"
            },
            
            data:{
                "ProductId": pID,
                "BasketId": bid,
                "quantity":1
            }
        })
    } 
    //Get Address
        const get_address_list =  await driver.request.get("http://localhost:3000/api/Addresss",
    {
        headers:{
            "Authorization": auth_token,
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
    const addresses_json = await get_address_list.json()
    const address_id = Math.floor(Math.random()*addresses_json.data.length*0.99)
    const address = addresses_json.data[address_id].id;

    //Get delivery method
    const get_deliveries_list =  await driver.request.get("http://localhost:3000/api/Deliverys",
    {
        headers:{
            "Authorization": auth_token,
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

    const delivery_json = await get_deliveries_list.json()
    const delivery_id = Math.floor(Math.random()*delivery_json.data.length*0.99)
    const delivery = delivery_json.data[delivery_id].id;

    //Get payment method
    const get_payments_list =  await driver.request.get("http://localhost:3000/api/Cards",
    {
        headers:{
            "Authorization": auth_token,
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

    const payment_json = await get_payments_list.json()
    const payment_id = Math.floor(Math.random()*payment_json.data.length*0.99)
    const payment = payment_json.data[payment_id].id;

    //Send request for checkout: address, payment and delivery methods should be ready
    const checkout_response = await driver.request.post("http://localhost:3000/rest/basket/1/checkout",
    {
        headers:{
            "Accept":"application/json, text/plain, */*",
            "Accept-Encoding":"gzip, deflate, br, zstd",
            "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
            "Authorization": "",
            "Content-Type": "application/json",
            "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
            "Origin":"http://localhost:3000",
            "Priority":"u=0",
            "Referer":"http://localhost:3000/"
        },

        data:{
            "couponData":"",
            "orderDetails":
            {
                "paymentId":payment,
                "addressId":address,
                "deliveryMethodId":delivery
            }
        }

    })

    //Verify response
    expect (await checkout_response.status()).toEqual(401)
    expect (await checkout_response.json()).not.toHaveProperty("orderConfirmation")
});

//Verify API response is negative when request is malformed
test("Attempt to check out after removing ADDRESS parameter from request", async ({ page, request}) => {

    const driver= new Data_Dictionary(page, request);
    //Get auth token for request
    const login_response = await driver.request.post("http://localhost:3000/rest/user/login",
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
            "email": "admin@juice-sh.op",
            "password": "admin123"
        }

    })
    
    const login_json = await login_response.json()
    const auth_token = "Bearer "+login_json.authentication.token
    const bid = login_json.authentication.bid

    //Prepare basket with a few items
    let productinventory_json
    let qty = 0
    let num = 0
    let pID
    let additem_response

    for(let i=0;i<3;i++){
        const productinventory_response = await driver.request.get("http://localhost:3000/api/Quantitys/",
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

        productinventory_json = await productinventory_response.json()
        qty = 0
        num = 0

        while(qty==0){ 
            num = Math.floor(Math.random()*55.9)
            qty = productinventory_json.data[num].quantity

        }

        pID = productinventory_json.data[num].ProductId

        additem_response = await driver.request.post("http://localhost:3000/api/BasketItems/",
        {
            headers:{
                "Accept":"application/json, text/plain, */*",
                "Accept-Encoding":"gzip, deflate, br, zstd",
                "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
                "Authorization":auth_token,
                "Content-Type": "application/json",
                "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
                "Origin":"http://localhost:3000",
                "Priority":"u=0",
                "Referer":"http://localhost:3000/",
                "Connection": "keep-alive"
            },
            
            data:{
                "ProductId": pID,
                "BasketId": bid,
                "quantity":1
            }
        })
    } 

    //Get delivery method
    const get_deliveries_list =  await driver.request.get("http://localhost:3000/api/Deliverys",
    {
        headers:{
            "Authorization": auth_token,
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

    const delivery_json = await get_deliveries_list.json()
    const delivery_id = Math.floor(Math.random()*delivery_json.data.length*0.99)
    const delivery = delivery_json.data[delivery_id].id;

    //Get payment method
    const get_payments_list =  await driver.request.get("http://localhost:3000/api/Cards",
    {
        headers:{
            "Authorization": auth_token,
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

    const payment_json = await get_payments_list.json()
    const payment_id = Math.floor(Math.random()*payment_json.data.length*0.99)
    const payment = payment_json.data[payment_id].id;

    //Send request for checkout: address, payment and delivery methods should be ready
    const checkout_response = await driver.request.post("http://localhost:3000/rest/basket/1/checkout",
    {
        headers:{
            "Accept":"application/json, text/plain, */*",
            "Accept-Encoding":"gzip, deflate, br, zstd",
            "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
            "Authorization": auth_token,
            "Content-Type": "application/json",
            "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
            "Origin":"http://localhost:3000",
            "Priority":"u=0",
            "Referer":"http://localhost:3000/"
        },

        data:{
            "couponData":"",
            "orderDetails":
            {
                "paymentId":payment,
                "deliveryMethodId":delivery
            }
        }

    })

    //Verify response
    expect.soft (await checkout_response.status()).toEqual(400)
    expect (await checkout_response.json()).not.toHaveProperty("orderConfirmation")
});

//Verify API response is negative when request is malformed
test("Attempt to check out after removing PAYMENT parameter from request", async ({ page, request}) => {

    const driver= new Data_Dictionary(page, request);
    //Get auth token for request
    const login_response = await driver.request.post("http://localhost:3000/rest/user/login",
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
            "email": "admin@juice-sh.op",
            "password": "admin123"
        }

    })
    
    const login_json = await login_response.json()
    const auth_token = "Bearer "+login_json.authentication.token
    const bid = login_json.authentication.bid

    //Prepare basket with a few items
    let productinventory_json
    let qty = 0
    let num = 0
    let pID
    let additem_response

    for(let i=0;i<3;i++){
        const productinventory_response = await driver.request.get("http://localhost:3000/api/Quantitys/",
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

        productinventory_json = await productinventory_response.json()
        qty = 0
        num = 0

        while(qty==0){ 
            num = Math.floor(Math.random()*55.9)
            qty = productinventory_json.data[num].quantity

        }

        pID = productinventory_json.data[num].ProductId

        additem_response = await driver.request.post("http://localhost:3000/api/BasketItems/",
        {
            headers:{
                "Accept":"application/json, text/plain, */*",
                "Accept-Encoding":"gzip, deflate, br, zstd",
                "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
                "Authorization":auth_token,
                "Content-Type": "application/json",
                "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
                "Origin":"http://localhost:3000",
                "Priority":"u=0",
                "Referer":"http://localhost:3000/",
                "Connection": "keep-alive"
            },
            
            data:{
                "ProductId": pID,
                "BasketId": bid,
                "quantity":1
            }
        })
    } 
    //Get Address
        const get_address_list =  await driver.request.get("http://localhost:3000/api/Addresss",
    {
        headers:{
            "Authorization": auth_token,
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
    const addresses_json = await get_address_list.json()
    const address_id = Math.floor(Math.random()*addresses_json.data.length*0.99)
    const address = addresses_json.data[address_id].id;

    //Get delivery method
    const get_deliveries_list =  await driver.request.get("http://localhost:3000/api/Deliverys",
    {
        headers:{
            "Authorization": auth_token,
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

    const delivery_json = await get_deliveries_list.json()
    const delivery_id = Math.floor(Math.random()*delivery_json.data.length*0.99)
    const delivery = delivery_json.data[delivery_id].id;



    //Send request for checkout: address, payment and delivery methods should be ready
    const checkout_response = await driver.request.post("http://localhost:3000/rest/basket/1/checkout",
    {
        headers:{
            "Accept":"application/json, text/plain, */*",
            "Accept-Encoding":"gzip, deflate, br, zstd",
            "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
            "Authorization": auth_token,
            "Content-Type": "application/json",
            "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
            "Origin":"http://localhost:3000",
            "Priority":"u=0",
            "Referer":"http://localhost:3000/"
        },

        data:{
            "couponData":"",
            "orderDetails":
            {
                "addressId":address,
                "deliveryMethodId":delivery
            }
        }

    })

    //Verify response
    expect.soft (await checkout_response.status()).toEqual(400)
    expect (await checkout_response.json()).not.toHaveProperty("orderConfirmation")
});

//Verify API response is negative when request is malformed
test("Attempt to check out after removing DELIVERY parameter from request", async ({ page, request}) => {

    const driver= new Data_Dictionary(page, request);
    //Get auth token for request
    const login_response = await driver.request.post("http://localhost:3000/rest/user/login",
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
            "email": "admin@juice-sh.op",
            "password": "admin123"
        }

    })
    
    const login_json = await login_response.json()
    const auth_token = "Bearer "+login_json.authentication.token
    const bid = login_json.authentication.bid

    //Prepare basket with a few items
    let productinventory_json
    let qty = 0
    let num = 0
    let pID
    let additem_response

    for(let i=0;i<3;i++){
        const productinventory_response = await driver.request.get("http://localhost:3000/api/Quantitys/",
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

        productinventory_json = await productinventory_response.json()
        qty = 0
        num = 0

        while(qty==0){ 
            num = Math.floor(Math.random()*55.9)
            qty = productinventory_json.data[num].quantity

        }

        pID = productinventory_json.data[num].ProductId

        additem_response = await driver.request.post("http://localhost:3000/api/BasketItems/",
        {
            headers:{
                "Accept":"application/json, text/plain, */*",
                "Accept-Encoding":"gzip, deflate, br, zstd",
                "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
                "Authorization":auth_token,
                "Content-Type": "application/json",
                "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
                "Origin":"http://localhost:3000",
                "Priority":"u=0",
                "Referer":"http://localhost:3000/",
                "Connection": "keep-alive"
            },
            
            data:{
                "ProductId": pID,
                "BasketId": bid,
                "quantity":1
            }
        })
    } 
    //Get Address
        const get_address_list =  await driver.request.get("http://localhost:3000/api/Addresss",
    {
        headers:{
            "Authorization": auth_token,
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
    const addresses_json = await get_address_list.json()
    const address_id = Math.floor(Math.random()*addresses_json.data.length*0.99)
    const address = addresses_json.data[address_id].id;


    //Get payment method
    const get_payments_list =  await driver.request.get("http://localhost:3000/api/Cards",
    {
        headers:{
            "Authorization": auth_token,
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

    const payment_json = await get_payments_list.json()
    const payment_id = Math.floor(Math.random()*payment_json.data.length*0.99)
    const payment = payment_json.data[payment_id].id;

    //Send request for checkout: address, payment and delivery methods should be ready
    const checkout_response = await driver.request.post("http://localhost:3000/rest/basket/1/checkout",
    {
        headers:{
            "Accept":"application/json, text/plain, */*",
            "Accept-Encoding":"gzip, deflate, br, zstd",
            "Accept-Language":"es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7",
            "Authorization": auth_token,
            "Content-Type": "application/json",
            "Cookie":"language=en; welcomebanner_status=dismiss; continueCode=8JvY7eWQm1aKgMpz42wLj6dKJSjjhnQtXRi8jAbXx9RZlk5PyVENDrB3Onoq; cookieconsent_status=dismiss",
            "Origin":"http://localhost:3000",
            "Priority":"u=0",
            "Referer":"http://localhost:3000/"
        },

        data:{
            "couponData":"",
            "orderDetails":
            {
                "paymentId":payment,
                "addressId":address
            }
        }

    })

    //Verify response
    expect.soft (await checkout_response.status()).toEqual(400)
    expect (await checkout_response.json()).not.toHaveProperty("orderConfirmation")
});
