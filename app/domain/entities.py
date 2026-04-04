from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime

class Asset(BaseModel):
    id: Optional[int] = None
    name: str
    path: str
    description: Optional[str] = None
    department: Optional[str] = None
    current_hash: Optional[str] = None
    last_scanned_at: Optional[datetime] = None
    is_consistent: bool = True

    class Config:
        from_attributes = True

class ScanResult(BaseModel):
    id: Optional[int] = None
    baseline_id: int
    scanned_path: str
    scanned_hash: str
    is_consistent: bool
    details: str
    scan_time: datetime

    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    total_assets: int
    healthy_assets: int
    critical_issues: int
    total_scans: int
    uptime: str = "99.9%"
