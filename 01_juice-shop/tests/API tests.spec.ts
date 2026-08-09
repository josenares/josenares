import { test, expect } from '@playwright/test';
import { Data_Dictionary } from '../Test_data/Page Object Definition';
import * as fs from 'fs';
import * as path from 'path';


test.beforeAll(async () => {
  // Runs once before all tests in this file/block per worker
    
    const filePath = path.resolve(__dirname, "../Test_data/UsersList.json")
  // To completely clear the file content:
    await fs.writeFileSync(filePath, JSON.stringify([]));

    const jsonData = [{'id':1, 'email':'admin@juice-sh.op', 'password': 'admin123', 'uniqueAnswer':''}]

    await fs.writeFileSync(filePath, JSON.stringify(jsonData,null,2),'utf-8')

});


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