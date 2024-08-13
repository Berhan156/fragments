# Test for unsupported Content-Type
POST http://localhost:8080/v1/fragments
Content-Type: application/xml
[BasicAuth]
user1@email.com:password1
<fragment>This is an unsupported type</fragment>

# We expect to get back an HTTP 415 Unsupported Media Type
HTTP/1.1 415
