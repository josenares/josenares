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

//#################################################################################################################################################
//TEST SPECIFICATION
//#################################################################################################################################################


//USER REGISTRATION //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Verify the user can register a new user into the system.
test('Register a new user', async ({ page, request }) => {
  
  //Create page object
  const driver= new Data_Dictionary(page, request);
  
  //ALWAYS EXECUTE THIS FUNCTION BEFORE TEST.
  await Dismiss_Initial_Dialog_Box(page);

  //FILL THE REGISTRATION FORM ADEQUATELY.
  await driver.Register_new_random_user();

  

});


//LOGIN //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Verify the user can log into the system.
//Expects: Login is allowed. User preferences and settings are recovered.
test('KAN-12:[Authentication] Successful Authentication with Valid Credentials', async ({ page, request }) => {
  const driver= new Data_Dictionary(page, request);
  let step_counter=0

  
  //Go to Login page
  await test.step((++step_counter).toString()+'. Navigate to the application login page.', async () => {
    //ALWAYS EXECUTE THIS FUNCTION BEFORE TEST.
    await Dismiss_Initial_Dialog_Box(page);
    await driver.page.getByRole('button', { name: 'Show/hide account menu' }).click();
    await driver.page.getByRole('menuitem', { name: 'Go to login page' }).click();
    await expect (driver.Login_header).toBeVisible();
  });

  //Call get_LoginInfo to retrieve a set of email and password from JSON and use them for login
  const login_info:string[]= await driver.get_LoginInfo();

  await test.step((++step_counter).toString()+'. Enter a valid email into the Email field.', async () => {


    //Fill Email textbox with valid username.
    await driver.Login_Email_Textbox.fill(login_info[0]);
    
  });

  
  await test.step((++step_counter).toString()+'. Enter a corresponding password value into the password field.', async () => {
    //Fill Password textbox with corresponding password.
    await driver.Login_Password_Textbox.fill(login_info[1]);
  });

  await test.step((++step_counter).toString()+'. Click the "Log In" button.', async () => {
    //Wait until Log In button is enabled and click on it.
    await driver.LogIn_button.isEnabled();
    await driver.LogIn_button.click();
    await expect(driver.Product_Inventory).toBeVisible();
    //VERIFY ACCOUNT EMAIL
    await driver.Account_button.click();
    await expect (driver.Username_Label).toContainText(login_info[0]);//Email value

    //VERIFY TOKEN IS CREATED
    const cookies = (await page.context().cookies());

    //Verify cookie with name 'token' is available
    expect (cookies.some(cookie => cookie.name ==='token')).toBeTruthy();
  });


});

//Verify the user can log out the system. 
//Expects: User preferences/ settings should be hidden.
test('KAN-13:[Authentication]: User Account Logout and Session Invalidation', async ({ page, request }) => {
  const driver= new Data_Dictionary(page, request);
  let step_counter=0
  driver.login(false)
  
  await test.step((++step_counter).toString()+'. Click on the Account Settings button.', async () => {
    //ALWAYS EXECUTE THIS FUNCTION BEFORE TEST.
    await Dismiss_Initial_Dialog_Box(page);
    await driver.Account_button.click();
    await expect (driver.Logout_option).toBeVisible();

  });

  await test.step((++step_counter).toString()+'. Click on "Log Out" button.', async () => {
    
    await driver.Logout_option.click();
    await driver.Account_button.click();
    await expect (driver.Login_option).toBeVisible();
    const cookies = (await page.context().cookies());

    //Verify cookie with name 'token' is not available
    expect (cookies.some(cookie => cookie.name ==='token')).toBeFalsy();

  });

});

//Verify the user does not authorize login when username is correct but password is null
//Expects: Log In button is disabled.
test('Login fails when username is correct but password is null', async ({ page, request }) => {
  const driver= new Data_Dictionary(page, request);

  //ALWAYS EXECUTE THIS FUNCTION BEFORE TEST.
  await Dismiss_Initial_Dialog_Box(page);

  const user_info = await driver.get_LoginInfo();

  //Define correct username and NULL password.
  const username=user_info[0];
  const password="";

  //Go to Login page
  await driver.page.getByRole('button', { name: 'Show/hide account menu' }).click();
  await driver.page.getByRole('menuitem', { name: 'Go to login page' }).click();
  await expect (driver.Login_header).toBeVisible();

  //Leave both textboxes empty and verify Log In button is unreachable.
  await driver.bad_login(username,password);


});

