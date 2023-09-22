<div align="center">

  
| Nome     |      Email    |
|----------|:-------------:|
| Adriano Dias Alves da Silva    |   adriano.silva.pb@compasso.com.br      |
| Gustavo Reis Souza Lima        |   gustavo.lima.pb@compasso.com.br       |
| Leticia Machado Lopes          |   leticia.lopes.pb@compasso.com.br      |
| Lucas Scommegna                |   lucas.scommegna.pb@compasso.com.br    |
| Vinicius Augusto Sakamoto      |   vinicius.sakamoto.pb@compasso.com.br  |

  
</div>


---------------------------------------------------------------------


<div align="center">
<a href="/">
  <img src="https://stc.uol.com/g/sobreuol/images/footer/compass-logo.svg?v=3.9.44" alt="compassuol" width="200">
</a>
</div>

# Challenge #01 - Node - API Classroom

## Description
This api serves to a platform which is focused on mentorship through synchronous online classes. The mentors being specialized in a subject, only being able to minister this subject, and the mentoree can enroll in as many as possible classes. This approach offers specialized knowledge, flexibility of choice, and interactivity, fostering dynamic and collaborative virtual classrooms. Features like class recordings, assessments, and personalized feedback ensure an enriching learning experience

## Tech Stack

1. Node.js (v18.17.1) LTS
2. Typescript (v5.1.6)
3. Express (v4.18.2)
4. Mongoose (v7.4.3)
5. @Types/MongoDB (v4.0.7) 
6. Imsomnia
7. Jest (v29.6.2)

## Pre-requisites

Before running the project, make sure you have the following installed on your system:

1. [Node.js](https://nodejs.org/) (v18.17.1 or later)
2. [npm](https://www.npmjs.com/) (usually comes with Node.js)


## How to Run Locally

To run the project locally on your machine, follow the steps below:

### Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/Squad-Atlas/atlas-challenger.git

2. Navigate to the project directory:
   
   ```bash
   cd atlas-challenger

3. Install the required dependencies:

   ```bash
   npm install

## Setting Up Environment Variables

Before running the project, you'll need to set up your environment variables. Follow these steps:

Create a new file in the root directory of the project and name it `.env.`

Copy the contents from `.env.example` into the newly created `.env` file.

Now, open the .env file with a text editor of your choice and provide the required values for each environment variable as specified in the comments.

- For example:

   ```bash
   MONGO_URL = Add your connection string
   PORT = Add your port
   JWT_SECRET = Add your secret

   SMTP_HOST = Add your host
   SMTP_PORT = Add your port 
   SMTP_USERNAME = Add your username
   SMTP_PASSWORD = Add your password

Replace `MONGO_URL`, `PORT`, `JWT_SECRET` with your actual credentials and database connection URL.
Replace the `SMTP` environment variables so that they can use the email sending service that is used in one of the project routes 

One of the services to obtain SMTP credentials to test the application is [Mailtrap](https://mailtrap.io).
After registering, go to email testing, click on my inbox and then show credentials. 
You will only need the Host, Port, Username and Password.

Once you've set up the environment variables in the `.env` file, you can proceed with running the project:

### Running the Project

- After setting up the environment variables in the `.env` file, you can run the project by executing the following command in the terminal:

   ```bash
   npm run build
   npm run start

- This command will start server, and you should see output indicating that the server is running on a specific port.

### Testing the API with Jest
  Test Documentation with Coverage
This documentation describes the unit tests implemented in the project, provides instructions on how to run them, and includes information on test coverage.

Unit Tests
Unit tests are a fundamental part of the development process and help ensure code quality and stability.
Test Structure
Unit tests are organized into various files, each testing a specific part of the code. Below, you will find brief descriptions of each test file and its functionalities.

Make sure you have all dependencies installed!

`error.test.ts`

- **Description:** Tests error handling behavior throughout the application.
- **Objective:** Ensure that the application responds appropriately to unexpected situations.
- **Instructions for Execution:**
   Run the tests: `npm run test:error`

`studentFuncionalities.test.ts`

- **Description:** Tests specific functionalities related to students.
- **Objective:** Verify the behavior of features related to students.
- **Instructions for Execution:**
   Run the tests: `npm run test:student`

`instructorFuncionalities.test.ts`

- **Description:** Tests specific functionalities related to instructors.
- **Objective:** Verify the behavior of features related to instructors.
- **Instructions for Execution:**
   Run the tests: `npm run test:instructor`

`studentControllers.test.ts`

- **Description:** Tests controllers related to students.
- **Objective:** Ensure that operations related to students are executed correctly.
- **Instructions for Execution:**
   Run the tests: `npm run test:student-controllers`

`instructorControllers.test.ts`

- **Description:** Tests controllers related to instructors.
- **Objective:** Ensure that operations related to instructors are executed correctly.
- **Instructions for Execution:**
   Run the tests: `npm run test:instructor-controllers`
  
### Testing the API with Insomnia

1. Make sure you have [Insomnia](https://insomnia.rest/download) installed on your machine.

2. Download the Insomnia collection JSON file from this repository. You can find the file in the insomnia directory.

3. Import the Insomnia collection into Insomnia by following these steps:
   - Open Insomnia.
   - Click on the "Application" button in the top-left corner.
   - Choose the "Preferences" tab and select the "Data" column.
   - Click the "Import to the Insomnia Project" button and import the Insomnia_2023-09-15.json file

4. Before running the API requests, ensure that the development server is up and running locally. If not, follow the "How to Run Locally" and "Setting Up Environment Variables" sections in this README to start the server.

5. Now you can start testing the API endpoints using the imported Insomnia collection. Each request is pre-configured with the required headers and data.

6. For the requests that require specific data (e.g., POST and PUT requests), make sure to update the request body with valid data before sending the request.

7. Send the requests and check the responses to verify the API functionality.

## Features

The API will have the following features in Swagger documentation:

To access the API documentation using Swagger, go to the route: http://localhost:3000/api-docs

## Flowchart

[Click here to see the project flowchart through miro](https://miro.com/app/embed/uXjVMsq8sso=/?pres=1&frameId=3458764564111600603&embedId=239356125541)

