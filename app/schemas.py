from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class BaselineBase(BaseModel):
    name: str = Field(..., description="공장 자산/모듈의 이름")
    path: str = Field(..., description="디렉토리의 절대 경로")
    description: Optional[str] = Field(None, description="자산에 대한 상세 설명")

class BaselineCreate(BaselineBase):
    pass

class Baseline(BaselineBase):
    id: int
    current_hash: str
    is_consistent: bool = True
    created_at: datetime

    class Config:
        from_attributes = True

class ScanResultBase(BaseModel):
    baseline_id: int
    scanned_path: str
    scanned_hash: str
    is_consistent: bool
    details: Optional[str] = None

class ScanResultCreate(ScanResultBase):
    pass

class ScanResult(ScanResultBase):
    id: int
    scanned_at: datetime

    class Config:
        from_attributes = True
