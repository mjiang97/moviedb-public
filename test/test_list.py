import unittest
from list import List
from unittest.mock import patch, MagicMock

class TestList(unittest.TestCase):
    def test_addEntry(self):
        list = List()
        self.assertEqual(list.addEntry(300), True)
        self.assertEqual(list.addEntry(300), False) # no duplicate entries in a list

    def test_removeEntry(self):
        list = List()
        list.addEntry(400)
        self.assertEqual(list.removeEntry(400), True)
        self.assertEqual(list.removeEntry(400), False)
    
    def test_deleteList(self):
        list = List()
        list.addEntry(301)
        list.addEntry(302)
        list.addEntry(303)
        list.deleteList()
        self.assertEqual(list.getList(), [])

    def test_renameList(self):
        list = List()
        list.renameList("My List")
        self.assertEqual(list.getListName(), "My List") # getListName not in arch diagram yet, can add

    def test_getList(self):
        list = List()
        list.addEntry(304)
        list.addEntry(305)
        self.assertEqual(list.getList(), [304, 305])
    
    @patch('list.MongoClient') # creates a mock MongoClient object
    def test_updateDB(self, mockMongoClient):
        mock_db = MagicMock() # mock database object, simulate behavior of the database methods
        mock_collection = MagicMock() # mock collection object, simulate behavior of the collection methods
        mockMongoClient.return_value = mock_db
        mock_db.__getitem__.return_value = mock_collection

        list = List()
        list.addEntry(306)
        list.addEntry(307)
        
        listName = list.getListName()
        result = list.updateDB(listName)

        #checks to see if the update_one method was called with the correct args
        mock_collection.update_one.assert_called_with(
            {"name": listName}, 
            {"$set": {"movies": [306, 307]}},
            upsert=True
        )
        self.assertTrue(result)