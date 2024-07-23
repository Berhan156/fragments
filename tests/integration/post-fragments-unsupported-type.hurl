# tests/integration/post-fragments-unsupported-type.hurl
# Attempt to post a fragment with an unsupported Content-Type
POST http://localhost:8080/v1/fragments
Content-Type: application/unsupported
[BasicAuth]
user1@email.com:password1
`Unsupported fragment content`

# We expect to get back an HTTP 415
HTTP/1.1 415
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 415
jsonpath "$.error.message" == "Improper Content-Type"
