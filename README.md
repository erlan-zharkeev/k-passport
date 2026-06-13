### K-passport

K-Passport is an authorization service designed to provide OAuth authorization for third-party applications.
It provides convenient and secure authorization and authentication mechanisms for your client applications, which allows them to access data and resources protected using the OAuth protocol.

> **Project status:** K-Passport is in active early development. APIs, configuration, and deployment details may change before a stable release.

## Environment

Copy `.env.example` to `.env.development` for local development and replace placeholder secrets before running the service.

## Development

```bash
npm install
npm run start:dev
```

To start MongoDB through Docker Compose:

```bash
docker-compose --env-file .env.development up -d db
```

## Docker

The GitHub Actions Docker workflow publishes images to:

```text
ghcr.io/erlan-zharkeev/k-passport
```
