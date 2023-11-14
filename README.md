# UsaMapFilter

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.
PATH
## Deploy on Render
set Environment
NODE_VERSION=18.12.0
PORT=<port> (default 3000)

Set Build Command to: 
npm install -g @angular/cli;npm install;ng build --configuration=production

Set Start Command to:
node server.js


Was:
Set Build Command to: 

mkdir -p ~/.npm-global;npm config set prefix '~/.npm-global';export PATH=~/.npm-global/bin:$PATH;npm install -g n;mkdir -p ~/.n;export N_PREFIX=~/.n;n 18.13;export PATH=$N_PREFIX/bin:$PATH;npm install -g @angular/cli;ng update @angular/cli @angular/core --allow-dirty --force;npm install;ng build --configuration=production

Set Start Command to:
export PATH=~/.npm-global/bin:$PATH;node server.js

Prev Start Command was
#export PATH=~/.npm-global/bin:$PATH;npx http-server dist/usa-map-filter -p $PORT

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
