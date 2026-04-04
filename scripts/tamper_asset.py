import os
import sys

TARGET_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'demo_assets', 'plc_logic'))
TARGET_FILE = os.path.join(TARGET_DIR, 'firmware.bin')

def tamper():
    if not os.path.exists(TARGET_FILE):
        print(f"Error: {TARGET_FILE} not found.")
        return
    
    with open(TARGET_FILE, 'a') as f:
        f.write("\n[ALERT] UNAUTHORIZED_MALICIOUS_PAYLOAD_DETECTED_v2.0\n")
    print(f"Successfully tampered with {TARGET_FILE}. Integrity is now BROKEN.")

def restore():
    # Simplest way: just recreate the file since it's a demo
    with open(TARGET_FILE, 'w') as f:
        f.write("BASELINE_CODE_v1.0\n")
    print(f"Restored {TARGET_FILE} to original state. Integrity is now HEALTHY.")

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == 'restore':
        restore()
    else:
        tamper()