//Verify the user does not authorize login when username is correct but password is null
//Expects: Log In button is disabled.
test('KAN-14: [Authentication] Authentication Attempt with Unregistered Email', async ({ page, request }) => {
  const driver= new Data_Dictionary(page, request);
  let step_counter=0;

  const user_info = await driver.get_LoginInfo();

  //Define Wrong username and any valid password.
  let email="Unregistered_Email@TEST.NET";
  const password=user_info[1];

  await test.step((++step_counter).toString()+'. Navigate to the login page.', async () => {
    
    //ALWAYS EXECUTE THIS FUNCTION BEFORE TEST.
    await Dismiss_Initial_Dialog_Box(page);



    //Go to Login page
    await driver.page.getByRole('button', { name: 'Show/hide account menu' }).click();
    await driver.page.getByRole('menuitem', { name: 'Go to login page' }).click();
    await expect (driver.Login_header).toBeVisible();

  });

  await test.step((++step_counter).toString()+'. Enter a non-registered email and a password value into corresponding fields.', async () => {
    
    await driver.Login_Email_Textbox.fill(email);
    await driver.Login_Password_Textbox.fill(password);

  });
  
  await test.step((++step_counter).toString()+'. Click the "Log In" button.', async () => {
    
    await driver.LogIn_button.click();
    await expect (driver.Product_Inventory).toBeHidden();
    await expect (driver.Login_header).toBeVisible();
    await expect (driver.Unsuccessful_login_msg).toBeVisible();

    //Clear textboxes
    await driver.Login_Email_Textbox.clear();
    await driver.Login_Password_Textbox.clear();

  });

  await test.step((++step_counter).toString()+'. Enter any registered email and swap between lowercase and uppercase alphabetic characters e.g. “validemail@test.net” → “VALIDEMAIL@TEST.NET”; and click on Log In button.', async () => {
    
    email=user_info[0].toLocaleUpperCase();
    await driver.Login_Email_Textbox.fill(email);
    await driver.Login_Password_Textbox.fill(password);

    await driver.LogIn_button.click();
    await expect (driver.Product_Inventory).toBeHidden();
    await expect (driver.Login_header).toBeVisible();
    await expect (driver.Unsuccessful_login_msg).toBeVisible();

  });


});

//Verify the user does not authorize login when username is correct but password is wrong
//Expects: Log In button is enabled AND Login is not allowed.
test('KAN-15: [Authentication] Authentication Attempt with Incorrect Password', async ({ page, request }) => {
  const driver= new Data_Dictionary(page, request);
  let step_counter=0;
    //Define correct username and WRONG password.
  const user_info = await driver.get_LoginInfo();

  const email=user_info[0];
  let password="Wrongpassword";
  
  await test.step((++step_counter).toString()+'. Navigate to the login page.', async () => {
    
    //ALWAYS EXECUTE THIS FUNCTION BEFORE TEST.
    await Dismiss_Initial_Dialog_Box(page);
    //Go to Login page
    await driver.page.getByRole('button', { name: 'Show/hide account menu' }).click();
    await driver.page.getByRole('menuitem', { name: 'Go to login page' }).click();
    await expect (driver.Login_header).toBeVisible();

  });

  await test.step((++step_counter).toString()+'. Enter a registered email into the Email field.', async () => {
    
    await driver.Login_Email_Textbox.fill(email);
    await expect (driver.Login_Email_Textbox).toHaveValue(email);

  });
    
  await test.step((++step_counter).toString()+'. Enter a wrong password into the password field.', async () => {
    
      await driver.Login_Password_Textbox.fill(password);
      await expect (driver.Login_Password_Textbox).toHaveValue(password);    

  });

  await test.step((++step_counter).toString()+'. Click the "Log In" button.', async () => {
      
    await driver.LogIn_button.click();
    await expect (driver.Product_Inventory).toBeHidden();
    await expect (driver.Login_header).toBeVisible();
    await expect (driver.Unsuccessful_login_msg).toBeVisible();
    
    //Clear textboxes
    await driver.Login_Email_Textbox.clear();
    await driver.Login_Password_Textbox.clear();
  });



  await test.step((++step_counter).toString()+'. Attempt to log in with a "correct" password plus a whitespace character at the end.', async () => {
   
    //Define a "correct" password with a space character at the end.
    password=user_info[1]+" ";
    
    await driver.Login_Email_Textbox.fill(email);
    await driver.Login_Password_Textbox.fill(password);
    
    await driver.LogIn_button.click();
    await expect (driver.Product_Inventory).toBeHidden();
    await expect (driver.Login_header).toBeVisible();
    await expect (driver.Unsuccessful_login_msg).toBeVisible();
    
    //Clear textboxes
    await driver.Login_Email_Textbox.clear();
    await driver.Login_Password_Textbox.clear();
  });

  //Fill both textboxes with correct username and wrong password and verify Login is unauthorized.

  await test.step((++step_counter).toString()+'. Attempt to log in with a "correct" password plus a whitespace character at the start.', async () => {
   
    //Define a "correct" password with a space character at the start.
    password=" "+user_info[1];
    
    await driver.Login_Email_Textbox.fill(email);
    await driver.Login_Password_Textbox.fill(password);

    await driver.LogIn_button.click();
    await expect (driver.Product_Inventory).toBeHidden();
    await expect (driver.Login_header).toBeVisible();
    await expect (driver.Unsuccessful_login_msg).toBeVisible();
    
    //Clear textboxes
    await driver.Login_Email_Textbox.clear();
    await driver.Login_Password_Textbox.clear();
  });


  await test.step((++step_counter).toString()+'. Attempt to log in with a lowercased "correct" password (Note: By default passwords are uppercased)', async () => {
   
    //Define a "CORRECT" password BUT with alphabetic characters lowercased or uppercased. As retrieved passwords ALWAYS are uppercased, then LOWERCASE method is called.
    password=user_info[1].toLocaleUpperCase();
    
    await driver.Login_Email_Textbox.fill(email);
    await driver.Login_Password_Textbox.fill(password);

    await driver.LogIn_button.click();
    await expect (driver.Unsuccessful_login_msg).toBeVisible();
    await expect (driver.Login_header).toBeVisible();
    await expect (driver.Product_Inventory).toBeHidden();
    

    
    //Clear textboxes
    await driver.Login_Email_Textbox.clear();
    await driver.Login_Password_Textbox.clear();
  });


});

