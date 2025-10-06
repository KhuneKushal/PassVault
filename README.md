# PassVault

PassVault is a secure and user-friendly password manager built to keep your digital life safe. It provides a simple interface to store, manage, and generate strong passwords.

## Features

*   **Secure Vault:** Store your passwords and sensitive information with confidence. All data is encrypted.
*   **Password Generator:** Create strong, random passwords to enhance your security.
*   **User Authentication:** Secure login and signup system to ensure only you have access to your vault.
*   **Simple Dashboard:** An intuitive interface to easily manage your saved credentials.

## Tech Stack

*   **Frontend:** [Next.js](https://nextjs.org/) (React)
*   **Backend:** Node.js with API routes
*   **Database:** [MongoDB](https://www.mongodb.com/)
*   **Encryption:** Using standard encryption libraries to protect your data.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js and npm installed. You can download them [here](https://nodejs.org/).
*   A MongoDB database instance (local or cloud).

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/your_username/PassVault.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```
3.  Create a `.env.local` file in the root of the project and add your environment variables (e.g., MongoDB connection string, JWT secret).
    ```
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```
4.  Run the development server
    ```sh
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.