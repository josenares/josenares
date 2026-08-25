</b><h1>OWASP Juice Shop</h1> 
<p align="left">
<a href="https://clouddocs.f5.com/training/community/waf/html/_images/udf_juice_shop1.png" target="blank"><img align="center" src="https://clouddocs.f5.com/training/community/waf/html/_images/udf_juice_shop1.png" alt="link" height="795" width="1389" /></a>
</p>



This is a small project mainly dedicated for QA engineers training where the website author creates a small online-shop. As a training-site, the author leaves (intentionally) different bugs and vulnerabilities along the software layers: UI, API, and security, so a QA engineer can detect them via manually and through automation tools. This project is containerized in Docker, so an image needs to be pulled into the test environment so the platform can be used properly. For more details about this site please visit the following link below:
https://owasp.org/www-project-juice-shop/

The 01_juice-shop folder manages different kind of documents in order to explain the overall test strategy, document a few sample test cases to describe the methodology used to develop them, and finally includes sub-directories which have the required workflow for CI/CD pipeline automation which is triggered everytime a new commit is pushed. Also, the files that include the automation code and the required custom libraries (which use the Page Object Model) is allocated in the 'tests' and 'Test_data' folders.




