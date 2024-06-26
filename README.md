# Note Taking App

The Note Taking App is a web application that allows users to create, edit, and manage their notes. It also includes user authentication and email verification features.


## Features

- User authentication with email verification
- Create, edit, and delete notes

- View a list of all notes

- Search functionality to find specific notes

- Responsive design for mobile and desktop devices



## Tech Stack

**Client:** React, Redux, TailwindCSS (with Typescript)

**Server:** Node.js, Express.js, PostgreSQL

**Authentication:**  JWT (JSON Web Tokens)

**Email Verification:**  Nodemailer
## Setup Instructions

Clone the repository:

```bash
git clone https://github.com/Sachin967/Notes-Taking-App.git

cd note-taking-app
```

Install dependencies for client and backend:
    
```bash
cd client
npm install
cd ../backend
npm install

```
Set up environment variables:

- Create a .env file in the backend directory.
- Add necessary environment variables like DB connection string, JWT secret, etc.

Start the development servers:

```bash
cd client
npm run dev
cd ../backend
npm start

```
Access the application in your browser:

```bash
http://localhost:5173

```
## Usage

- Sign up for a new account using your email address.


- Verify your email address by clicking on the verification link sent to your email.

- Log in to your account.


- Create new notes, edit existing notes, or delete notes as needed.

- Use the search functionality to find specific notes.




