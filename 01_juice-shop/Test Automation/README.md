<h1>Test Automation</h1>
<br><br>
<p align="center">
<a target="blank"><img align="center" src="https://testrigor.com/wp-content/uploads/2022/01/7-Features-of-a-Good-Automated-Test.jpeg"  height="512" width="512" /></a>
</p>
<br><br>
This folder includes the files required to set up a CI/CD pipeline which tests the OWASP Juice Shop platform when there is a change in the code, with the idea of performing a smoke test on the most recent software in order to detect any anomalies into it and report software is actually good to start more tests on it.
<br><br>
<b>IMPORTANT:</b> Do not modify the content of the files included in this folder as any small change may break the CI/CD pipeline.<br><br>

<h2>Directory</h2><br>
+ <b>github/workflows</b>: This folder contains the required files to trigger automated test execution every time a new commit at code is detected. <br><br>
+ <b>Test_data</b>: In this folder there are files that complement the main test cases files, for instance the custom libraries used along the tests which help to keep the automation code readable and maintainable under a Page Model Object (POM) structure.<br><br>
+ <b>playwright-report</b>: Here, test reports from automated execution are stored.<br><br>
+ <b>tests</b>: This folder includes the test specification files where all automation scripts are written.<br><br>
