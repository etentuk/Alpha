# Buggington

This is a React Frontend + Django Rest Framework Backend project which uses AntDesign for the UI stylings.

The project is a bug tracker in which users can create and manage the status of projects and tickets. Each user is assigned a role which in turn determines the actions which can be taken in the site.

## Description

During development we all encounter various issues, have different tasks to complete and various milestones to achieve. These tasks are what I defined as tickets within the application and a collection of tickets is then represented as a project. A ticket can only exist within a project and deleting a project will automatically delete all tickets assigned to it.

Within an organization there are always different roles and access levels given to each person. I have also taken this into consideration and implemented a Role Based Access Control Authorization method.

To achieve this I used Django Groups to create 4 groups which Users Can be assigned to. They are described below:

- Admin: This is the highest level, an Admin can access all parts of the application. The Admin is the only user capable of changing the roles of other users within the application.

- Project Manager: This User manages and keeps tracks of the overall project and has the Architectural Vision to manage projects and see them to completion.

- Developer: Developers will mainly be focused on the task assigned to them, they are in charge of their tickets.They have full access to the Ticket interface.

- Submitter: These are the QA's who will report based on what they have evaluated from the work done by developers. They only have the ability to create Tickets and Read access to the projects. I

When you sign into the application you are first met with a quick summary of the tickets in the application grouped by Status, Type, Priority and Project. There are 5 primary Pages to Navigate to, Dashboard, Manage User Roles, Projects, Tickets and User Profile. The Manage User page is only visible to Users with a role of ADMIN. If any unauthorized users attempt to access this URL they get an Unauthorized Error Message.

### Authentication

To access the application you can either register and sign in or use the Demo User Login function. As a demo user, you will be authorized to make all changes the role is allowed to, apart from password change.

## Front End Setup

To setup the frontend, run `npm install` within the project directory on your local machine.

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.


## Backend Setup
To use this application you will need to have [python](https://python.org/downloads/) installed on your machine along with a [virtual environment](https://virtualenv.pypa.io/en/latest/).

Once the virtual environment is installed, create a new venv within the project directory and then run `pip install -r requirements.txt`. This will install all the dependencies for the backend.

You will need to run the necessary migrations with `python3 manage.py migrate` and finally run the server with `python3 manage.py runserver`.


## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
