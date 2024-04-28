# NodeJS Express Starter Project

## Authorisation

### Requesting a Bearer Token

Make a POST Request to /token/ endpoint. Request must include a valid Bearer Token with the 'admin' privilage.

```JSON
{
  "role": "<Request Role Type>",
  "title": "<Token Title>",
  "privilages": [
    "admin"
  ],
}
```

The first token can be generated at: https://jwt.io/.
