import http.server
import socketserver
import os
import sys
import time
import threading
import subprocess

# Ensure stdio exists for pythonw
if sys.stdout is None:
    sys.stdout = open(os.devnull, "w")
if sys.stderr is None:
    sys.stderr = open(os.devnull, "w")

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

last_heartbeat_time = time.time()
has_received_first_heartbeat = False
server_instance = None

class AutoShutdownHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def do_GET(self):
        global last_heartbeat_time, has_received_first_heartbeat
        if self.path == "/heartbeat":
            last_heartbeat_time = time.time()
            has_received_first_heartbeat = True
            self.send_response(200)
            self.send_header("Content-type", "text/plain")
            self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(b"OK")
            return
        elif self.path == "/shutdown":
            self.send_response(200)
            self.send_header("Content-type", "text/plain")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(b"SHUTTING_DOWN")
            threading.Thread(target=self.delayed_shutdown, daemon=True).start()
            return

        super().do_GET()

    def do_POST(self):
        if self.path == "/shutdown":
            self.send_response(200)
            self.send_header("Content-type", "text/plain")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(b"SHUTTING_DOWN")
            threading.Thread(target=self.delayed_shutdown, daemon=True).start()
            return
        self.send_response(404)
        self.end_headers()

    def delayed_shutdown(self):
        time.sleep(0.3)
        if server_instance:
            server_instance.shutdown()
        os._exit(0)

    def log_message(self, format, *args):
        pass

def watchdog():
    start_time = time.time()
    # 60 seconds initial grace period for browser to open
    initial_grace_sec = 60.0
    timeout_sec = 8.0

    while True:
        time.sleep(1.0)
        now = time.time()
        if has_received_first_heartbeat:
            if now - last_heartbeat_time > timeout_sec:
                if server_instance:
                    server_instance.shutdown()
                os._exit(0)
        else:
            if now - start_time > initial_grace_sec:
                if server_instance:
                    server_instance.shutdown()
                os._exit(0)

def open_browser(url):
    try:
        import webbrowser
        webbrowser.open(url)
    except Exception:
        pass

def start_server():
    global server_instance
    socketserver.TCPServer.allow_reuse_address = True
    port = PORT
    server = None
    for attempt in range(5):
        try:
            server = socketserver.TCPServer(("127.0.0.1", port), AutoShutdownHandler)
            break
        except OSError:
            time.sleep(0.5)

    if not server:
        open_browser(f"http://localhost:{PORT}")
        sys.exit(0)

    server_instance = server
    url = f"http://localhost:{port}"

    # Start watchdog thread
    threading.Thread(target=watchdog, daemon=True).start()

    # Open browser
    open_browser(url)

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()

if __name__ == "__main__":
    start_server()
