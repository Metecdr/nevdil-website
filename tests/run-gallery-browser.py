"""Starts and owns one isolated Node process (no shell process left behind on Windows)."""
import os
from pathlib import Path
import secrets
import shutil
import socket
import subprocess
import sys
import tempfile
import time

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
RESULTS = DATA / "gallery-test-results"
RESULTS.mkdir(parents=True, exist_ok=True)

def listening():
    try:
        with socket.create_connection(("127.0.0.1", 4317), timeout=0.5):
            return True
    except OSError:
        return False

if listening():
    raise RuntimeError("Port 4317 is already in use; refusing to touch an existing process.")

temporary = Path(tempfile.mkdtemp(prefix="gallery-browser-temp-", dir=DATA)).resolve()
environment = {**os.environ, "ADMIN_USER": "gallery-local-test", "ADMIN_PASSWORD": secrets.token_hex(24),
    "GALLERY_DATA_DIR": str(temporary / "gallery"), "CAMPAIGN_DATA_DIR": str(temporary / "campaigns"),
    "SITE_URL": "http://127.0.0.1:4317", "PYTHONIOENCODING": "utf-8"}
server = None
try:
    with (RESULTS / "server.log").open("w", encoding="utf-8") as log:
        server = subprocess.Popen([shutil.which("node"), "node_modules/next/dist/bin/next", "start", "-p", "4317", "-H", "127.0.0.1"],
            cwd=ROOT, env=environment, stdout=log, stderr=subprocess.STDOUT,
            creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0)
        for _ in range(80):
            if server.poll() is not None:
                raise RuntimeError("Test server exited; inspect data/gallery-test-results/server.log")
            if listening():
                break
            time.sleep(0.5)
        else:
            raise RuntimeError("Test server did not start")
        result = subprocess.run([sys.executable, "tests/gallery-browser.py"], cwd=ROOT, env=environment, timeout=180)
        sys.exit(result.returncode)
finally:
    if server is not None and server.poll() is None:
        server.terminate()
        try:
            server.wait(timeout=5)
        except subprocess.TimeoutExpired:
            server.kill()
            server.wait()
    # Verify the absolute deletion target belongs to the unique test directory we created.
    assert temporary.parent == DATA.resolve() and temporary.name.startswith("gallery-browser-temp-")
    shutil.rmtree(temporary)