//Verify the user does not authorize login when no data is given
//Expects: Log In button is disabled.
test('KAN-16: [Authentication] Empty Form Submission (UI Field Validation)', async ({ page, request }) => {

  const driver= new Data_Dictionary(page, request);
  let step_counter=0

  await test.step((++step_counter).toString()+'. Navigate to the application login page.', async () => {
    //ALWAYS EXECUTE THIS FUNCTION BEFORE TEST.
    await Dismiss_Initial_Dialog_Box(page);

    //Go to Login page
    await driver.page.getByRole('button', { name: 'Show/hide account menu' }).click();
    await driver.page.getByRole('menuitem', { name: 'Go to login page' }).click();
  });

  await test.step((++step_counter).toString()+'. Leave both the email and password fields completely empty.', async () => {
    //Define null username and password.
    const email="";
    const password="";

    //Leave both textboxes empty and verify Log In button is unreachable.
    //Fill Login form
    await driver.Login_Email_Textbox.fill(email);
    await driver.Login_Password_Textbox.fill(password);
  });

  await test.step((++step_counter).toString()+'. Observe the submission element and attempt to click "Log In".', async () => {
    await expect (driver.LogIn_button).toBeDisabled();
  });

});

//Verify the user does not authorize login when no data is given
//Expects: Log In button is disabled.
test('KAN-19: [Authentication] Post-Logout Browser History Back-Button Invalidation', async ({ page, request }) => {

  const driver= new Data_Dictionary(page, request);
  let step_counter=0;


  await test.step((++step_counter).toString()+'. Complete a manual log out from the application dashboard.', async () => {
    await Dismiss_Initial_Dialog_Box(page);
    await driver.login(false);
    
    //PERFORM A FEW OPERATIONS WHILE LOGGED IN: ADD PRODUCTS TO BASKET, START A NEW PURCHASE OPERATION, ETC...
    await page.getByLabel('Add to Basket').nth(Math.floor(Math.random()*15*0.99)).click();
    //CHECK BASKET ITEMS (QUANTITY)
    await expect(driver.BasketItemsCounter).toContainText("1")
    await page.getByLabel('Add to Basket').nth(Math.floor(Math.random()*15*0.99)).click();
    //CHECK BASKET ITEMS (QUANTITY)
    await expect(driver.BasketItemsCounter).toContainText("2")
    await page.getByLabel('Add to Basket').nth(Math.floor(Math.random()*15*0.99)).click();

    //CHECK BASKET ITEMS (QUANTITY)
    await expect(driver.BasketItemsCounter).toContainText("3")
    //LOG OUT
    driver.Logout()

  });

  await test.step((++step_counter).toString()+". Click the browser's native 'Back' arrow icon.", async () => {
    // NAVIGATE BACK
    await page.goBack()
    await expect(driver.BasketItemsCounter).toContainText("0")
  });

});

