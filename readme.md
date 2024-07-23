# Voting DApp

## Getting started

```
$ git clone ...
$ cd voting-dapp/
```

Two terminal windows will be required for ganache-cli and react (if developing)

```
$ ganache-cli
```

```
$ npm run start
```

Additionally, as this is a new blockchain environment you'll need to migrate the contract

```
$ truffle migrate
```

Once the migration is complete, copy the contractAddress and put it into App.js (TODO move this to non-versioned environment variables as this will register a code change as currently is)

The app should run at http://localhost:5000

You can use the public keys output in the ganache terminal.

==

https://livebook.manning.com/book/building-ethereum-dapps/chapter-12/221

create all tests
how might it work in the real world? e.g. register from qr code in letter, localities, 
openzeppelin
env variables for contractAddress etc