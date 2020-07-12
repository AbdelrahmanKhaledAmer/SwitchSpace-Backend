# Switch Space

## Project template based on [sebamaster-movie-backend](https://github.com/sebischair/sebamaster-movie-backend/)

SwitchSpace-Frontend application can be found [here](https://github.com/AbdelrahmanKhaledAmer/SwitchSpace-Frontend)

## Prerequisites

Both for the back end and front end application check

-   nodejs [official website](https://nodejs.org/en/) - nodejs includes [npm](https://www.npmjs.com/) (node package manager)

Just for the backend application:

-   mongodb [official installation guide](https://docs.mongodb.org/manual/administration/install-community/)

## Setup (before first run)

Go to your project root folder via command line

```
cd path/to/workspace/SwitchSpace-Backend
```

**Install node dependencies**

```
npm install
```

**Set up your database**

-   Create a new directory where your database will be stored (it's a good idea to separate data and business logic - the data directory should be on a different place than your app)
-   Start the database server

```
mongod --dbpath relative/path/to/database
```

-   Create all database schemes and import data to begin with

```
mongorestore dump/
```

**Set the environment variables**

This variables are based in your local configuration

```bash
export PORT=3000
export MONGODB_URI="your DB URL"
export JWT_SECRET="Your Secret token"
```

## Start the project

**Development environment**

-**Start DB server**

```bash
sudo systemctl start mongod
```

-**Add seed data from seeds folder**

Install mongo seeds globally

```bash
npm install -g node-mongo-seeds
```

Run seed

```bash
seed
```

Create index on the seeded items in the db

```bash
use switch_space
```

```bash
db.posts.createIndex({exchangeLocation:"2dsphere"})
```

-**Start dev server**

```bash
npm run devstart
```

**Production environment**

```bash
npm start
```

**Deployment on GCP**

If you intend to use Kubernetes

-   create GKE cluster and open cloud shell

-   copy your .env file to the server

    -   you will need the following variables in your file

        ```PORT=3000
        MONGODB_URI=
        JWT_SECRET=
        AWSAccessKeyId=
        AWSSecretKey=
        STRIPE_PAYMENT=
        ```

-   create a secret from your env file (myenv is the name of the secret)

    `kubectl create secret generic myenv --from-env-file=.env`

-   copy deployment.yml and service.yml to the cluster and run the following:

    `kubectl apply -f deployment.yml`

    `kubectl apply -f service.yml`

-   apply variables from your secret to the deployment:

    `kubectl set env --from=secret/myenv deployment/switchspace-server`

you're done! :)

other helpful commands:

-   Kubernetes cluster operate on the below mentioned ports,
    -   30000-32767 (node port range)
    -   8001, 443, 6443 (for Kubernetes communication )
-   `kubectl set env -h`
-   `kubectl set env pods --all --list`
-   `kubectl get pods --all-namespaces`
-   `kubectl get deployments --all-namespaces`
-   `kubectl get services --all-namespaces`
-   `kubectl scale deployment <deployment_name> --replicas=<replicaNumber>`
