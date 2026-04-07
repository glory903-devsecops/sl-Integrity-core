# Industrial Tampering Scenario Catalog (v1.0)

This document details the 30 high-stakes industrial tampering scenarios implemented in the `industrial_tamper_suite.py` automation script.

| Case | Category | Scenario Name | Description | Detection Rule |
| :--- | :--- | :--- | :--- | :--- |
| 01 | PLC | Binary Logic Modification | Appending malicious binary instruction to `main_logic.bin`. | Hash Mismatch (Firmware) |
| 02 | PLC | Parameter Overload Change | Modifying `MOTOR_SPEED_LIMIT` from 500 to 9999 rpm in `params.cfg`. | Config Integrity |
| 03 | PLC | Critical Binary Deletion | Deleting the core `main_logic.bin` file. | File Absence |
| 04 | PLC | Config File Truncation | Wiping out the contents of the parameter configuration file. | Size Mismatch |
| 05 | PLC | Unauthorized Script Injection | Injecting a Python backdoor `backdoor.py` into the control directory. | New File Detection |
| 06 | R&D | Disabling Safety Guard | Commenting out `emergency_stop()` function in `control.c` source code. | Hash Mismatch (Source) |
| 07 | R&D | Secret Key Tampering | Injecting a leaked/compromised key into `encryption_key.h`. | Content Pattern Hash |
| 08 | R&D | Symbolic Link Traversal | Linking an internal log to `/etc/shadow` (Simulated). | Symlink Inconsistency |
| 09 | MES | Dangerous Recipe Injection | Injecting an invalid `<chemical_ratio>` in the `mixing_recipe.xml`. | XML Data Integrity |
| 10 | MES | Unauthorized User Promotion | Modifying `auth_users.json` to grant admin rights to an outsider. | JSON Key-Value Hash |
| 11 | HMI | Firmware Overwrite | Overwriting the display firmware `display_fw.bin` with dummy data. | Hash Mismatch (FW) |
| 12 | HMI | Screen Layout manipulation | Changing UI coordinates in `layout.cfg` to hide emergency buttons. | UI Config Integrity |
| 13 | HMI | Hidden Command Execution | Appending a shell execution command to an event listener. | Hash Mismatch (Action) |
| 14 | Backup | Storage Shadowing | Replacing the latest backup archive with an old version. | Hash Mismatch (Backup) |
| 15 | Backup | Schedule Modification | Disabling the automated daily backup flag in `cron_job.cfg`. | Config State Change |
| 16 | Network | ARP Poisoning Config | Injecting a static ARP entry into the network configuration file. | Config Hash Mismatch |
| 17 | Sensor | Calibration Drift Injection | Adding a hidden offset to sensor data points in `calibration.dat`. | Data File Integrity |
| 18 | Robot | Origin Point Shift | Modifying the robot's zero-point coordinates in `coordinates.txt`. | Coord-Hash Mismatch |
| 19 | Robot | Sequence Step Removal | Deleting a critical sub-step in the robot's movement sequence. | Sequence Hash Mismatch |
| 20 | CNC | Tooling Table Tamper | Changing dimensions of tool #14 (drill bit thickness) in table. | Tool-Hash Mismatch |
| 21 | CNC | Spindle Speed Bypass | Commenting out the RPM limit check in the `safety.c` source. | Source Hash Mismatch |
| 22 | Logistics | AGV Route Map Mod | Modifying the excluded/forbidden zones in the AGV's map file. | Map Integrity |
| 23 | Logistics | Battery Limit Change | Decreasing the low-battery warning threshold in `battery_mgmt.cfg`. | Threshold Integrity |
| 24 | Security | Access Log Deletion | Wiping the access history logs to hide evidence of a breach. | Log Hash Mismatch |
| 25 | Security | Camera Overlay Inject | Injecting a static "looping" background into the camera stream config. | Stream Hash Mismatch |
| 26 | Power | Grid Frequency Mock | Changing the target frequency values in the power distribution node. | Power Config Integrity |
| 27 | HVAC | Temp Setpoint Spike | Overriding the max temperature limit in the facility HVAC controller. | HVAC Config Hash |
| 28 | Foundry | Cooling Cycle Skip | Disabling the mandatory cooling timer in the casting logic. | Logic Hash Mismatch |
| 29 | Assembly | Torque Limit Mod | Setting the assembly torque value to a dangerously high level. | Torque Config Hash |
| 30 | Lab | Test Result Forgery | Injecting a fake "PASS" signature into a failed test log file. | Log Sig-Hash Mismatch |
