import json
import mimetypes
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse


HOST = os.environ.get("HOST", "127.0.0.1")
PORT = int(os.environ.get("PORT", "3000"))
ROOT_DIR = Path(__file__).resolve().parent
DATA_DIR = ROOT_DIR / "data"

API_CONFIG = {
    "/api/contact": {
        "file": "contact-submissions.ndjson",
        "required": ["name", "designation", "email", "phone", "institution", "institutionType"],
        "message": "Message received. Our team will get back to you shortly.",
    },
    "/api/careers": {
        "file": "career-applications.ndjson",
        "required": ["name", "email", "phone", "role", "experience", "motivation"],
        "message": "Application received. Thank you for applying to IQ-Line.",
    },
    "/api/newsletter": {
        "file": "newsletter-subscriptions.ndjson",
        "required": ["email"],
        "message": "You are subscribed to the IQ-Line newsletter.",
    },
}


class IQLineHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.serve_static()

    def do_HEAD(self):
        self.serve_static(head_only=True)

    def do_POST(self):
        config = API_CONFIG.get(urlparse(self.path).path)
        if not config:
          self.send_json(404, {"error": "Endpoint not found."})
          return

        try:
            content_length = int(self.headers.get("Content-Length", "0"))
            raw_body = self.rfile.read(content_length).decode("utf-8") if content_length else "{}"
            payload = json.loads(raw_body or "{}")
        except json.JSONDecodeError:
            self.send_json(400, {"error": "Invalid JSON payload."})
            return

        missing = [field for field in config["required"] if not str(payload.get(field, "")).strip()]
        if missing:
            self.send_json(400, {"error": "Missing required fields.", "fields": missing})
            return

        DATA_DIR.mkdir(parents=True, exist_ok=True)
        record = {
            "type": urlparse(self.path).path.replace("/api/", ""),
            "receivedAt": __import__("datetime").datetime.utcnow().isoformat() + "Z",
            "payload": payload,
        }
        with open(DATA_DIR / config["file"], "a", encoding="utf-8") as handle:
            handle.write(json.dumps(record) + "\n")

        self.send_json(200, {"ok": True, "message": config["message"]})

    def serve_static(self, head_only=False):
        request_path = urlparse(self.path).path
        relative = "index.html" if request_path == "/" else request_path.lstrip("/")
        target = (ROOT_DIR / relative).resolve()

        if ROOT_DIR not in target.parents and target != ROOT_DIR:
            self.send_json(403, {"error": "Forbidden path."})
            return

        if target.is_dir():
            target = target / "index.html"

        if not target.exists() or not target.is_file():
            self.send_response(404)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.end_headers()
            if not head_only:
                self.wfile.write(b"Not found")
            return

        content_type = mimetypes.guess_type(str(target))[0] or "application/octet-stream"
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.end_headers()

        if not head_only:
            with open(target, "rb") as handle:
                self.wfile.write(handle.read())

    def send_json(self, status_code, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    server = ThreadingHTTPServer((HOST, PORT), IQLineHandler)
    print(f"IQ-Line site running at http://{HOST}:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down...")
    finally:
        server.server_close()
