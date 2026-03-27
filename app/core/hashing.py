from typing import List, Optional
from dirhash import dirhash
import os

def calculate_integrity_hash(
    directory_path: str, 
    algorithm: str = "sha256", 
    match: Optional[List[str]] = None, 
    ignore: Optional[List[str]] = None
) -> str:
    """
    Calculates the hash of a directory using the dirhash library.
    Standardized for manufacturing assets (firmware, code, config).
    """
    if not os.path.isdir(directory_path):
        raise ValueError(f"Path is not a directory: {directory_path}")
        
    return dirhash(
        directory_path, 
        algorithm, 
        match=match, 
        ignore=ignore, 
        jobs=os.cpu_count() or 1
    )

def compare_hashes(baseline_hash: str, current_hash: str) -> bool:
    """Simple comparison for audit logging."""
    return baseline_hash == current_hash
