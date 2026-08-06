import { test, expect } from '@playwright/test';
import { Data_Dictionary } from '../Test_data/Page Object Definition';

test('Log in', async ({ request,page }) => {
    const driver= new Data_Dictionary(page);
    const user_info = await driver.get_LoginInfo();

    const Login_response = await request.post('http://localhost:3000/rest/user/login',
    
    {
        headers:{},
        data:{
            "email":user_info[0],
            "password":user_info[1]
        }
    });

    expect (Login_response.status()).toEqual(200);

    const json = await Login_response.json()
    console.log(json);

    expect(json).toHaveProperty("authentication.token")
    expect(json.authentication.token).toBeTruthy();
    expect(json).toHaveProperty('authentication.umail',user_info[0])
  
    
   

});
