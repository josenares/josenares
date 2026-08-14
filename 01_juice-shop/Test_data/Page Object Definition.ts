import {APIResponse, expect} from '@playwright/test';
import * as fs from 'fs';

interface UserEntry {
  id: number;
  email: string;
  password: string; // WARNING: Never store plain text passwords in production
  uniqueAnswer: string;
}

export class Data_Dictionary{
    page:any
    request:any
    Account_button:any
    Login_option:any
    Logout_option

    //USER REGISTRATION PAGE
    UserRegistration_header: any
    Register_Email_textbox : any
    Register_Password_textbox:any
    RepeatPassword_textbox:any
    SelectQuestion_dropdown:any
    SelectQuestion_Option:any
    Answer_Textbox:any
    Register_button:any

    //LOGIN PAGE
    Login_header: any
    Forgot_your_Password_link:any
    Login_Email_Textbox:any
    Login_Password_Textbox:any
    LogIn_button:any
    View_Hide_Password_icon:any
    Not_yet_a_customer_link :any
    Unsuccessful_login_msg:any
    Remember_Me_checkbox

    Product_Inventory:any

    //PRODUCTS PAGE
    Username_Label:any
    BasketItemsCounter

    //PAYMENT
    Checkout_button
    DeliveryMethods_btn
    Payment_Methods_URL
    Payment_Methods_header
    PaymentMethods_btn
    Proceed_Review_btn
    Order_Summary_header
    Order_Summary_URL
    Complete_Purchase_btn
    Delivery_Options_header
    Delivery_Options_URL


  constructor(page:any, request:any){
          this.page=page;
          this.request=request
          this.Account_button = page.getByRole('button', { name: 'Show/hide account menu' });
          this.Login_option = page.getByRole('menuitem', { name: 'Go to login page' });
          this.Logout_option = page.getByRole('menuitem', { name: 'Logout' });




          //USER REGISTRATION PAGE
          this.UserRegistration_header = page.getByRole('heading', { name: 'User Registration' });
          this.Register_Email_textbox = page.getByRole('textbox', { name: 'Email address field' });
          this.Register_Password_textbox = page.getByRole('textbox', { name: 'Field for the password' });
          this.RepeatPassword_textbox = page.getByRole('textbox', { name: 'Field to confirm the password' });
          this.SelectQuestion_dropdown = page.locator('div').filter({ hasText: 'Security Question' }).nth(4);
          this.SelectQuestion_Option = page.getByRole('option', { name: 'Your favorite book?' });
          this.Answer_Textbox = page.getByRole('textbox', { name: 'Field for the answer to the' });
          this.Register_button = page.getByRole('button', { name: 'Button to complete the' });

          //LOGIN PAGE
          this.Login_header = page.getByRole('heading', { name: 'Login' });
          this.Login_Email_Textbox = page.getByRole('textbox', { name: 'Text field for the login email' });
          this.Login_Password_Textbox= page.getByRole('textbox', { name: 'Text field for the login password' });
          this.LogIn_button = page.locator('//*[@id="loginButton"]');
          this.Forgot_your_Password_link = page.getByRole('link', { name: 'Forgot your password?' });
          this.View_Hide_Password_icon = page.getByRole('button', { name: 'Button to display the password' });
          this.Not_yet_a_customer_link = page.getByRole('link', { name: 'Not yet a customer?' });
          this.Unsuccessful_login_msg = page.getByText('Invalid email or password.');
          this.Remember_Me_checkbox = page.getByRole('checkbox', { name: 'Checkbox to stay logged in or' });

          //PRODUCTS PAGE
          this.Product_Inventory = page.getByText('All ProductsApple Juice (');
          this.Username_Label = page.getByRole('menuitem', { name: 'Go to user profile' });
          this.BasketItemsCounter=page.locator("//button[@aria-label='Show the shopping cart']//span[@class='fa-layers-counter fa-layers-top-right fa-3x warn-notification']")

          //PAYMENT FLOW
          this.Checkout_button= page.getByRole('button', { name: 'Checkout' })
          this.DeliveryMethods_btn = page.getByRole('button', { name: 'Proceed to payment selection' })
          this.Delivery_Options_URL="http://localhost:3000/#/delivery-method";
          this.Delivery_Options_header = page.getByRole('heading', { name: 'Choose a delivery speed' })
          this.Payment_Methods_URL = "http://localhost:3000/#/payment/shop";
          this.Payment_Methods_header = page.getByRole('heading', { name: 'My Payment Options' });
          this.PaymentMethods_btn = page.getByRole('button', { name: 'Proceed to delivery method' })
          this.Proceed_Review_btn = page.getByRole('button', { name: 'Proceed to review' })
          this.Order_Summary_URL = "http://localhost:3000/#/order-summary";
          this.Order_Summary_header = page.getByText('Order Summary');
          this.Complete_Purchase_btn = page.getByRole('button', { name: 'Complete your purchase' })
  }

