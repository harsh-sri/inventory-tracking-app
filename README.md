## Description

### Challenge

Develop a simple inventory tracking application with two main functionalities

- Receiving invetory update
- Sending Notification

`The application will handle inventory updates and initiate notification via a webhook only when stock-level decreases and surpasses a predefined level`

### Functional Requirements

- Implement an API to update product stock
- Send notification if stock decreases beyond predefined level
- Provide simulated endpoint or mechanism for demonstrating webhook functionality

### Non-Functional Requirements

- Document Architecture
- Logic behind Notification thresold
- Setup instructions and usage guidelines
- Scalablilty, DDD, Docker

## Flow Diagram

![screenshot](assets/general_flow.png)

## Assumptions

- Product Stock architecture
  ![screenshot](assets/product-stock-architecture.png)

- Update stock api will be used during the checkout flow.
- Start with MVP and then improve the system for scalability, loose-coupling

## Architecture Diagram v1

- This service is exposing an API to update product stock. If the stock goes below predefined threshold then this service will send the nofication using webhook
- It can be scaled independently
- Mongodb is being used in replication mode.

![screenshot](assets/v1-architecture.png)

## Prerequisite

- Docker

## Tech Stack

- Node.js
- Typescript
- Nestjs
- MongoDB
- TypeOrm
- Docker

## Installation

1. Clone the repo

```bash
$ git clone {repo_url}
```

2. Switch to project directory

```bash
$ cd cloned_app
```

### Notification Webhook Simulation

- [Follow the instructions mentioned here](https://learning.postman.com/docs/designing-and-developing-your-api/mocking-data/setting-up-mock/#creating-mock-servers)

## Environment Setup

- Create a `.env` file in the project root folder
- Copy the env keys from `env.sample` and provide the correct values

## Directory Structure

```
├── assets
├── scripts
├── src
│   ├── common
│   │   ├── constants
│   │   ├── controllers
│   │   ├── docs
│   │   │   └── interfaces
│   │   ├── enums
│   │   ├── exceptions
│   │   │   └── interfaces
│   │   ├── filters
│   │   │   └── serializers
│   │   │       └── docs
│   │   └── pipes
│   ├── core
│   │   ├── config
│   │   └── logger
│   │       ├── enums
│   │       └── interface
│   ├── health-check
│   ├── infra
│   │   └── http
│   ├── notification
│   │   └── interfaces
│   └── stock
│       ├── controllers
│       ├── dto
│       ├── entities
│       ├── enums
│       ├── interfaces
│       ├── serializers
│       └── services
├── static
└── test
```

## Running the app

Start the application using Docker

```bash
$ docker-compose up --build
```

### Sample Request

```bash
$ curl --location --request PATCH 'localhost:3007/api/v1/stock/2c038cbc-0164-4ffd-a8a6-9a7cdbe8e703' \
--header 'Content-Type: application/json' \
--data '{
    "warehouseId": "56b10104-b4c3-4da0-9618-3bc0750d1f27",
    "productCount": 1
}'
```

## Test

```bash
# unit tests
$ npm run test
```

## API Docs

```
http://localhost:3000/docs
```

### Notes

- Added a script to populate db when we start this app locally for testing purpose
