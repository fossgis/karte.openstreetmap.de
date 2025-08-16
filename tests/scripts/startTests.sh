import http.server
import socketserver
import os

BASE_DIR = os.getcwd()
PUBLIC_DIR = os.path.join(BASE_DIR, "public")
TESTS_DIR = os.path.join(BASE_DIR, "tests")

class MultiDirHandler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        clean_path = path.split("?", 1)[0].split("#", 1)[0]

        if clean_path.startswith("/tests/"):
            rel_path = clean_path[len("/tests/"):]
            return os.path.join(TESTS_DIR, rel_path or "index.html")

        rel_path = clean_path.lstrip("/")
        file_path = os.path.join(PUBLIC_DIR, rel_path)

        if os.path.isfile(file_path):
            return file_path

        return os.path.join(PUBLIC_DIR, "index.html")

class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

if __name__ == "__main__":
    PORT = 8000
    with ReusableTCPServer(("", PORT), MultiDirHandler) as httpd:
        print(f"Server läuft auf http://127.0.0.1:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nBeende Server…")
