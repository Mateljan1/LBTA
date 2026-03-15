# API notes

## Request format

- **`/api/register-program`** and **`/api/register-year`** expect `Content-Type: application/json` and a JSON body. Sending `application/x-www-form-urlencoded` or `multipart/form-data` will result in 400 "Invalid request format".

## Chat (`POST /api/chat`)

- **Success response:** Uses `reply`, not `message`. Clients should read `response.reply` for the assistant text.
- **Error response:** Uses `error` for the user-facing message.
