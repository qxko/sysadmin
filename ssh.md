# SSH (Secure Shell)

This document contains practical notes about SSH and how to inspect SSH-related services on a Linux system.

## What Is SSH?

SSH (Secure Shell) is a network protocol used to securely access and manage remote computers over an encrypted connection.

The standard SSH server port is **22**.

## Checking SSH Status

### Check the SSH Service

```bash
systemctl status ssh.service
```

Displays the status of the SSH service.

### Check the SSH Socket

```bash
systemctl status ssh.socket
```

Displays the status of the socket that can listen for incoming SSH connections.

On systems configured for socket activation, `ssh.socket` can listen for connections and start `ssh.service` when needed.

### Check Listening Ports

```bash
ss -ltn
```

Lists listening TCP sockets and their local ports.

To filter for port 22:

```bash
ss -ltn | grep ':22'
```

## Service vs. Socket

- **ssh.service:** Runs the SSH server process.
- **ssh.socket:** Listens for incoming connections and can activate the SSH service when a connection arrives, if socket activation is configured.

An inactive `ssh.service` does not necessarily mean SSH is unavailable if `ssh.socket` is active and listening.

## Basic Security Notes

- Use strong authentication and prefer SSH keys when appropriate.
- Keep the operating system and SSH software updated.
- Allow SSH access only when needed and configure firewall rules carefully.
- Do not expose SSH to untrusted networks without understanding the security implications.

## Learning Progress

- [x] Identify the standard SSH port
- [x] Check SSH service status with `systemctl`
- [x] Inspect listening TCP ports with `ss`
- [x] Understand the difference between `ssh.service` and `ssh.socket`
- [ ] Learn to connect to another machine using SSH
- [ ] Learn how to configure SSH key authentication