  //USER REGISTRATION: Method to create a random string to generate a set of email and password.
  generateRandomUser(): string {
    //Defined format for email string: "USER<random string built by a random 3-uppercased letter substring followed by a random 5-digit number>@TEST.NET"
    const prefix = "user";
    const suffix = "@test.net";
    
    // Generate 3 random uppercase letters
    const letters = Array.from({ length: 3 }, () => 
      String.fromCharCode(Math.floor(Math.random() * 25.9) + 97)//There was a possibility to get Math.random()=1 where I could get fromCharCode(123)==> '[' (invalid email char) after using multiply factor of 26. I just decreased that factor a bit, so parameter never reaches 91.
    ).join('');
    
    // Generate 5 random numeric digits
    const digits = Array.from({ length: 5 }, () => 
      Math.floor(Math.random() * 9.9).toString()//Changed multiply factor from 10 to 9.9.
    ).join('');
    
    return `${prefix}${letters}${digits}${suffix}`;
  }

  //USER REGISTRATION: Method to add a new user data into JSON file.
  async addEntryToFile(
    email: string,
    password: string,
    uniqueAnswer: string
  ): Promise<void> {

    try {
      
      // Ensure the file exists, if not create an empty array
      let data: UserEntry[] = [];
      
      if (fs.existsSync("../01_juice-shop/Test_data/UsersList.json")) {
        const fileContent = fs.readFileSync("../01_juice-shop/Test_data/UsersList.json", 'utf-8');
        // Handle empty file or invalid JSON gracefully
        data = fileContent.trim() ? JSON.parse(fileContent) : [];
        
        if (!Array.isArray(data)) {
          throw new Error('JSON file must contain an array of entries');
        }
      }

      // Calculate the new ID based on the current number of entries
      const newId = data.length + 1;

      console.log("New user data:\nID:"+newId+"\nEmail:"+email+"\nPassword:"+password+"\nAnswer:"+uniqueAnswer+"\nCapture this information into JSON file manually if registration fails.");

      const newEntry: UserEntry = {"id": newId,"email": email,"password": password,"uniqueAnswer": uniqueAnswer};

      // Add the new entry to the array
      data.push(newEntry);

      // Write the updated array back to the file with pretty formatting
      fs.writeFileSync("../01_juice-shop/Test_data/UsersList.json", JSON.stringify(data, null, 2), 'utf-8');

      console.log(`Successfully added entry with ID: ${newId}`);

    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error('Error: The JSON file is corrupted or invalid.');
      } else {
        console.error('Error adding entry:', error);
      }
      throw error;
    }
  }

  //USER REGISTRATION: Method to register a new user using email and password.
  async Register_new_random_user(): Promise<string[]> {
      const email = this.generateRandomUser();//USES CUSTOM FUNCTION TO GENERATE A RANDOM EMAIL
      const password = email.substring(4,12);//USERXYZ12345@TEST.NET => XYZ12345
      const unique_answer = password;

      await this.page.goto('http://localhost:3000/#/register');
      await expect(this.page.getByRole('heading', { name: 'User Registration' })).toBeVisible();
    
      //EMAIL
      
      await this.Register_Email_textbox.fill(email);
    
      //PASWORD
      await this.Register_Password_textbox.fill(password);//Get ID from generateRandomID a use it as password.
      
      //REPEAT PASSWORD
      await this.RepeatPassword_textbox.fill(password);
    
      //SELECT A SECRET QUESTION
      await this.SelectQuestion_dropdown.click();
      await this.SelectQuestion_Option.click();
    
      //TYPE UNIQUE ANSWER IN
      await this.Answer_Textbox.fill(unique_answer);
    
      //CLICK ON REGISTER
      await this.Register_button.isEnabled();
      await this.Register_button.click();

      //LOOK FOR BOTH API RESPONSE AND UI
      //API
      //<pending>
      //UI
      await expect (this.Login_header).toBeVisible();


      //RETURN VALUES TO CALLING METHOD
      let array:string[] = ["",""];
      array[0] = email;
      array[1] = password;

      //CALL FUNCTION TO ADD NEW ENTRIES TO A JSON FILE
      this.addEntryToFile(email,password,unique_answer); 
      
      return array;
    
  

  }

  //LOGIN: Method to attempt to log in with specified credentials.
  //Requires a boolean-type parameter: if TRUE is set, login is done with default admin credentials, ELSE it uses a random registered account.
  //Why a boolean is required as function parameter? Some tests require to have already a payment and delivery methods to be defined prior a purchase is completed. In order to skip the processes to define them, an admin account login is done to complete the test case in a straightforward way as both methods are already set.
  async login(admin:boolean):Promise<string>{
    
    //Go to Login page
    await this.page.getByRole('button', { name: 'Show/hide account menu' }).click();
    await this.page.getByRole('menuitem', { name: 'Go to login page' }).click();

    let login_info:string[];

    //ADMIN=TRUE; Uses default admin credentials
    //ADMIN= FALSE; Call get_LoginInfo to retrieve a set of email and password from JSON and use them for login
    admin==true? login_info=['admin@juice-sh.op','admin123'] : login_info= await this.get_LoginInfo();

    //Fill Login form
    await this.Login_Email_Textbox.fill(login_info[0]);
    await this.Login_Password_Textbox.fill(login_info[1]);

    //Wait until Log In button is enabled and click on it.
    await this.LogIn_button.isEnabled();
    await this.LogIn_button.click();
    await expect(this.Product_Inventory).toBeVisible();

    return login_info[0];

  }

  //LOGIN: Method to retrieve login info from a random entry from a JSON file. This guarantees login method can be performed successfully.
  async get_LoginInfo(): Promise<string[]> {
    try {

      // Read and parse the JSON file
      const data = JSON.parse(fs.readFileSync("../01_juice-shop/Test_data/UsersList.json", 'utf8'));

      // Ensure the data is an array
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("JSON file must contain a non-empty array of entries.");
      }

      // Generate a random index (0-based)
      const randomIndex = Math.floor(Math.random() * data.length * 0.99); //To avoid exception 'out of range' when Math.random = 1
      const entry = data[randomIndex];

      // Check if the entry has the required fields
      if (!('email' in entry) || !('password' in entry)) {
        throw new Error("Selected entry is missing 'email' or 'password'.");
      }

      return [entry.email,entry.password];
      

    } catch (error: any) {
      console.error("Error reading JSON file:", error.message);
      throw error;
    }
  }

  //LOGIN: Method to attempt to log in with incorrect credentials.
  async bad_login(email:string, password:string){
    
    //Fill Login form
    await this.Login_Email_Textbox.fill(email);
    await this.Login_Password_Textbox.fill(password);

    //If either email or password are NULL, check Log In button is disabled...
    if(email.length==0 || password.length==0)
      await expect (this.LogIn_button).toBeDisabled();

    //..else, wait until Login button is enabled, click on it and expect Login not allowed.
    else{
      await expect (this.LogIn_button).toBeEnabled();
      await this.LogIn_button.click();
      await expect (this.Product_Inventory).toBeHidden();
      await expect (this.Login_header).toBeVisible();
      await expect (this.Unsuccessful_login_msg).toBeVisible();

    }
    //Clear textboxes
    await this.Login_Email_Textbox.clear();
    await this.Login_Password_Textbox.clear();
    

  }

  //LOGIN: Method to log out from current session.
  async Logout(){

      await this.Account_button.click();
      await this.Logout_option.click();
  }

  //API############################################################################################################################################

  //FUNCTION TO GENREATE A NEW USER BY SENDING THE REQUIRED DATA: EMAIL, PASSWORD, SECRET QUESTION (FIXED) AND UNIQUE ANSWER
  //This function generates a random email with the following structure: "user+<random substring of 3 lowercase characters><random subtring of 5 numeric digits>@test.net"
  async API_Register_a_new_user():Promise<APIResponse>{

    const email = this.generateRandomUser();//USES CUSTOM FUNCTION TO GENERATE A RANDOM EMAIL
    const password = email.substring(4,12);//USERXYZ12345@TEST.NET => XYZ12345
    const unique_answer = password;

    const response = await this.request.post('http://localhost:3000/api/Users/',
    
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
        "passwordRepeat": password,
        "securityAnswer": unique_answer,
        "securityQuestion": {
            "question": "Mother's maiden name?"
        }
      }
    })

   //CALL FUNCTION TO ADD NEW ENTRIES TO A JSON FILE
    if(response.status() == 201)
    this.addEntryToFile(email,password,unique_answer); 

    return response
  }
  async API_Attempt_Register_a_new_user(email:string, password:string, repeatpassword:string, secretquestion:string, unique_answer:string):Promise<APIResponse>{

    const response = await this.request.post('http://localhost:3000/api/Users/',
    
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
        "passwordRepeat": repeatpassword,
        "securityAnswer": unique_answer,
        "securityQuestion": {
            "question": secretquestion
        }
      }
    })

    return response
  }
  
  async API_Login():Promise<APIResponse>{
   
    const user_info = await this.get_LoginInfo();

    const response = await this.request.post('http://localhost:3000/rest/user/login',

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
        "password": user_info[1],
    }
    })

    return response
  }

  async API_Search_for(keyword: string):Promise<APIResponse>{ 

    const response = await this.request.get('http://localhost:3000/rest/products/search?q='+keyword)
    return response

  }
}

