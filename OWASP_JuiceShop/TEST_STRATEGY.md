<h1>TEST STRATEGY</h1>


Document ID: QA-STRATEGY-JUICESHOP

Version: 1.0.0

Author: José Javier Nares

Environment: Isolated Docker Container (localhost:3000)



<h2>1. General Objective</h2>

To ensure the comprehensive quality of the OWASP Juice Shop web application through a multi-dimensional and balanced testing approach that mitigates business risks from three technical pillars:

    API Perspective: Corroborate that transactions and data contracts between the Frontend (Angular SPA) and Backend (Node.js/Express) occur correctly and securely using schema assertions and HTTP status codes.

    E2E / UI Perspective: Verify that the system executes core business workflows (Happy Paths and high-priority alternate paths) from end to end by emulating real user behavior in the browser.

    Security Perspective: Test system weaknesses and identify vulnerabilities using Pentesting techniques and static analysis, guaranteeing an advanced understanding of data exposure risks.

    

<h2>2. Test Scope</h2>


🟢 In Scope (Core Business)

    Account Management: User registration workflows, Login/Logout, and session persistence (JWT Tokens).

    E2E Purchase Flow: Product searching, adding items to the shopping cart, quantity management, address configuration, simulated payment gateway selection, and order confirmation.

    Service Layer (REST API): Endpoints linked to /api/Users, /api/Cards, /rest/user/login, and /api/Products.

    Security (OWASP Top 10): Input sanitization (SQLi, XSS) in Login and Search forms, alongside Docker container vulnerability scanning.

🔴 Out of Scope & Justification

    Performance Testing (Load/Stress): Excluded in this iteration. Running tests against an ephemeral, in-memory SQLite database in a local environment would generate hardware bottlenecks on the host machine, corrupting production-like infrastructure metrics.

    Resilience / Robustness Testing (Chaos Engineering): Forcing database drops or abrupt container network disconnections will not be performed due to tool and time constraints, prioritizing business logic stability.

    

<h2>3. Testing Levels, Methodology, and Design Techniques</h2>


<h3>3.1 Testing Levels</h3>

    Component / Integration Testing (API Layer): Isolating the service layer to ensure HTTP request and response integrity prior to visual rendering.

    System / End-to-End Testing (UI Layer): Verifying complete business flows by simulating real user interaction with the DOM.

<h3>3.2 Testing Methodology</h3>

An agile and independent hybrid approach will be adopted:

    Exploratory Testing (Session-Based): Time-boxed sessions (45 to 60 minutes) guided by specific Charters to discover unexpected UX behaviors and edge-case business logic.

    Automation-Driven Testing (Shift-Left): Any functional test validated during the exploratory process that belongs to a critical flow will be automated within the API and UI suites to be integrated into the CI/CD pipeline, guaranteeing automatic regressions.

<h3>3.3 Test Design Techniques</h3>

