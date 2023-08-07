
# Wishlist

Wishlist is a React project built with Firebase and Chakra UI, designed to simplify the process of creating gift registries. It provides users with the ability to create, manage, and reserve gifts, as well as manage user accounts.  
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Features

- User authentication: Create an account with email, password, and name.
- A dummy account (e-mail: `user@user.user`, password: `user1234`) is available for testing.
- Gift Management: Create, read, edit, and delete gifts.
- User Management: Manage users, including authentication and access control.

## Installation

1. Clone the repository.
2. Navigate to the project directory.
3. Install dependencies using the following command:

```
npm install
```

## Usage
Start the development server:
```
npm start
```

Access the application in your web browser at http://localhost:3000.
## To Do
- Refactor the database structure to create separate collections of gifts for each user and associate users with their specific collection.
- Implement filter and order buttons functionality for gifts and users.
- Add an option for users to reset their password if forgotten.

## Acknowledgements
- This project uses Firebase for authentication and data storage.
- The UI is built using Chakra UI.