# Relative Strength

A full stack application that aggregates fx calendar and major currency relative strength and weakness. In addition allows authenticated users to build an fx book by opening, commenting and closing of trades.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

| Prerequisite                                | Version |
| ------------------------------------------- | ------- |
| [Node.js](http://nodejs.org) /  npm (comes with Node)  | `~ ^8.11.2` / `~^6.1.0` |
| [yarn](https://yarnpkg.com/lang/en/docs/install/) | `~ ^1.3.2` |
| [Git](https://git-scm.com/downloads) | `~ ^2` |
| [MongoDB Community Server](https://docs.mongodb.com/manual/administration/install-community/) | `~ ^3.4.9`  |




### Installing

Create a new directory and initialize git

```
mkdir relative-strength
cd relative-strength
git init
```

Pull from github and install packages

```
git pull https://github.com/Dereje1/RelativeStrength.git
yarn
cd client
yarn
cd ..
```

If using mongoDB locally see below to start the db (if using mlab skip this step)

```
mkdir data
mongod --port 27017 --dbpath=./data
```

create .env files
>In the root of the project create a .env file with the following contents
```
MONGOLAB_URI=<mongoDB connection string>
SESSION_SECRET=<Session Secret Key>
GOOGLE_CLIENT_ID=<Google Client ID>
GOOGLE_CLIENT_SECRET=<Google Client Secret>
AWS_RAW_DATA=<Raw fx data from AWS>
```
Run development environment
```
yarn dev
```
The Browser should now open up with the application in development mode.

## Built With

* [MongoDB](https://www.mongodb.com/) - Database
* [Express](https://expressjs.com/) - Node.js web application framework
* [React](https://reactjs.org/) - A JavaScript library for building user interfaces
* [Node.js](https://nodejs.org/) - JavaScript runtime
 
## Authors

* **Dereje Getahun** - [Dereje Getahun](https://github.com/Dereje1)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone who's code was used
* fx Calendar - https://www.forexfactory.com/calendar.php
* fx Prices - Oanda demo account running on an AWS EC2 Instance
