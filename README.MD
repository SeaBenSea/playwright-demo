# Playwright Tests for AutomationExercise.com

This repository contains end-to-end (E2E) test suites and API test suites built with [Playwright](https://playwright.dev/) and [Node.js](https://nodejs.org/). These tests target [Automation Exercise](https://www.automationexercise.com/) to demonstrate user authentication flows and other scenarios based on their [test cases](https://www.automationexercise.com/test_cases).

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [Usage](#usage)
6. [Configuration](#configuration)
7. [Continuous Integration](#continuous-integration)
8. [Contributing](#contributing)
9. [License](#license)

---

## Overview

- **Framework**: [Playwright](https://playwright.dev/)
- **Language**: JavaScript (Node.js)
- **Test Runner**: [@playwright/test](https://playwright.dev/docs/test-intro)
- **CI**: GitHub Actions

---

## Features

- **Fully Parallelized**: Playwright’s parallel execution for faster feedback.
- **Cross-Browser Tests**: Configured to run in Chromium by default (easily extendable to Firefox and WebKit).
- **Mocking & Assertions**: [Playwright’s powerful fixtures and test assertions](https://playwright.dev/docs/test-assertions).
- **Automatic Reporting**: Generates HTML, JSON, and GitHub Actions-friendly reports.
- **GitHub Actions**: Automated tests run on every push or pull request.

---

## Project Structure

```plaintext
├── .github/
│   └── workflows/
│       └── playwright.yml          # GitHub Actions workflow for running tests
├── tests/
│   ├── e2e/                        # API test files
│   ├── helpers/
│   └── api/                        # API test files
├── .gitignore
├── package.json
├── playwright.config.js            # Core Playwright configuration
├── yarn.lock / package-lock.json   # (Depending on your package manager)
└── README.md
```

## Distribution of the Test Cases

```plaintext
.
├─ tests/
│  ├─ cart.e2e.test.js           // covers TCs 12, 13, 17, 20, 22
│  ├─ contact.e2e.test.js        // covers TC 6
│  ├─ navigation.e2e.test.js     // covers TCs 7, 25, 26
│  ├─ order.e2e.test.js          // covers TCs 14, 15, 16, 23, 24
│  ├─ product.e2e.test.js        // covers TCs 8, 9, 18, 19, 21
│  ├─ subscription.e2e.test.js   // covers TCs 10, 11
│  └─ user-auth.e2e.test.js      // covers TCs 1, 2, 3, 4, 5
```

**Note**: TC23 is not covered seperately as it is covered in the TC14, TC15, TC16.

### Key Directories & Files

- **`tests/e2e`**: All end-to-end tests, each focusing on a specific suite or feature.
- **`tests/helpers`**: Utility functions and modules (e.g., user data generation, common flows like `registerUser`).
- **`.github/workflows/playwright.yml`**: Defines continuous integration steps on GitHub Actions.
- **`playwright.config.js`**: Central configuration for browser settings, timeouts, environment, etc.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)

### Installation

1. **Clone this repository**:

   ```bash
   git clone https://github.com/your-username/playwright-demo.git
   cd playwright-demo
   ```

2. **Install dependencies**:

   ```bash
   # If using Yarn
   yarn install

   # Or using npm
   npm install
   ```

3. **Install Playwright browsers**:

   ```bash
   # Yarn
   yarn playwright install --with-deps

   # npm
   npx playwright install --with-deps
   ```

---

## Usage

### Run All Tests

```bash
# With Yarn
yarn playwright test

# With npm
npx playwright test
```

### Run a Specific Project

This project includes two “projects” in `playwright.config.js`: `e2e` (UI tests) and `api` (API tests, if any).

```bash
# E2E tests only
yarn test:e2e

# API tests only
yarn test:api
```

### Open the Test Report

After tests finish, an HTML report is generated in the `/reports` or `/playwright-report` directory (based on your config).

```bash
yarn playwright show-report
```

---

## Configuration

Most test settings (timeouts, browsers, parallelization) are configured inside [`playwright.config.js`](./playwright.config.js). Key options include:

- **`retries`**: Number of times to retry failing tests.
- **`reporter`**: Reporters for console, HTML, JSON, or GitHub.
- **`use`**: Default test settings (e.g., browser, viewport, tracing, screenshots).
- **`projects`**: Separate config for E2E vs. API tests (different base URLs, etc.).

Update these as needed for your environment (e.g., adjusting `headless`, specifying different base URLs).

---

## Continuous Integration

This repo is preconfigured to run tests in GitHub Actions whenever code is pushed to `main` or when a pull request is opened. The [workflow file](.github/workflows/playwright.yml) includes steps to:

1. Checkout code
2. Install Node.js
3. Install Playwright browsers
4. Execute all tests
5. Upload the Playwright report as an artifact

If tests pass, the build will succeed. If not, you can review logs and attached artifacts on the GitHub Actions page.

---

## Contributing

We welcome contributions, bug reports, and feature requests. To contribute:

1. **Fork** the repository.
2. **Create** a new feature branch.
3. Submit a **Pull Request** explaining your changes.

Please ensure tests pass locally before submitting your PR.

---

## License

This project is licensed under the [MIT License](LICENSE). You are free to use and adapt this repository for your own projects.

---

**Happy Testing!** If you have any questions or suggestions, feel free to open an issue or submit a pull request.
