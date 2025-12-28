class Entry:
    def __init__(self, data):
        self.id = data["id"]
        self.title = data["title"]
        self.release_date = data["release_date"]
        if "watch_status" in data:
            watch_status = data["watch_status"]
            if watch_status == "Not Started":
                self.watch_status = watch_status
            elif watch_status == "Watching":
                self.watch_status = watch_status
            elif watch_status == "Done":
                self.watch_status = watch_status
            else:
                self.watch_status = "Not Started"
        else:
            self.watch_status = "Not started"
        self.backdrop_path = data["backdrop_path"]
        self.poster_path = data["poster_path"]
        self.summary = data["summary"]
        self.type = ""

    def __str__(self):
        return f"id {self.id}: {self.title}"

    def getID(self):
        return self.id
    def getTitle(self):
        return self.title
    def getReleaseDate(self):
        return self.release_date
    def getWatchStatus(self):
        return self.watch_status
    def getBackdropPath(self):
        return self.backdrop_path
    def getPosterPath(self):
        return self.poster_path
    def getSummary(self):
        return self.summary
    def getType(self):
        return self.type

    def updateWatchStatus(self, option):
        if option == "Not Started":
            self.watch_status = "Not Started"
            return True
        elif option == "Watching":
            self.watch_status = "Watching"
            return True
        elif option == "Done":
            self.watch_status = "Done"
            return True
        else:
            self.watch_status = option 
            return False
        
    def getDictFormat(self): # needs to be fixed to actually process it incase information chagnes
        data = {}
        data["id"] = str(self.id) if isinstance(self.id, int) else self.id
        data["title"] = self.title
        data["release_date"] = self.release_date
        data["watch_status"] = self.watch_status
        data["backdrop_path"] = self.backdrop_path
        data["poster_path"] = self.poster_path
        data["summary"] = self.summary
        data["type"] = self.type
        return data
    