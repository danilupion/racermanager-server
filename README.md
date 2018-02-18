# RacerManager Server

Web server providing the REST API for RacerManager


## Scripts

#### Server Start
Starts the server

```
npm start
```
#### Server Start (Dev Mode)
Starts the server in development mode

```
npm run start:dev
```

#### Seed
Seeds the initial database for the application

```
npm run seed
```

#### User Creation
Creates a new user

```
npm run users:create -- <username> <email> <password>
```

#### User Creation
Changes the password of a give user

```
node run  users:change-password -- <email> <new-password>
```