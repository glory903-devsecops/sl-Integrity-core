import unittest
from app.services.integrity_service import calculate_integrity_hash, check_asset_integrity
import os
import shutil

class TestIntegrityService(unittest.TestCase):
    def setUp(self):
        # Create a temporary directory for testing
        self.test_dir = "test_node_data"
        os.makedirs(self.test_dir, exist_ok=True)
        with open(os.path.join(self.test_dir, "config.txt"), "w") as f:
            f.write("Initial Config Data")

    def tearDown(self):
        # Clean up temporary directory
        if os.path.exists(self.test_dir):
            shutil.rmtree(self.test_dir)

    def test_hash_consistency(self):
        # Test that the same content results in the same hash
        hash1 = calculate_integrity_hash(self.test_dir)
        hash2 = calculate_integrity_hash(self.test_dir)
        self.assertEqual(hash1, hash2)

    def test_tamper_detection(self):
        # Initial hash
        initial_hash = calculate_integrity_hash(self.test_dir)
        
        # Tamper with the file
        with open(os.path.join(self.test_dir, "config.txt"), "a") as f:
            f.write(" - Tampered!")
            
        new_hash = calculate_integrity_hash(self.test_dir)
        self.assertNotEqual(initial_hash, new_hash)

if __name__ == "__main__":
    unittest.main()
