import os
import shutil

def setup_industrial_mockup(base_path="demo_factory_assets"):
    """
    Creates a complex industrial file structure for integrity testing.
    Categories: PLC, MES, R&D, HMI, BACKUP.
    """
    if os.path.exists(base_path):
        shutil.rmtree(base_path)
    
    os.makedirs(base_path)
    
    # 1. PLC Logic Controller
    plc_path = os.path.join(base_path, "plc_logic")
    os.makedirs(plc_path)
    with open(os.path.join(plc_path, "main_logic.bin"), "wb") as f:
        f.write(b"\x00\x01\x02\x03PLC_CORE_LOGIC\xff\xfe")
    with open(os.path.join(plc_path, "params.cfg"), "w") as f:
        f.write("MOTOR_SPEED=3000\nTEMP_LIMIT=85.5\nEMERGENCY_TIMEOUT=0.5")

    # 2. MES Manufacturing Execution System
    mes_path = os.path.join(base_path, "mes_server")
    os.makedirs(os.path.join(mes_path, "recipes"))
    with open(os.path.join(mes_path, "recipes", "paint_mixing.xml"), "w") as f:
        f.write("<recipe><red>40</red><blue>60</blue></recipe>")
    with open(os.path.join(mes_path, "auth_users.json"), "w") as f:
        f.write('{"admins": ["glory"], "operators": ["devsecops"]}')

    # 3. R&D Source Code (Vehicle Control Unit)
    rd_path = os.path.join(base_path, "rd_vcu_source")
    os.makedirs(rd_path)
    with open(os.path.join(rd_path, "control.c"), "w") as f:
        f.write("void vcu_main() { // Critical control logic\n  drive_motor();\n}")
    with open(os.path.join(rd_path, "encryption_key.h"), "w") as f:
        f.write("#define AES_KEY \"secret_factory_key\"")

    # 4. HMI Interface
    hmi_path = os.path.join(base_path, "hmi_display")
    os.makedirs(hmi_path)
    with open(os.path.join(hmi_path, "alarms.xaml"), "w") as f:
        f.write("<AlarmPanel Visibility='Visible' />")

    # 5. Backup Storage
    backup_path = os.path.join(base_path, "backup_storage")
    os.makedirs(backup_path)
    with open(os.path.join(backup_path, "last_safe_snapshot.zip"), "wb") as f:
        f.write(b"PK\x03\x04MOCK_BACKUP_DATA")

    print(f"✅ Industrial Mockup Environment created at: {os.path.abspath(base_path)}")
    return os.path.abspath(base_path)

if __name__ == "__main__":
    setup_industrial_mockup()