test('KAN-20: [Authentication] Local Storage Deletion Forceful Disconnect', async ({ page, context, request }) => {
  
  const driver= new Data_Dictionary(page, request);
  let step_counter=0;
  await Dismiss_Initial_Dialog_Box(page);
  await driver.login(false);


  // Logic Process Step 1: Human opens DevTools to inspect storage. Playwright uses `context.cookies()` to inspect the browser context's cookie storage programmatically.
  await test.step((++step_counter).toString()+". Open Browser Developer Tools (F12) and access the Application or Storage tab.", async () => {
    // Logic: Fetch all cookies for the current context and locate the JWT authentication token.
    const cookies = await context.cookies();
    const tokenCookie = cookies.find(c => c.name === 'token');

    // Logic: Assert that the token exists and contains data, confirming an active session.
    expect(tokenCookie).toBeDefined();
    expect(tokenCookie?.value.length).toBeGreaterThan(0);
  });

  // Logic Process Step 2: Human manually selects and deletes tokens in DevTools. Playwright executes this via `context.clearCookies()`.
  await test.step((++step_counter).toString()+". Select the application\'s authentication tokens and delete them manually.", async () => {
    // Logic: Purge all stored cookies from the active browser context to simulate manual DevTools deletion.
    await context.clearCookies({ name: 'token' });

    // Logic: Re-query cookies to verify the 'token' key no longer exists in storage.
    const postClearCookies = await context.cookies();
    const tokenCookieAfter = postClearCookies.find(c => c.name === 'token');
    expect(tokenCookieAfter).toBeUndefined();
  });

  // Logic Process Step 3: Human interacts with the page or reloads. Playwright uses `page.reload()` and URL/locator assertions.
  await test.step((++step_counter).toString()+".Click any link inside the authenticated application UI layout or refresh the browser.", async () => {
    // Logic: Reloading forces the SPA/Angular routing guard to evaluate auth state against local storage/cookies.
    await page.reload();

    // Logic: Verify that the router intercepts the missing token and redirects to the login route.
    await expect.soft(page).toHaveURL(/.*\/login/);

    // Logic: Confirm unauthenticated state visually by asserting the presence of the login button inside the Account menu.
    await driver.Account_button.click();
    await expect (driver.Login_option).toBeVisible();
  });
});

//Verify the user does not authorize login when username is correct but password is wrong
//Expects: Log In button is enabled AND Login is not allowed.
test('Login fails when a password is correct but username is wrong', async ({ page, request }) => {
  const driver= new Data_Dictionary(page, request);

  //ALWAYS EXECUTE THIS FUNCTION BEFORE TEST.
  await Dismiss_Initial_Dialog_Box(page);

  const user_info = await driver.get_LoginInfo();

  //Define WRONG username and correct password.
  let email="WrongEmail";
  const password=user_info[1];

  //Go to Login page
  await driver.page.getByRole('button', { name: 'Show/hide account menu' }).click();
  await driver.page.getByRole('menuitem', { name: 'Go to login page' }).click();
  await expect (driver.Login_header).toBeVisible();

  //Fill both textboxes with wrong username and correct password and verify Login is unauthorized.
  await driver.bad_login(email,password);

  //Define a "correct" email with a space character at the end.
  email=user_info[0]+" ";

  //Fill both textboxes with wrong username and correct password and verify Login is unauthorized.
  await driver.bad_login(email,password);

  //Define a "correct" email with a space character at the start.
  email=" "+user_info[0];

  //Fill both textboxes with wrong username and correct password and verify Login is unauthorized.
  await driver.bad_login(email,password);

  //Define a "CORRECT" email BUT with alphabetic characters lowercased or uppercased. As retrieved emails ALWAYS are uppercased, then LOWERCASE method is called.
  email=user_info[0].toLocaleLowerCase();

  //Fill both textboxes with wrong username and correct password and verify Login is unauthorized.
  await driver.bad_login(email,password);
});

//Verify the system is able to remember user credentials when user allows it through "Remember Me" checkbox.
//Expects: System remembers email and password

