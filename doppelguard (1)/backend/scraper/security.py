"""
SSRF Protection & Outbound HTTP Security Policy for DoppelGuard Scraper.

Enforces strict URL validation, DNS IP range checks, loopback/private IP blocking,
cloud metadata endpoint protection, and request sanitization.
"""

import socket
import ipaddress
import urllib.parse
from typing import Tuple, Optional, List

# Allowed public schemes
ALLOWED_SCHEMES = {"http", "https"}

# Domain allowlist for known social media platforms (optional strict mode)
SOCIAL_PLATFORM_DOMAINS = {
    "x.com", "twitter.com", "instagram.com", "linkedin.com",
    "github.com", "youtube.com", "t.me", "telegram.org",
    "facebook.com", "tiktok.com", "threads.net", "reddit.com"
}

# Forbidden metadata endpoints and hostnames
FORBIDDEN_HOSTNAMES = {
    "localhost", "localhost.localdomain", "127.0.0.1", "::1", "0.0.0.0",
    "instance-data", "metadata.google.internal", "169.254.169.254"
}

def validate_ssrf_safe_url(url: str, allow_any_public_web: bool = True) -> Tuple[bool, str, Optional[str]]:
    """
    Validates a URL against Server-Side Request Forgery (SSRF) vulnerabilities.

    Returns:
        (is_safe: bool, reason: str, resolved_ip: Optional[str])
    """
    cleaned_url = (url or "").strip()
    if not cleaned_url:
        return False, "URL cannot be empty.", None

    try:
        parsed = urllib.parse.urlparse(cleaned_url)
    except Exception as e:
        return False, f"Malformed URL format: {e}", None

    # 1. Scheme Check
    if parsed.scheme.lower() not in ALLOWED_SCHEMES:
        return False, f"Disallowed protocol scheme '{parsed.scheme}'. Only http and https are permitted.", None

    # 2. Hostname Check
    hostname = parsed.hostname
    if not hostname:
        return False, "URL missing valid hostname.", None

    hostname_lower = hostname.lower().strip()
    if hostname_lower in FORBIDDEN_HOSTNAMES or hostname_lower.endswith(".internal") or hostname_lower.endswith(".local"):
        return False, f"Forbidden hostname target '{hostname}' detected. Internal/metadata endpoint access blocked.", None

    # 3. Domain Allowlist / Scope Verification
    if not allow_any_public_web:
        domain_match = any(hostname_lower == domain or hostname_lower.endswith("." + domain) for domain in SOCIAL_PLATFORM_DOMAINS)
        if not domain_match:
            return False, f"Domain '{hostname}' is not in the approved social media platform allowlist.", None

    # 4. DNS IP Resolution & Range Validation (Prevents DNS Rebinding & Private Network Probing)
    try:
        addr_info = socket.getaddrinfo(hostname, parsed.port or (443 if parsed.scheme == "https" else 80), socket.AF_UNSPEC, socket.SOCK_STREAM)
        if not addr_info:
            return False, f"DNS resolution failed for hostname '{hostname}'.", None
    except socket.gaierror as err:
        return False, f"DNS resolution error for '{hostname}': {err}", None

    resolved_ips: List[str] = []
    for family, socktype, proto, canonname, sockaddr in addr_info:
        ip_str = sockaddr[0]
        resolved_ips.append(ip_str)

        try:
            ip_obj = ipaddress.ip_address(ip_str)
        except ValueError:
            return False, f"Invalid IP address resolved: '{ip_str}'.", None

        # Check IP Ranges
        if ip_obj.is_loopback:
            return False, f"SSRF Block: Host '{hostname}' resolves to loopback IP '{ip_str}'. Access denied.", ip_str
        if ip_obj.is_private:
            return False, f"SSRF Block: Host '{hostname}' resolves to private network IP '{ip_str}'. Access denied.", ip_str
        if ip_obj.is_link_local:
            return False, f"SSRF Block: Host '{hostname}' resolves to link-local/cloud metadata IP '{ip_str}'. Access denied.", ip_str
        if ip_obj.is_multicast or ip_obj.is_reserved or ip_obj.is_unspecified:
            return False, f"SSRF Block: Host '{hostname}' resolves to reserved/multicast IP '{ip_str}'. Access denied.", ip_str

    primary_ip = resolved_ips[0] if resolved_ips else None
    return True, f"URL is SSRF-validated and safe (Resolved IP: {primary_ip}).", primary_ip
