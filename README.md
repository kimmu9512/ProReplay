# Pro Replay

## Introduction

ProReplay is an innovative platform designed to bring state-of-the-art replay functionalities for summoners. With its seamless integration and user-friendly interface, ProReplay aims to enhance the gaming experience by allowing players to watch their and others replay and analyze in-game moments.

## Technologies Stack

ProReplay harnesses a blend of contemporary technologies, curated to deliver superior performance, robustness, and an intuitive user experience:

### Backend - Node.js with Express.js:

Node.js is renowned for its rapid performance, especially when handling I/O-bound operations, making it an ideal choice for managing gameplay data (such as waiting for summoners to play the game). Express.js, a minimalist framework for Node.js, simplifies the setup, promotes scalability, and provides a plethora of plugins.

### Database - PostgreSQL:

ProReplay handles intricate relationships between users, summoners, matches, and recordings. PostgreSQL, an advanced open-source relational database, is aptly equipped for this job due to:

ACID Compliance: Guarantees the reliability and integrity of every transaction.
Complex Queries: Enables efficient querying of intertwined relationships between tables, utilizing JOIN operations and more.
Extensions and Indexing: Offers robust indexing techniques like GIN, GiST, and SP-GiST, optimizing search operations. The extensibility of PostgreSQL also allows it to adapt and extend its capabilities further.
Concurrency: Utilizes Multi-Version Concurrency Control (MVCC) to handle multiple transactions without conflicts, ensuring smooth operations even with multiple concurrent users.

### Authentication - Firebase:

Firebase Authentication is distinguished by its robust security and seamless integration, eliminating the need for a bespoke authentication system. Its compatibility with numerous front-end technologies is another highlight. Furthermore, Firebase includes pre-built authentication procedures for widely-used platforms such as Google, which accentuates user familiarity and ease of use.

## Getting Started

### Prerequisites

1. Ensure PostgreSQL is installed and running on your machine. If not, follow the official PostgreSQL installation guide.
2. Initialize Firebase by consulting the [official Firebase documentation](https://firebase.google.com/docs)

### Setting up environment variables and setting files

1. Copy the `.env.template` file to a new file name `.env`.
2. Fill in the appropriate values for each environment variable in the `.env` file.
3. Download the Firebase Admin SDK's service account key and store it in the project root and name it service-account-file.json

### Running the Project

1. Firebase Setup:

   - Navigate to the [Firebase Console](https://console.firebase.google.com/) and establish a new project.
   - Retrieve your Firebase configuration details(API key, Auth domain, etc.) and store them in a `.env` file within the project root.

2. Navigate to the project directory and execute:
   ```bash
   $ node ./src/app.js
   ```
   This will start the ProReplay backend server on the specified port(default:3001).
