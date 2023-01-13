# Contributing to Sequelize Query Generator

Thank you for investing your time to contribute to Sequelize Query Generator. Here are a few steps in order to create a successful contribution.

## How to Contribute

1. Fork the repo. 
2. Create a new branch with the next version number, for example `v0.1.2`. The next version number should follow the production version number found in `package.json` This repo uses zero based version numbers for simplicity. Updates should be reflected in the third placeholder while major/breaking changes should be reflected in the second number. The first number always remains zero.
3. Update the version number in the package.json.
4. Make the changes you want to propose. 
5. Update the `CHANGELOG.md` to reflect what has changed. 
6. Commit the changes and push up to your forked repo. Commits should follow the following comment structure - `v0.0.1 - change made`
7. Create a PR to request the merge of your changes. Double check the branch name and version number to accurately reflect the next production version. 

## Running the Project in Development

1. Clone the repo and checkout the desired branch.
2. Run `npm install` to install dependencies.
3. Run `npm link` to make the local copy available for use in other projects. Any time you install a new library, you will have to re-link.
4. Run `npm start` to start the typescript server/compile the code.
5. In your test project, run `npm link @the-devoyage/sequelize-query-generator` to link the package.
6. Use the library as normal in the test project.
