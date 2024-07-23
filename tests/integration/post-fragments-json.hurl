# tests/integration/post-fragments-json.hurl
# Authenticated POST to /v1/fragments with JSON content
POST http://localhost:8080/v1/fragments
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
`{"key": "value"}`

# We expect to get back an HTTP 201
HTTP/1.1 201
[Asserts]
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
jsonpath "$.fragment.type" == "application/json"
jsonpath "$.fragment.size" == 16
[Captures]
url: header "Location"

# GET the fragment to confirm it has the correct content
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: application/json
Content-Length: 16
[Asserts]
body == "{\"key\": \"value\"}"
