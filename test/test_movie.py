import unittest
from movie import Movie

class TestMovie(unittest.TestCase):
    def setUp(self):
        self.sample_movie_data = {
            'id': 101,
            'title': 'Inception',
            'aliases': ['Inception', 'Inception Movie'],
            'release_date': '2010-07-16',
            'keywords': ['sci-fi', 'dream', 'mind-bending'],
            'watch_status': 'not started',
            'backdrop_path': 'inception_backdrop.jpg',
            'poster_path': 'inception_poster.jpg',
            'platform_links': {
                'Netflix': 'netflix.com/inception',
                'Hulu': 'hulu.com/inception'
            }
        }
        self.movie = Movie(self.sample_movie_data)
        
    def test_instance_type(self):
        self.assertIsInstance(self.movie, Movie)
        # self.assertIsInstance(self.movie, Entry)  # Should still be an Entry

    def test_getEntryType(self):
        self.assertEqual(self.movie.getType(), "movie")

    #test inherited methods
    def test_getEntryId(self):
        self.assertEqual(self.movie.getID(), 101)
    
    def test_getEntryTitle(self):
        self.assertEqual(self.movie.getTitle(), "Inception")
    
    def test_getEntryAliases(self):
        self.assertEqual(self.movie.getAliases(), ['Inception', 'Inception Movie'])
    
    def test_getEntryReleaseDate(self):
        self.assertEqual(self.movie.getReleaseDate(), "2010-07-16")
    
    def test_getEntryKeywords(self):
        self.assertEqual(self.movie.getKeywords(), ['sci-fi', 'dream', 'mind-bending'])
    
    def test_getEntryWatchStatus(self):
        self.assertEqual(self.movie.getWatchStatus(), "not started")
    
    def test_updateEntryWatchStatus(self):
        result = self.entry.updateWatchStatus(101, 2) # set to in progress? assuming 2 is WIP status
        self.assertTrue(result)
        self.assertEqual(self.entry.getWatchStatus(), 'in progress')

    def test_getEntryBackdropPath(self):
        self.assertEqual(self.movie.getBackdropPath(), "inception_backdrop.jpg")
    
    def test_getEntryPosterPath(self):
        self.assertEqual(self.movie.getPosterPath(), "inception_poster.jpg")
    
    def test_getEntryPlatformLinks(self):
        self.assertEqual(self.movie.getPlatformLinks(), {
            'Netflix': 'netflix.com/inception',
            'Hulu': 'hulu.com/inception'
        })