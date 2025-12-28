class List:
    def __init__(self, data):
        self.name = ""
        self.ids = []
        if type(data) == dict:
            self.name = data["name"]
            # self._ids = [] # MongoDB ids
            self.ids = data["ids"] # TMDB ids
            # self.numMovies = 0
        elif type(data) == str:
            self.name = data

    def __str__(self):
        s = "[" 
        for id in self.ids:
            s += f"{id}, "
        s = s[:-2]
        s += "]"
        return s
    # def __str__(self):
    #     if not self.ids:
    #         return "[]"
    #     return "[" + ", ".join(map(str, self.ids)) + "]"

    # def get_IDs(self):
    #     return self._ids
    def getIDs(self):
        return self.ids
    def getName(self):
        return self.name
    def renameList(self, name):
        self.name = name
        return True
    def addEntry(self,id: str):
        self.ids.append(id)
        return True
    def removeEntry(self,id: str):
        self.ids.remove(id)
        return True
    def getDictFormat(self):
        data = {}
        data["name"] = self.name
        # data["_ids"] = self._ids
        data["ids"] = self.ids
        return data