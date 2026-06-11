#!/usr/bin/env python3
"""Signed Cloudinary uploader. Reads CLOUDINARY_URL from .env. Never prints secrets."""
import hashlib, time, subprocess, json, re, sys, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def load_creds():
    for line in open(os.path.join(ROOT, ".env")):
        if line.strip().startswith("CLOUDINARY_URL=") and "Format" not in line:
            v = line.split("=", 1)[1].strip()
            m = re.match(r"cloudinary://(\d+):([^@]+)@(.+)", v)
            if m:
                return m.group(1), m.group(2), m.group(3)
    raise SystemExit("CLOUDINARY_URL not found")

API_KEY, API_SECRET, CLOUD = load_creds()

# (local_path, public_id) ; all placed under folder premiersalesgroup
UPLOADS = [
    ("generated_imgs/edited-2026-06-11T21-46-00-588Z-4py692.png", "jason-foley-headshot"),
    ("generated_imgs/generated-2026-06-11T21-46-47-602Z-6hbvax.png", "hero-copper-cable"),
    ("generated_imgs/generated-2026-06-11T21-47-40-977Z-4ftu1e.png", "logo-concept-monogram"),
    ("/Users/garyricke/mcp-servers/openai-images/generated-images/logo-concept-peak.png", "logo-concept-peak"),
    ("generated_imgs/generated-2026-06-11T21-50-41-596Z-ep1e6h.png", "logo-concept-link"),
]
FOLDER = "premiersalesgroup"

results = {}
for path, public_id in UPLOADS:
    abspath = path if os.path.isabs(path) else os.path.join(ROOT, path)
    if not os.path.exists(abspath):
        print(f"MISSING: {abspath}"); continue
    ts = str(int(time.time()))
    # params to sign (alphabetical): folder, public_id, timestamp
    to_sign = f"folder={FOLDER}&public_id={public_id}&timestamp={ts}{API_SECRET}"
    sig = hashlib.sha1(to_sign.encode()).hexdigest()
    cmd = [
        "curl", "-s", "-X", "POST",
        f"https://api.cloudinary.com/v1_1/{CLOUD}/image/upload",
        "-F", f"file=@{abspath}",
        "-F", f"api_key={API_KEY}",
        "-F", f"timestamp={ts}",
        "-F", f"public_id={public_id}",
        "-F", f"folder={FOLDER}",
        "-F", f"signature={sig}",
    ]
    out = subprocess.run(cmd, capture_output=True, text=True).stdout
    try:
        data = json.loads(out)
    except Exception:
        print(f"FAIL {public_id}: {out[:300]}"); continue
    if "secure_url" in data:
        results[public_id] = data["secure_url"]
        print(f"OK  {public_id} -> {data['secure_url']}")
    else:
        print(f"ERR {public_id}: {json.dumps(data)[:300]}")

print("\nCLOUD_NAME=" + CLOUD)
