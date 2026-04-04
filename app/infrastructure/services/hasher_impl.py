import os
import hashlib
from typing import List, Optional
from dirhash import dirhash
from ...domain.interfaces import HashingServiceInterface

class DirHasher(HashingServiceInterface):
    def calculate_hash(self, directory_path: str, algorithm: str = "sha256") -> str:
        """
        Calculates the hash of a directory using the dirhash library.
        Standardized for manufacturing assets.
        """
        if not os.path.isdir(directory_path):
            # Fallback to deterministic mock hash for non-existent paths (simulation)
            return hashlib.sha256(directory_path.encode()).hexdigest()
            
        return dirhash(
            directory_path, 
            algorithm, 
            jobs=os.cpu_count() or 1
        )
