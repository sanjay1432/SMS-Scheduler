# Message Scheduler Test
## Schedule the message to send to list of contacts


## Installation
```sh
npm i
```

## Development
```sh
npm start
```

## Test
```sh
npm test
```

## Routes

To fetch all the schedule list
```sh
http://localhost:8000/schedule

GET
```
To fetch schedule list by pages 
```sh
http://localhost:8000/schedule/:perPage?/:page?

GET
```

To fetch the single schedule with contacts list
```sh
http://localhost:8000/schedule/sms

POST: {
    id: scheduleID
}

```