test('Remember Me functionality', async ({ page, request }) => {
  const driver= new Data_Dictionary(page, request);

  //ALWAYS EXECUTE THIS FUNCTION BEFORE TEST.
  await Dismiss_Initial_Dialog_Box(page);

  await driver.page.getByRole('button', { name: 'Show/hide account menu' }).click();
  await driver.page.getByRole('menuitem', { name: 'Go to login page' }).click();

  //Call get_LoginInfo to retrieve a set of email and password from JSON and use them for login
  const login_info:string[]= await driver.get_LoginInfo();

  //Fill Login form
  await driver.Login_Email_Textbox.fill(login_info[0]);
  await driver.Login_Password_Textbox.fill(login_info[1]);

  //Activate Remember Me checkbox
  await driver.Remember_Me_checkbox.click();
  await expect (driver.Remember_Me_checkbox).toBeChecked();

  //Wait until Log In button is enabled and click on it.
  await driver.LogIn_button.isEnabled();
  await driver.LogIn_button.click();
  await expect (driver.Product_Inventory).toBeVisible();

  //Log out
  await driver.Logout();
  await driver.Account_button.click();
  await expect (driver.Login_option).toBeVisible();
  await expect.soft (driver.Username_Label).toBeHidden();

//Go to Log In and verify previous login data is stored and visible for user.
  await driver.Login_option.click();
  await expect.soft (driver.Login_Email_Textbox).toHaveValue(login_info[0]);
  await expect.soft (driver.Login_Password_Textbox).toHaveValue(login_info[1]);
  await expect.soft (driver.Remember_Me_checkbox).toBeChecked();
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//PAYMENT FLOW
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

test('KAN-40: [Payment Flow] End-to-End Successful Checkout Order Execution (UI Layer)', async ({ page, request }) => {

  const driver= new Data_Dictionary(page, request);

  await test.step('1. Navigate to the basket, click "Checkout", select an existing delivery address, and proceed.', async () => {
      // Dismiss initial welcome banner if present
      //ALWAYS EXECUTE THIS FUNCTION BEFORE TEST.
      await Dismiss_Initial_Dialog_Box(page);

      // Login with valid credentials
      await driver.login(true)

      // Navigate to catalog and add an item to the basket
      await page.getByLabel('Add to Basket').nth(Math.floor(Math.random()*15*0.99)).click();
        await expect.soft(driver.BasketItemsCounter).toHaveText('1');
      await page.getByLabel('Add to Basket').nth(Math.floor(Math.random()*15*0.99)).click();
        await expect.soft(driver.BasketItemsCounter).toHaveText('2');
      await page.getByLabel('Add to Basket').nth(Math.floor(Math.random()*15*0.99)).click();

      // Verify basket counter updates to 3
      await expect.soft(driver.BasketItemsCounter).toHaveText('3');
    
      // Step through checkout: Basket -> Address -> Delivery -> Payment -> Summary
      await page.goto('http://localhost:3000/#/basket');
      await driver.Checkout_button.click();

      // Select first available address
      const selectAddressRadio = page.locator('mat-radio-button').first();
      await selectAddressRadio.click();
      await driver.DeliveryMethods_btn.click();
      await expect (page).toHaveURL(driver.Delivery_Options_URL)
      await expect (driver.Delivery_Options_header).toBeVisible();
  });
  await test.step('2. Select a delivery speed option and click "Continue".', async () => {
      
      // Select standard delivery speed
      const selectDeliveryRadio = page.locator('mat-radio-button').first();
      await selectDeliveryRadio.click();
      await driver.PaymentMethods_btn.click();
      await expect (page).toHaveURL(driver.Payment_Methods_URL)
      await expect (driver.Payment_Methods_header).toBeVisible();

  });
  await test.step('3. Select an existing valid credit card payment method and proceed to the Order Summary.', async () => {
     
      // Select existing payment card
      const selectCardRadio = page.locator('mat-radio-button').first();
      await selectCardRadio.click();
      await driver.Proceed_Review_btn.click();      
      await expect (page).toHaveURL(driver.Order_Summary_URL);
      await expect (driver.Order_Summary_header).toBeVisible();
  });
  
  await test.step('4. Click the "Place your order and pay" button.', async () => {
// Submit final order on Order Summary screen
      await driver.Complete_Purchase_btn.click();

      // Assert successful order completion view
      // Verify basket counter updates to 0
      await expect.soft(driver.BasketItemsCounter).toHaveText('0');
      await expect.soft(page).toHaveURL(/.*\/order-completion/);
      await expect.soft(page.locator('h1.confirmation')).toContainText('Thank you for your purchase!');
  });

});

test('KAN-44: [Payment Flow] Empty Basket Post-Purchase History Traversal Exploitation ', async ({ page, request }) => {
    const driver= new Data_Dictionary(page, request);

    await test.step('1. Authenticate and populate active basket', async () => {
      

      // Dismiss initial welcome banner if present
      //ALWAYS EXECUTE THIS FUNCTION BEFORE TEST.
      await Dismiss_Initial_Dialog_Box(page);
    

      // Login with valid credentials
      await driver.login(true)

      // Navigate to catalog and add an item to the basket
      await page.getByLabel('Add to Basket').nth(Math.floor(Math.random()*15*0.99)).click();
      await expect.soft(driver.BasketItemsCounter).toHaveText('1');
      await page.getByLabel('Add to Basket').nth(Math.floor(Math.random()*15*0.99)).click();
      await expect.soft(driver.BasketItemsCounter).toHaveText('2');
      await page.getByLabel('Add to Basket').nth(Math.floor(Math.random()*15*0.99)).click();
      
   

      // Verify basket counter updates to 3
    
      await expect.soft(driver.BasketItemsCounter).toHaveText('3');
    });

    await test.step('2. Complete checkout flow to trigger order finalization', async () => {
      // Step through checkout: Basket -> Address -> Delivery -> Payment -> Summary
      await page.goto('http://localhost:3000/#/basket');
      await driver.Checkout_button.click();

      // Select first available address
      const selectAddressRadio = page.locator('mat-radio-button').first();
      await selectAddressRadio.click();
      await driver.DeliveryMethods_btn.click();

      // Select standard delivery speed
      const selectDeliveryRadio = page.locator('mat-radio-button').first();
      await selectDeliveryRadio.click();
      await driver.PaymentMethods_btn.click();

      // Select existing payment card
      const selectCardRadio = page.locator('mat-radio-button').first();
      await selectCardRadio.click();
      await driver.Proceed_Review_btn.click();

      // Submit final order on Order Summary screen
      await driver.Complete_Purchase_btn.click();

      // Assert successful order completion view
      await expect.soft(page).toHaveURL(/.*\/order-completion/);
      await expect.soft(page.locator('h1.confirmation')).toContainText('Thank you for your purchase!');
    });

    await test.step('3. Trigger browser back button and verify security routing enforcement', async () => {
      // Simulate human tester clicking browser "Back" button post-purchase
      await page.goBack();

      // SECURITY ASSERTION:
      // The router guard MUST catch the empty basket state (0 items) and redirect out of private payment views.
      // If the app allows staying on /payment, /delivery-method, or /order-summary with 0 items, flag as defect.
      
      const currentUrl = page.url();
      const isRedirectedToSafeRoute = currentUrl.includes('/search') || currentUrl.includes('/basket');

      // Explicitly check that the app doesn't leave order placement action buttons active on an empty basket
      const isCheckoutButtonPresent = await driver.Complete_Purchase_btn.isVisible();

      if (isCheckoutButtonPresent) {
        // Assert button is disabled or page throws error when attempting double transaction
        await expect.soft(driver.Complete_Purchase_btn).toBeDisabled();
      }

      // Fail test if application still exposes active payment screens without redirection
      expect.soft(isRedirectedToSafeRoute).toBeTruthy();
    });

  });


//#################################################################################################################################################
//END OF TEST SPECIFICATION
//#################################################################################################################################################


//MISCELLANEOUS###########################################################################################################################################

//IMPORTANT: This method is created to dismiss dialog box every time browser is started, so current test can go ahead.
async function Dismiss_Initial_Dialog_Box(function_page:any){
  
    //Go to localhost page
    await function_page.goto('http://localhost:3000/#/');
    //Look for dialog box.
    await function_page.locator('div').filter({ hasText: 'Welcome to OWASP Juice Shop!' }).nth(4).toBeVisible;
    //Close the dialog box.
    await function_page.getByRole('button', { name: 'Close Welcome Banner' }).click();
    //Close banner
    await function_page.getByRole('dialog', { name: 'cookieconsent' }).toBeVisible;
    await function_page.getByRole('button', { name: 'dismiss cookie message' }).click();
    await function_page.getByRole('dialog', { name: 'cookieconsent' }).toBeHidden;
  }
