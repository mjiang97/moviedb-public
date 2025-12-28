from classes.entry import Entry    

class Movie(Entry):
    def __init__(self, data):
        super().__init__(data)
        self.type = "movie"


"""format of data for constructor
{
            'id': 101,
            'title': 'Inception',
            'release_date': '2010-07-16',
            'watch_status': 'not started',
            'backdrop_path': 'inception_backdrop.jpg',
            'poster_path': 'inception_poster.jpg',
            'summary': 'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: "inception", the implantation of another person's idea into a target's subconscious.'
        }
"""