To maximize test coverage with the minimum number of scenarios, black-box analytical techniques will be applied to form fields (Registration, Login, Cart):

    Equivalence Partitioning (EP): Classifying inputs into valid and invalid datasets.

    Boundary Value Analysis (BVA): Testing boundaries on fields (e.g., minimum/maximum password lengths).

    Error Guessing: Experience-based injection of special characters (', <, >, ../) to identify input sanitization failures.

    

<h2>4. Entry and Exit Criteria (Gatekeeping)</h2>

An autonomous container-based approach proposal:


<h3>ENTRY CRITERIA</h3>
- Docker image pulled and container status is active (Up).
- Port 3000 is locally accessible (Health Check OK).      
- Git repository initialized with base folder structure.  



<h3>EXIT CRITERIA</h3>
- 100% of critical E2E flows automated and status is PASS.
- 100% of core endpoints validated with strict assertions.
- CI/CD pipeline runs a clean test suite (Zero Flakiness).
- Every failure (FAIL) documented with an open Bug Ticket.




<h2>5. Defect Management Process & Templates (Bugs)</h2>
Bug Reporting Process

Every time a manual or automated test results in a FAIL, technical evidence (console errors, logs, or screenshots) will be captured, and a defect ticket will be opened immediately using GitHub Issues (via Markdown templates) or a local Jira board.
📄 Markdown Bug Ticket Template
Markdown

#### [BUG] Short, descriptive title of the failure (e.g., Login fails when password contains special characters)

##### 📌 Metadata
* **Severity:** High | **Priority:** High
* **Environment:** Local Docker Container (Juice Shop v16.0.0)
* **Layer:** UI / API

##### 🎬 Steps to Reproduce
1. Navigate to `http://localhost:3000/#/register`
2. Create a user with password `Test'1234`
3. Try to log in using the newly created credentials at `http://localhost:3000/#/login`

##### 📉 Observed Result
The application freezes on the login screen, and a `500 Internal Server Error` is thrown in the network tab.

##### 📈 Expected Result
The user should authenticate successfully and be redirected to the homepage, or receive a clear validation message.

##### 🛠️ Technical Evidence & Logs
* **API Payload Response:** `{ "error": "SequelizeDatabaseError: SQLite syntax error..." }`
* ![Screenshot/Video Link](URL_to_evidence_image)




<h2>6. Test Results Reporting Process & Templates</h2>
Results Reporting Process

Upon completing a test cycle or a pipeline execution, metrics will be consolidated. For automation, HTML test report generators will be integrated into the framework (Allure Reports or native Playwright Reports). For the overall engineering process, a Test Summary Report will be documented directly in the main README.md.
📄 Test Summary Template
Markdown

## 📊 Test Summary Report - Execution # [Run_ID]

### 📈 Executive Metrics
| Layer | Total Tests | Pass | Fail | Blocked | Success Rate |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **API (Postman)** | 25 | 25 | 0 | 0 | 100% |
| **UI/E2E (Playwright)** | 12 | 11 | 1 | 0 | 91.6% |
| **Security** | 5 | 2 | 3 | 0 | 40.0% |

### 🚨 Known Issues (Open Defects)
* #ISSUE-12: SQL Injection vulnerability allows authentication bypass on Login field (Severity: Critical).
* #ISSUE-15: E2E Checkout fails intermittently due to dynamic loading elements (Severity: Medium).

### 💡 QA Deployment Verdict
⚠️ **CONDITIONAL PASS:** Core functionality is robust and fully automated, but security vulnerabilities (expected by environment design) prevent deployment to a real public staging environment without proper hotfixes.




<h2>7. Risk Matrix & Mitigations</h2>
ID	Risk Type	Risk Description	Impact	Probability	Mitigation Strategy (Senior QA Action)
R-01	Product (Security)	Being vulnerable by design, real external attacks could compromise the container if the local port is exposed to a public network.	High	Medium	Enforce inside the docker-compose.yml file that the port maps strictly to the local loopback interface: 127.0.0.1:3000:3000.
R-02	QA (Instability)	Angular frontend asynchrony causes Flaky Tests (false negatives) in the UI automation when the host machine experiences CPU spikes.	Medium	High	Forbid the use of fixed hardcoded sleeps. Exclusively implement Web-First Assertions with dynamic, auto-retrying waits based on DOM states.
R-03	Test Data	Restarting the Docker container to wipe previous runs clears the SQLite database completely, breaking persistence for subsequent UI tests.	High	High	Design independent and autonomous automation scripts. Every test must inject its own prerequisite data (e.g., register a user via API before running the UI checkout test with that user).


<h2>8.Test Data Management (TDM) Strategy</h2>

    Senior Engineering Rationale: In single-engineer and automated environments, 80% of pipeline failures are not actual software bugs, but data collisions (attempting to register an existing user, using a cart with old session data, etc.). Clear control over test data demonstrates advanced technical ownership.

Test Data Guidelines for the Monorepository:

    Isolating via Prefixes: All data generated by automation tools will use dynamic random data generators (such as Faker libraries) or will carry a strict QA_AUTO_ prefix. This simplifies data tracking in execution reports and network traffic inspection.

    Ephemeral Environment Lifecycle: At the beginning of every full regression pipeline execution, a terminal script command (docker compose down && docker compose up -d) will run to guarantee a "Clean State" environment. Both API and UI test suites always assume the system begins completely empty.
