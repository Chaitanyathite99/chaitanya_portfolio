import json
import re
from http.server import BaseHTTPRequestHandler, HTTPServer


PROFILE = {
    "name": "Chaitanya Thite",
    "headline": "Curious by nature. Building one good thing at a time.",
    "interests": ["Python", "Node.js", "DevOps", "creative problem-solving"],
}
EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
MAX_BODY_SIZE = 4096


class PortfolioHandler(BaseHTTPRequestHandler):
    def send_json(self, status, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path == "/api/health":
            self.send_json(200, {"status": "ok"})
        elif self.path == "/api/profile":
            self.send_json(200, PROFILE)
        else:
            self.send_json(404, {"error": "Not found"})

    def do_POST(self):
        if self.path != "/api/contact":
            self.send_json(404, {"error": "Not found"})
            return

        if self.headers.get_content_type() != "application/json":
            self.send_json(415, {"error": "Send the form as JSON."})
            return

        try:
            body_size = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            self.send_json(400, {"error": "Invalid request length."})
            return

        if body_size <= 0 or body_size > MAX_BODY_SIZE:
            self.send_json(413, {"error": "The message is empty or too large."})
            return

        try:
            payload = json.loads(self.rfile.read(body_size))
        except (json.JSONDecodeError, UnicodeDecodeError):
            self.send_json(400, {"error": "Invalid JSON."})
            return

        if not isinstance(payload, dict):
            self.send_json(400, {"error": "The request must be a JSON object."})
            return

        name, email, message = (
            payload.get("name"),
            payload.get("email"),
            payload.get("message"),
        )
        if not all(isinstance(value, str) for value in (name, email, message)):
            self.send_json(400, {"error": "Please complete all three fields."})
            return
        if not name.strip() or len(name) > 80:
            self.send_json(400, {"error": "Name must be between 1 and 80 characters."})
            return
        if len(email) > 254 or not EMAIL_PATTERN.fullmatch(email.strip()):
            self.send_json(400, {"error": "Enter a valid email address."})
            return
        if not message.strip() or len(message) > 2000:
            self.send_json(400, {"error": "Message must be between 1 and 2000 characters."})
            return

        self.send_json(
            200,
            {"message": "Thanks for trying the demo! This message was not saved or emailed."},
        )

    def log_message(self, format_string, *args):
        print(f"{self.address_string()} - {format_string % args}")


if __name__ == "__main__":
    print("Python portfolio API listening at http://127.0.0.1:8000")
    HTTPServer(("127.0.0.1", 8000), PortfolioHandler).serve_forever()

