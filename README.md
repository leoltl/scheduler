# Interview Scheduler

Interview Scheduler - an application that enable student to create, edit and delete interview appointments.

Client App is deployed to netlify - https://scheduler-ltl.netlify.com/, supported with a backend api deployed to https://scheduler-ltl.herokuapp.com/

Database is setup on heroku and data is persisting.

Implemented with WebSocket so user can see real time appointment update as other users are creating, editing and deleted appointments.

## Final Product

!["Screenshot of URLs details page"](https://github.com/leoltl/scheduler/blob/master/docs/index.png)

## Dependencies

- babel/core
- storybook/addon-actions
- storybook/addon-backgrounds
- storybook/addon-links
- storybook/addons
- storybook/react
- testing-library/jest-dom
- testing-library/react
- testing-library/react-hooks
- babel-loader
- node-sass
- prop-types
- react-test-renderer

## Setup

Install dependencies with `npm install`.

## Running Webpack Development Server

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```
