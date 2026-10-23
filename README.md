# Linux System Administration — Learning Journey

This repository documents my journey into Linux system administration through practical, hands-on exercises.

## My Goal

I am learning Linux system administration and building practical skills step by step.

## Environment

- Operating system: Ubuntu 26.04.1 LTS
- Device: ThinkPad X1
- Shell: Bash
- Git version: 2.53.0

## Linux Basics — Day 1

### Commands I Learned

| Command | Description |
|---|---|
| `whoami` | Shows the current username. |
| `uname -r` | Shows the Linux kernel version. |
| `df -h` | Shows disk space usage in a human-readable format. |
| `hostname` | Shows the computer's hostname. |
| `cat /etc/os-release` | Displays operating system information. |

## Networking Basics

### Network Checks

- Local IP address: `192.168.1.8`
- Network interface: `wlp0s20f3`
- Default gateway: `192.168.1.1`
- Internet connectivity: Working
- DNS resolution: Working
- Packet loss in tests: 0%

### Networking Commands

| Command | Description |
|---|---|
| `ip addr` | Displays network interfaces and IP addresses. |
| `ip route` | Displays the routing table and default gateway. |
| `hostname -I` | Displays the computer's IP addresses. |
| `ping -c 4 1.1.1.1` | Tests connectivity to an IP address. |
| `ping -c 4 google.com` | Tests connectivity and DNS resolution. |

## Ports and Services

| Command | Description |
|---|---|
| `ss -tuln` | Displays listening TCP and UDP ports. |
| `ss -ltn` | Displays listening TCP ports. |
| `systemctl status ssh.socket` | Shows the status of the SSH socket. |
| `sudo ufw status` | Checks the status of the UFW firewall. |

## What I Have Learned

- How to inspect Linux system information.
- How to check network interfaces, routes, and connectivity.
- How to inspect listening ports.
- How to check SSH socket and firewall status.
- How to use Git to manage project files.

## Learning Plan

- [x] Learn basic Linux commands.
- [x] Check network connectivity.
- [x] Inspect listening ports and SSH status.
- [x] Configure Git identity.
- [x] Clone a GitHub repository.
- [ ] Learn Git add, commit, and push.
- [ ] Learn Linux users and permissions.
- [ ] Practice system and service management.
- [ ] Learn basic Bash scripting.

---

This repository is a record of my progress and practical Linux learning exercises.
