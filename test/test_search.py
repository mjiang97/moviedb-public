import unittest
from search import Search
from entry import Entry

class TestSearch(unittest.TestCase):
    def setUp(self):
        # sample search instance
        self.search = Search()
        
        # mock data
        self.sample_movie_results = [101, 102, 103]
        self.sample_tv_results = [201, 202, 203]
    
    def test_searchTitle(self):
        results = self.search.searchTitle("Inception")
        self.assertIsInstance(results, list)
        self.assertTrue(all(isinstance(movie_id, int) for movie_id in results))
        
        # edge case: if no results are found
        empty_results = self.search.searchTitle("random")
        self.assertEqual(empty_results, [])
    
    def test_searchKeyword(self):
        results = self.search.searchKeyword("sci-fi")
        self.assertIsInstance(results, list)
        self.assertTrue(all(isinstance(result_id, int) for result_id in results))
        
        # edge case: if no results are found
        empty_results = self.search.searchKeyword("random")
        self.assertEqual(empty_results, [])
    
    def test_makeEntry(self):
        entry = self.search.makeEntry(101, "movie")
        self.assertIsInstance(entry, Entry)
        self.assertEqual(entry.id, 101)
        self.assertEqual(entry.type, "movie")
        
        # edge case: invalid ID
        with self.assertRaises(ValueError):
            self.search.makeEntry(None, "movie")
        
        # edge case: invalid type
        with self.assertRaises(ValueError):
            self.search.makeEntry(101, "unknown_type")
    
    def test_makeEntries(self):
        entries = self.search.makeEntries(self.sample_movie_results, "movie", page_limit=2)
        self.assertIsInstance(entries, list)
        self.assertTrue(all(isinstance(entry, Entry) for entry in entries))
        self.assertEqual(len(entries), 2)  # makes sure page limit is respected
        # edge case: page_limit is 0
        empty_entries = self.search.makeEntries(self.sample_movie_results, "movie", page_limit=0)
        self.assertEqual(empty_entries, [])
        
        # edge case: if page_limit exceeds available entries
        all_entries = self.search.makeEntries(self.sample_movie_results, "movie", page_limit=10)
        self.assertEqual(len(all_entries), len(self.sample_movie_results))

if __name__ == "__main__":
    unittest.main()
