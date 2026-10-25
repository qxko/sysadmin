#!/usr/bin/env python3
"""Local, read-only system information API for the sysadmin dashboard."""
from __future__ import annotations

import getpass
import glob
import json
import os
import platform
import shutil
import socket
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

APP_DIR = Path(__file__).resolve().parent


def read_text(path: str, default: str = "") -> str:
    try:
        return Path(path).read_text(encoding="utf-8").strip()
    except OSError:
        return default


def memory_info() -> tuple[int, int]:
    values = {}
    for line in read_text("/proc/meminfo").splitlines():
        key, _, rest = line.partition(":")
        parts = rest.split()
        if parts:
            values[key] = int(parts[0]) * 1024
    total = values.get("MemTotal", 0)
    available = values.get("MemAvailable", values.get("MemFree", 0))
    return total - available, total


def cpu_snapshot() -> tuple[int, int] | None:
    line = read_text("/proc/stat").splitlines()
    if not line or not line[0].startswith("cpu "):
        return None
    values = [int(value) for value in line[0].split()[1:]]
    idle = values[3] + (values[4] if len(values) > 4 else 0)
    return sum(values), idle


def cpu_usage() -> int | None:
    before = cpu_snapshot()
    if before is None:
        return None
    time.sleep(0.12)
    after = cpu_snapshot()
    if after is None:
        return None
    total_delta, idle_delta = after[0] - before[0], after[1] - before[1]
    if total_delta <= 0:
        return 0
    return round(100 * (1 - idle_delta / total_delta))


def network_info() -> dict[str, str]:
    gateway = "Unavailable"
    interface = "Unavailable"
    try:
        for line in read_text("/proc/net/route").splitlines()[1:]:
            fields = line.split()
            if len(fields) >= 4 and fields[1] == "00000000":
                interface = fields[0]
                raw = bytes.fromhex(fields[2])
                gateway = socket.inet_ntoa(raw[::-1])
                break
    except (OSError, ValueError):
        pass

    local_ip = "Unavailable"
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
            sock.connect(("1.1.1.1", 80))
            local_ip = sock.getsockname()[0]
    except OSError:
        pass
    return {"ip": local_ip, "gateway": gateway, "interface": interface}


def temperature() -> float | None:
    for path in glob.glob("/sys/class/thermal/thermal_zone*/temp"):
        try:
            value = int(Path(path).read_text().strip()) / 1000
            if 0 <= value <= 150:
                return round(value)
        except (OSError, ValueError):
            continue
    return None


def health_data() -> dict:
    os_release = {}
    try:
        os_release = platform.freedesktop_os_release()
    except (AttributeError, OSError):
        pass
    used_memory, total_memory = memory_info()
    disk = shutil.disk_usage("/")
    uptime_seconds = int(float(read_text("/proc/uptime", "0").split()[0]))
    uptime_days, remainder = divmod(uptime_seconds, 86400)
    uptime_hours = remainder // 3600
    uptime_minutes = remainder % 3600 // 60
    network = network_info()
    return {
        "hostname": socket.gethostname(),
        "user": getpass.getuser(),
        "os": os_release.get("PRETTY_NAME", platform.system()),
        "kernel": platform.release(),
        "uptime": f"{uptime_days}d {uptime_hours}h {uptime_minutes}m",
        "cpu": cpu_usage(),
        "cpu_cores": os.cpu_count() or 1,
        "memory_used": used_memory,
        "memory_total": total_memory,
        "disk_used": disk.used,
        "disk_total": disk.total,
        "temperature": temperature(),
        **network,
    }


class DashboardHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(APP_DIR), **kwargs)

    def do_GET(self):
        if self.path == "/api/health":
            try:
                payload = json.dumps(health_data()).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Cache-Control", "no-store")
                self.send_header("Content-Length", str(len(payload)))
                self.end_headers()
                self.wfile.write(payload)
            except Exception as error:
                self.send_error(500, f"Could not read system information: {error}")
            return
        if self.path == "/":
            self.path = "/index.html"
        super().do_GET()

    def log_message(self, format, *args):
        print(f"[{self.log_date_time_string()}] {format % args}")


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", 8000), DashboardHandler)
    print("Sysadmin dashboard running at http://127.0.0.1:8000")
    print("Press Ctrl+C to stop.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping dashboard server…")
    finally:
        server.server_close()
