# Pro Replay

## Introduction

ProReplay is an innovative platform designed to bring state-of-the-art replay functionalities for summoners. With its seamless integration and user-friendly interface, ProReplay aims to enhance the gaming experience by allowing players to watch their and others replay and analyze in-game moments.

## Technologies Stack

ProReplay harnesses a blend of contemporary technologies, curated to deliver superior performance, robustness, and an intuitive user experience:

### Backend - Node.js with Express.js:

Node.js is renowned for its rapid performance, especially when handling I/O-bound operations, making it an ideal choice for managing gameplay data (such as waiting for summoners to play the game). Express.js, a minimalist framework for Node.js, simplifies the setup, promotes scalability, and provides a plethora of plugins.

### Database - MongoDB:

Given the dynamic nature of ProReplay's development—where data structures are frequently modified and added—MongoDB's schema-less NoSQL structure offers unmatched adaptability. This flexibility ensures that the database can smoothly incorporate new functionalities and structural changes. Such agility makes MongoDB particularly suitable for projects in a constant state of evolution without a fixed, established codebase.

### Authentication - Firebase:

Firebase Authentication is distinguished by its robust security and seamless integration, eliminating the need for a bespoke authentication system. Its compatibility with numerous front-end technologies is another highlight. Furthermore, Firebase includes pre-built authentication procedures for widely-used platforms such as Google, which accentuates user familiarity and ease of use.

## Getting Started

### Prerequisites

1. Ensure MongoDB is installed and running on your machine.
2. Initialize Firebase by consulting the [official Firebase documentation](https://firebase.google.com/docs)

### Setting up environment variables and setting files

1. Copy the `.env.template` file to a new file name `.env`.
2. Fill in the appropriate values for each environment variable in the `.env` file.
3. Download the Firebase Admin SDK's service account key and store it in the project root and name it service-account-file.json

### Running the Project

1. In a separate terminal, initiate the MongoDB service:
   ```bash
   $ mongod
   ```
2. Firebase Setup:

   - Navigate to the [Firebase Console](https://console.firebase.google.com/) and establish a new project.
   - Retrieve your Firebase configuration details(API key, Auth domain, etc.) and store them in a `.env` file within the project root.

3. Navigate to the project directory and execute:
   ```bash
   $ node ./src/app.js
   ```
   This will start the ProReplay backend server on the specified port(default:3000).
