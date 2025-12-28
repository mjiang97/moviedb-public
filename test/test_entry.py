import unittest
# from entry import Entry
import entry

class TestEntry(unittest.TestCase):
    def setup(self):
        #sample entry
        self.sample_entry_data = {
            'id': 1, 
            'title': 'Despicable Me 1',
            'aliases': ['Despicable Me', 'Despicable Me 1', 'despicable me 1'],
            'release date': '2010-07-09',
            'keywords': ['minions', 'gru', 'banana'], 
            'watch_status': 'in progress', 
            'backdrop_path': 'backdrop.jpg',
            'poster_path': 'poster.jpg',
            'platform_links': {
                'Netflix': 'netflix.com/despicableme1',
                'Hulu': 'hulu.com/despicableme1'
            },
            'type': 'movie'
        }
        self.entry = Entry(self.sample_entry_data)

    def test_getEntryId(self):
        self.assertEqual(self.entry.getEntryId(), 1)

    def test_getEntryTitle(self):
        self.assertEqual(self.entry.getEntryTitle(), 'Despicable Me 1')
    
    def test_getEntryAliases(self):
        self.assertEqual(self.entry.getEntryAliases(), ['Despicable Me', 'Despicable Me 1', 'despicable me 1'])

    def test_getEntryReleaseDate(self):
        self.assertEqual(self.entry.getEntryReleaseDate(), '2010-07-09')

    def test_getEntryKeywords(self):
        self.assertEqual(self.entry.getEntryKeywords(), ['minions', 'gru', 'banana'])
    
    def test_getEntryWatchStatus(self):
        self.assertEqual(self.entry.getEntryWatchStatus(), 'in progress')
    
    def test_updateEntryWatchStatus(self):
        result = self.entry.updateEntryWatchStatus(1, 3) # set to completed? assuming 3 is completed status
        self.assertTrue(result)
        self.assertEqual(self.entry.getEntryWatchStatus(), 'completed')

    def test_getEntryBackdropPath(self):
        self.assertEqual(self.entry.getEntryBackdropPath(), 'backdrop.jpg')
    
    def test_getEntryPosterPath(self):
        self.assertEqual(self.entry.getEntryPosterPath(), 'poster.jpg')
    
    def test_getEntryPlatformLinks(self):
        self.assertEqual(self.entry.getEntryPlatformLinks(), {
            'Netflix': 'netflix.com/despicableme1',
            'Hulu': 'hulu.com/despicableme1'
        })
    
    def test_getEntryType(self):
        self.assertEqual(self.entry.getEntryType(), 'movie')