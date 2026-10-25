# Linux System Administration — Learning Journey

A hands-on learning repository documenting my journey into Linux system administration, networking, and automation.

I'm building practical skills through small exercises, documenting what I learn, and tracking my progress as I go.

## About This Repository

This repository is my personal lab notebook and learning portfolio. It contains command-line exercises, system observations, networking notes, and practical tasks completed while learning Linux administration.

My focus is on understanding how things work, not just memorizing commands.

## Learning Environment

- **Operating System:** Ubuntu 26.04.1 LTS
- **Device:** ThinkPad X1 Carbon Gen 9
- **Shell:** Bash
- **Version Control:** Git 2.53.0
- **Repository Hosting:** GitHub

## Skills in Progress

- Linux command-line fundamentals
- System information and resource inspection
- Networking and connectivity troubleshooting
- Ports, sockets, and service inspection
- SSH basics
- Git and version control
- Users, groups, and file permissions
- Bash scripting and automation

## Practical Exercises

### 1. Linux Fundamentals

Commands practiced:

- `whoami` — identify the current user
- `uname -r` — display the running kernel version
- `df -h` — inspect filesystem disk usage
- `hostname` — display the system hostname
- `cat /etc/os-release` — identify the operating system

### 2. Networking Basics

Practiced inspecting network configuration and testing connectivity.

- Local IP address: `192.168.1.8`
- Network interface: `wlp0s20f3`
- Default gateway: `192.168.1.1`
- Local network and internet connectivity tested successfully
- DNS name resolution tested successfully
- Ping tests completed with 0% packet loss during testing

Commands practiced:

- `ip addr`
- `ip route`
- `hostname -I`
- `ping -c 4 1.1.1.1`
- `ping -c 4 google.com`

### 3. Ports and Services

Practiced inspecting listening ports and checking SSH-related systemd units.

- Used `ss -tuln` to inspect listening TCP and UDP sockets
- Used `ss -ltn` to inspect listening TCP sockets
- Checked `ssh.service` and `ssh.socket`
- Observed SSH socket activation and listening on port 22
- Checked the status of UFW

**Firewall note:** UFW was reported as inactive during this exercise. No firewall configuration changes were made.

Commands practiced:

- `ss -tuln`
- `ss -ltn`
- `systemctl status ssh.socket`
- `sudo ufw status`

## Progress Tracker

- [x] Inspect basic Linux system information
- [x] Practice essential terminal commands
- [x] Inspect IP addresses and routing
- [x] Test network and DNS connectivity
- [x] Inspect listening ports and SSH socket activation
- [x] Configure Git identity
- [x] Clone a repository from GitHub
- [x] Commit and push changes to GitHub
- [ ] Learn Linux users and groups
- [ ] Practice file ownership and permissions
- [ ] Learn service management with systemd
- [ ] Practice Bash scripting
- [ ] Explore logs and troubleshooting

## What I'm Learning

- How Linux systems expose information through command-line tools
- How IP addressing, routing, and DNS work together
- How to inspect listening sockets and system services
- How to document technical work clearly
- How to use Git and GitHub to track changes

## Next Steps

My next goal is to understand Linux users, groups, ownership, and permissions, followed by service management and basic Bash automation.

This repository will evolve as I complete more hands-on exercises and build a stronger foundation in system administration.

---

*Learning by doing, documenting every step, and improving one task at a time.*


## Documentation

- [Linux Basics](linux-basics.md) — essential Linux commands and system fundamentals.
- [Linux Networking](networking.md) — network interfaces, IP addresses, DNS, connectivity tests, and troubleshooting.
- [SSH](ssh.md) — secure remote access, service status, listening ports, and basic security.

## System dashboard app

The repository also includes a responsive Linux system dashboard in `app/`.

### Run locally

From the repository root, run:

```bash
python3 app/server.py
```

Then open <http://127.0.0.1:8000> in your browser. Stop the server with `Ctrl+C`.

The local Python server reads live system information and the dashboard displays it without changing system settings. The GitHub Pages version uses clearly marked sample data because a website cannot access your computer’s live system information.

### GitHub Pages

The workflow in `.github/workflows/pages.yml` publishes `app/` when changes are pushed to `main`. In the repository settings, open **Pages** and select **GitHub Actions** as the build and deployment source. After deployment, the site address is <https://qxko.github.io/sysadmin/>.
