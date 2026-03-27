from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, ForeignKey, DateTime, Integer, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .core.database import Base

class Baseline(Base):
    __tablename__ = "baselines"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    path: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(1000))
    current_hash: Mapped[str] = mapped_column(String(128), nullable=False)
    last_scanned_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    scans: Mapped[List["ScanResult"]] = relationship(back_populates="baseline", cascade="all, delete-orphan")

class ScanResult(Base):
    __tablename__ = "scan_results"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    baseline_id: Mapped[int] = mapped_column(ForeignKey("baselines.id"), nullable=False)
    scanned_path: Mapped[str] = mapped_column(String(500), nullable=False)
    scanned_hash: Mapped[str] = mapped_column(String(128), nullable=False)
    is_consistent: Mapped[bool] = mapped_column(Boolean, default=True)
    details: Mapped[Optional[str]] = mapped_column(String(1000))
    scanned_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    baseline: Mapped["Baseline"] = relationship(back_populates="scans")
