# Linux Networking

This document contains practical Linux networking commands and notes from my hands-on system administration learning.

## Network Information

### Show Network Interfaces and IP Addresses

```bash
ip a
```

Displays network interfaces and their IP addresses.

### Show the Routing Table

```bash
ip route
```

Displays the routing table, including the default gateway.

### Test Network Connectivity

```bash
ping 1.1.1.1
```

Tests connectivity to an IP address.

```bash
ping google.com
```

Tests connectivity using a domain name. This also helps verify DNS resolution.

### Check DNS Resolution

```bash
getent hosts google.com
```

Displays the IP address resolved for a hostname.

## Important Concepts

- **IP address:** Identifies a device on a network.
- **Private IP address:** Used within a local network, such as `192.168.1.8`.
- **Default gateway:** The router or other device used to reach destinations outside the local network, such as `192.168.1.1`.
- **DNS:** Translates domain names into IP addresses.
- **Network interface:** A connection through which a device communicates over a network, such as `wlp0s20f3` for Wi-Fi on my system.

## Troubleshooting Workflow

When troubleshooting network connectivity:

1. Check network interfaces and IP addresses with `ip a`.
2. Check the routing table with `ip route`.
3. Test connectivity to an IP address with `ping 1.1.1.1`.
4. Test domain resolution and connectivity with `ping google.com`.
5. If IP connectivity works but domain names fail, investigate DNS configuration.

## Learning Progress

- [x] Identify network interfaces and IP addresses
- [x] Find the default gateway
