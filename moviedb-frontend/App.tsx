import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, FlatList, ScrollView, Modal, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import axios from 'axios';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DropDownPicker from 'react-native-dropdown-picker';

const Stack = createNativeStackNavigator();

type Movie = {
  id: number;
  title: string;
  poster_path?: string;
  release_date?: string;
  summary?: string;
  watch_status?: string;
  backdrop_path?: string; // Add this line
}; 

// Define your navigation parameter list
type RootStackParamList = {
  MovieDB: undefined;
  Lists: undefined;
  SearchResults: { query: string };
  MovieDetails: {item: Movie};
};

// Define prop types for SearchScreen
type SearchScreenRouteProp = RouteProp<RootStackParamList, 'SearchResults'>;
type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SearchResults'>;

type SearchScreenProps = {
  route: SearchScreenRouteProp;
  navigation: SearchScreenNavigationProp;
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          header: ({ navigation }) => (
            <CustomHeader navigation={navigation} />
          ),
        }}>
        <Stack.Screen name="MovieDB" component={HomeScreen}/>
        <Stack.Screen name="Lists" component={Lists}/>
        <Stack.Screen name="SearchResults" component={SearchScreen}/>
        <Stack.Screen name="MovieDetails" component={MovieDetails}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const CustomHeader = ({ navigation }: { navigation: any }) => {
  // allows searchQuery to update in real time as user types in search box
  const [searchQuery, setSearchQuery] = useState('');

  // handles the search when the user presses enter
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('SearchResults', { query: searchQuery.trim() });
    }
  };

  return (
    <View style={styles.navBar}>
      <View style={styles.navItemsContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('MovieDB')}>
          <Text style={styles.movieItem}>MovieDB</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Lists')}>
          <Text style={styles.navItem}>Lists</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
      <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a movie..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>
    </View>
  );
};

const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loadingContinue, setLoadingContinue] = useState(true);
  const [continueWatchingMovies, setContinueWatchingMovies] = useState<Movie[]>([]);
  const [loadingStart, setLoadingStart] = useState(true);
  const [startWatchingMovies, setStartWatchingMovies] = useState<Movie[]>([]);

  useEffect(() => {
    fetchContinueWatchingList();
    fetchStartWatchingList();
  }, []);

  const fetchContinueWatchingList = async () => {
    try {
      setLoadingContinue(true);
      const response = await axios.get('http://127.0.0.1:5001/api/lists/Continue%20Watching');
      if (response.data && response.data.list && response.data.list.movies) {
        setContinueWatchingMovies(response.data.list.movies);
      } else {
        setContinueWatchingMovies([]);
      }
    } catch(err) {
      setContinueWatchingMovies([]);
    } finally {
      setLoadingContinue(false);
    }
  }
  const fetchStartWatchingList = async () => {
    try {
      setLoadingStart(true);
      const response = await axios.get('http://127.0.0.1:5001/api/lists/Start%20Watching');
      if (response.data && response.data.list && response.data.list.movies) {
        setStartWatchingMovies(response.data.list.movies);
      } else {
        setStartWatchingMovies([]);
      }
    } catch(err) {
      setStartWatchingMovies([]);
    } finally {
      setLoadingStart(false);
    }
  }

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity 
      style={styles.movieCard}
      onPress={() => {
        navigation.navigate('MovieDetails', { item });
      }}
    >
      <View style={styles.movieContent}>
        {item.poster_path ? (
          <Image 
            source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
            style={styles.poster}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noPoster}>
            <Ionicons name="film-outline" size={40} color="#999" />
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={styles.movieTitle} numberOfLines={2}>{item.title}</Text>
          {item.release_date && (
            <Text style={styles.releaseDate}>
              {new Date(item.release_date).getFullYear()}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyList = (message: string) => (
    <View style={styles.emptyListContainer}>
      <Ionicons name="film-outline" size={40} color="#ccc" />
      <Text style={styles.emptyListText}>{message}</Text>
    </View>
  );

  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContent}
      showsVerticalScrollIndicator={true}
    >
    <View style={styles.listContainer}>
    <View style={styles.listSection}>
      <Text style={styles.sectionTitle}>Continue Watching</Text>
      {loadingContinue ? (
        <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
      ) : continueWatchingMovies.length > 0 ? (
        <FlatList
          data={continueWatchingMovies}
          renderItem={renderMovieItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />
      ) : (
        renderEmptyList("No movies in progress")
      )}
    </View>

    <View style={styles.listSection}>
      <Text style={styles.sectionTitle}>Start Watching</Text>
      {loadingStart ? (
        <View style={styles.container}>
        <Text>Loading...</Text>
        </View>
      ) : startWatchingMovies.length > 0 ? (
        <FlatList
          data={startWatchingMovies}
          renderItem={renderMovieItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />
      ) : (
        renderEmptyList("No movies in your watch list")
      )}
    </View>
  </View>
  </ScrollView>
  );
}

const Lists = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(true);
  const [lists, setLists] = useState<{name: string, id: string, movies: Movie[]}[]>([]);

  useEffect(() => {
    fetchAllLists();
  }, []);

  const fetchAllLists = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:5001/api/lists');
      if (response.data && response.data.lists) {
        // filter out continue/start watching lists
        const filteredLists = response.data.lists.filter(
          (list: {name: string}) => 
            list.name !== "Continue Watching" && 
            list.name !== "Start Watching"
        );
        
        // fetch movies for each list
        const listsWithMovies = await Promise.all(
          filteredLists.map(async (list: {name: string}) => {
            try {
              const listResponse = await axios.get(`http://127.0.0.1:5001/api/lists/${encodeURIComponent(list.name)}`);
              if (listResponse.data && listResponse.data.list) {
                return {
                  name: list.name,
                  id: list.name,
                  movies: listResponse.data.list.movies || []
                };
              }
              return { name: list.name, id: list.name, movies: [] };
            } catch (err) {
              console.error(`Error fetching movies for list ${list.name}:`, err);
              return { name: list.name, id: list.name, movies: [] };
            }
          })
        );
        
        setLists(listsWithMovies);
      } else {
        setLists([]);
      }
    } catch (err) {
      console.error("Error fetching lists:", err);
      setLists([]);
    } finally {
      setLoading(false);
    }
  };

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity 
      style={styles.movieCard}
      onPress={() => {
        navigation.navigate('MovieDetails', { item });
      }}
    >
      <View style={styles.movieContent}>
        {item.poster_path ? (
          <Image 
            source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
            style={styles.poster}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noPoster}>
            <Ionicons name="film-outline" size={40} color="#999" />
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={styles.movieTitle} numberOfLines={2}>{item.title}</Text>
          {item.release_date && (
            <Text style={styles.releaseDate}>
              {new Date(item.release_date).getFullYear()}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyList = (message: string) => (
    <View style={styles.emptyListContainer}>
      <Ionicons name="film-outline" size={40} color="#ccc" />
      <Text style={styles.emptyListText}>{message}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading lists...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContent}
      showsVerticalScrollIndicator={true}
    >
      <View style={styles.listContainer}>
        {lists.length === 0 ? (
          <View style={styles.noListsContainer}>
            <Ionicons name="list-outline" size={50} color="#ccc" />
            <Text style={styles.noListsText}>No custom lists found</Text>
            <Text style={styles.noListsSubtext}>Add movies to lists from the movie details page</Text>
          </View>
        ) : (
          lists.map((list) => (
            <View key={list.id} style={styles.listSection}>
              <Text style={styles.sectionTitle}>{list.name}</Text>
              {list.movies.length > 0 ? (
                <FlatList
                  data={list.movies}
                  renderItem={renderMovieItem}
                  keyExtractor={(item) => item.id.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalList}
                />
              ) : (
                renderEmptyList("No movies in this list")
              )}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const SearchScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'SearchResults'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { query } = route.params;
  // useState sets the default state of each variable
  // setResults, setLoading, setError are the functions that will update the states for results, loading, and error
  
  type Movie = {
    id: number;
    title: string;
    poster_path?: string;
    release_date?: string;
    summary?: string;
    watch_status?: string;
    backdrop_path?: string;
  };
  
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5001/api/movies/search?query=${encodeURIComponent(query)}`);
        setResults(response.data.results || []);
      } catch (err) {
        console.error('Error fetching results:', err);
        setError('Failed to fetch results');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  if (loading) return (
    <View style={styles.container}>
      <Text>Loading...</Text>
    </View>
  );
  if (error) return (
    <View style={styles.container}>
      <Text>{error}</Text>
    </View>
  );
  return (
    <View style={styles.resultsContainer}>
      <Text style={styles.resultsHeader}>Results for "{query}"</Text>
      {results.length === 0 ? (
        <Text style={styles.noResults}>No movies found</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.movieCard}
              onPress={() => {
                // add navigation to a movie details screen here later
                console.log('Movie selected:', item.title);
                navigation.navigate('MovieDetails', {item : item});
              }}
            >
              <View style={styles.movieSearchResultContent}>
                {item.poster_path ? (
                  <Image 
                    source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
                    style={styles.poster}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.noPoster}>
                    <Ionicons name="film-outline" size={40} color="#999" />
                  </View>
                )}
                <View style={styles.movieInfo}>
                  <Text style={styles.movieSearchResultTitle} numberOfLines={2}>{item.title}</Text>
                  {item.release_date && (
                    <Text style={styles.releaseDate}>
                      {new Date(item.release_date).getFullYear()}
                    </Text>
                  )}
                  {item.summary && (
                    <Text style={styles.summary} numberOfLines={3}>
                      {item.summary}
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const MovieDetails = () => {
  // need to check if item is a Movie type
  const route = useRoute<RouteProp<RootStackParamList, 'MovieDetails'>>();
  // const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { item } = route.params;

  const [selectedStatus, setSelectedStatus] = useState<string | null>(item.watch_status || null);
  const [open, setOpen] = useState(false); // Controls dropdown visibility
  const [items, setItems] = useState([
    { label: "Not Started", value: "Not Started" },
    { label: "Watching", value: "Watching" },
    { label: "Done", value: "Done" },
  ]);

  const [popoverVisible, setPopoverVisible] = useState(false);
  const [availableLists, setAvailableLists] = useState<{name: string, id: string}[]>([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkMovieStatus = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5001/api/movies/${item.id}`);
        if (response.data && response.data.movie && response.data.movie.watch_status) {
          setSelectedStatus(response.data.movie.watch_status);
        }
      } catch (err) {
        console.log("Movie doesn't exist in database yet");
      }
    };
    checkMovieStatus();
    fetchAvailableLists();
  }, [item.id]);

  const fetchAvailableLists = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:5001/api/lists');
      if (response.data && response.data.lists) {
        setAvailableLists(response.data.lists.map((list: any) => ({
          name: list.name,
          id: list.name, 
        })));
      }
    } catch (err) {
      console.error("Error fetching lists:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateWatchStatus = async (movieId: string, newStatus: string) => {
    try {
      //try to update the watch status, if the movie exists, this will work
      const updateResponse = await axios.put(`http://127.0.0.1:5001/api/movies/${movieId}/watch_status`, {
        watch_status: newStatus,
      });
      console.log("Watch status updated:", updateResponse.data);
      setSelectedStatus(newStatus);
      alert("Watch status updated to " + newStatus);
    } catch(err: any) {
      if (err.response && err.response.status === 404) {
        console.log("Movie doesn't exist in database, adding it first...");
        const addMovieResponse = await axios.post('http://127.0.0.1:5001/api/movies/add', {
          movie: {
            id: movieId,
            title: item.title,
            poster_path: item.poster_path ?? null,
            release_date: item.release_date ?? null,
            summary: item.summary ?? null,
            backdrop_path: item.backdrop_path ?? null,
            watch_status: newStatus,
          }
        });
        console.log("Movie added to database:", addMovieResponse.data);
        setSelectedStatus(newStatus);
        alert("Movie added to database with status " + newStatus);
      } else {
        console.error("Error updating watch status:", err);
        alert("Failed to update watch status.");
      }
    }
  };
  const addMovieToList = async (listName: string) => {
    try {
      // check the movie exists in the db
      let movieExists = true;
      try {
        await axios.get(`http://127.0.0.1:5001/api/movies/${item.id}`);
      } catch (err) {
        movieExists = false;
        console.log("Movie doesn't exist in db, adding it first");
      }
      // If movie doesn't exist, add it first
      if (!movieExists) {
        const addResponse = await axios.post('http://127.0.0.1:5001/api/movies/add', {
          movie: {
            id: item.id,
            title: item.title,
            poster_path: item.poster_path ?? null,
            release_date: item.release_date ?? null,
            summary: item.summary ?? null,
            backdrop_path: item.backdrop_path ?? null,
            watch_status: selectedStatus || "Not Started",
          }
        });
        console.log("Added movie response:", addResponse.data);
      }
  
      // add the movie to the list
      const addToListResponse = await axios.post(`http://127.0.0.1:5001/api/lists/${encodeURIComponent(listName)}/movies`, {
        _id: item.id
      });
      
      console.log("Added to list response:", addToListResponse.data);
      alert(`Added "${item.title}" to "${listName}"`);
      setPopoverVisible(false);
    } catch (err) {
      console.error("Error adding movie to list:", err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      alert(`Failed to add "${item.title}" to "${listName}". Error: ${errorMessage}`);
    }
  };

  const createNewList = async () => {
    if (!newListName.trim()) {
      alert("Please enter a list name");
      return;
    }
    console.log("Creating new list:", newListName);
    try {
      await axios.post('http://127.0.0.1:5001/api/lists/add', {
        name: newListName
      });
      await addMovieToList(newListName);
      fetchAvailableLists();
      
      // close modals
      setCreateModalVisible(false);
      setPopoverVisible(false);
      setNewListName('');
    } catch (err) {
      console.error("Error creating new list:", err);
      alert(`Failed to create new list with list name: ${newListName}`);
    }
  };
  
  return (
    <View style={styles.movieDetailsContainer}>
      {item.poster_path ? (
        <Image 
          source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
          style={styles.movieDetailsPoster}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.movieDetailsNoPoster}>
          <Ionicons name="film-outline" size={40} color="#999" />
        </View>
        )}
        <View style={styles.movieDetailsWords}>
          <Text style={styles.movieDetailsTitle}>{item.title}</Text>
          <View style={styles.movieDetailsButtonContainer}>
            <TouchableOpacity 
              style={styles.movieDetailsButton}
              onPress={() => setPopoverVisible(true)}
            >
              <Text style={styles.movieDetailsButtonText}>Add to List</Text>
              <AntDesign name="pluscircleo" size={24} color="white" />
            </TouchableOpacity>
                {/* </View> */}
                {/* <Text style={styles.dropdownLabel}>Watch Status:</Text> */}
            <View style={styles.dropdownContainer}>
              <DropDownPicker
                open={open}
                value={selectedStatus}
                items={items}
                setOpen={setOpen}
                setValue={setSelectedStatus}
                setItems={setItems}
                onChangeValue={(value: string | null) => {
                  updateWatchStatus(item.id.toString(), value as string);
                }}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownLabel}
                labelStyle={{ color: '#ffffff' }}
              />
                {/* </View> */}
            </View>
          </View>
          <View style={styles.summaryWrapper}>
            <Text style={styles.movieDetailsSummary}>{item.summary}</Text>
          </View>
        </View>
        {/* List Selection popup screen */}
        <Modal
          visible={popoverVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setPopoverVisible(false)}
        >
          <TouchableOpacity 
            style={styles.popoverOverlay}
            activeOpacity={1}
            onPress={() => setPopoverVisible(false)}
          >
            <View 
              style={styles.popoverContainer}
              onStartShouldSetResponder={() => true}
              onTouchEnd={(e) => e.stopPropagation()}
            >
              <View style={styles.popoverHeader}>
                <Text style={styles.popoverTitle}>Add to List</Text>
                <TouchableOpacity onPress={() => setPopoverVisible(false)}>
                  <AntDesign name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.listScrollView}>
                {loading ? (
                  <Text style={styles.loadingText}>Loading lists...</Text>
                ) : availableLists.length > 0 ? (
                  availableLists.map((list) => (
                    <TouchableOpacity 
                      key={list.id}
                      style={styles.listItem}
                      onPress={() => addMovieToList(list.name)}
                    >
                      <Text style={styles.listItemText}>{list.name}</Text>
                      <AntDesign name="plus" size={20} color="#555" />
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.noListsText}>No lists available</Text>
                )}
              </ScrollView>
              
              <TouchableOpacity 
                style={styles.createListButton}
                onPress={() => {
                  setCreateModalVisible(true);
                }}
              >
                <AntDesign name="plus" size={18} color="white" />
                <Text style={styles.createListButtonText}>Create New List</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
        
        {/* Create New List Modal */}
        <Modal
          visible={createModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setCreateModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Create New List</Text>
              
              <TextInput
                style={styles.modalInput}
                placeholder="Enter list name"
                value={newListName}
                onChangeText={setNewListName}
                autoFocus
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setCreateModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.createButton]}
                  onPress={createNewList}
                >
                  <Text style={styles.createButtonText}>Create</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  cancelButton: {
    backgroundColor: '#f2f2f2',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#2a64db',
    marginLeft: 10,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff'
  },
  continueWatching: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  continueWatchingContainer: {
    padding: 20,
    justifyContent: 'flex-start',
  },
  createListButton: {
    flexDirection: 'row',
    backgroundColor: '#2a64db',
    borderRadius: 5,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  createListButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  dropdown: {
    backgroundColor: '#0D253F',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    padding: 10,
  },
  dropdownContainer: {
    width: 130,
    zIndex: 1000,
    marginBottom:5,
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    position: 'absolute',
    zIndex: 1000,
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  emptyListContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    padding: 20,
  },
  emptyListText: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
  },
  horizontalList: {
    paddingRight: 20,
  },
  listContainer: {
    justifyContent: 'flex-start',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listItemText: {
    fontSize: 16,
    color: '#333',
  },
  listScrollView: {
    maxHeight: 250,
  },
  listSection: {
    marginBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    textAlign: 'center',
    padding: 20,
    color: '#777',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalContainer: {
    width: '50%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  movieCard: {
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    padding: 15,
  }, 
  movieContent: {
    width: 130,
    alignItems: 'center',
    margin: 10,
  },
  movieDetailsButton: {
    backgroundColor: '#0D253F',
    color: '#fff',
    height: 40,
    width: 150,
    padding: 15,
    margin: 5,
    flexDirection: 'row',
    borderRadius: 25,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  movieDetailsButtonContainer: {
    width: 250,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 1000,
  },
  movieDetailsButtonText: {
    color: '#fff',
  },
  movieDetailsContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    margin: 60,
  },
  movieDetailsNoPoster: {
    width: 300,
    height: 450,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  movieDetailsPoster: {
    width: 300,
    height: 450,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  movieDetailsSummary: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
    marginBottom: 10,
  },
  movieDetailsTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    justifyContent: 'flex-start',
    marginTop: 10,
    marginBottom: 10,
  },
  movieDetailsWords: {
    flex:1,
    padding: 100,
    position: 'relative',
  },
  movieInfo: {
    flex: 1,
    marginLeft: 15,
    marginTop: 10,
    fontWeight: 'bold',
    justifyContent: 'flex-start',
  }, 
  movieItem: {
    color: 'white',
    fontSize: 25,
    padding: 10,
    fontWeight: 'bold',
  },
  movieSearchResultContent: {
    flexDirection: 'row',
    padding: 5,
  },
  movieSearchResultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    justifyContent: 'flex-start',
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  }, 
  navBar: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#0D253F',
    paddingTop: 20, 
    paddingBottom: 20, 
    paddingHorizontal: 16, 
  },
  navItem: {
    color: 'white',
    fontSize: 18,
    padding: 10,
    fontWeight: 'bold',
  },
  navItemsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noListsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    padding: 20,
  },
  noListsSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  noListsText: {
    textAlign: 'center',
    padding: 20,
    color: '#777',
  },
  noPoster: {
    width: 100,
    height: 150,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  }, 
  noResults: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#666',
  }, 
  popoverOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popoverContainer: {
    width: '50%',
    maxHeight: '60%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  popoverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  popoverTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  releaseDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 25,
  },
  resultsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    paddingBottom: 30,
  },
  searchContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  }, 
  searchIcon: {
    position: 'absolute',
    right: 10,
    zIndex: 1,
  },
  searchInput: {
    height: 50,
    width: '30%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 15,
    paddingLeft: 10,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0D253F',
    padding: 25,
  },
  startWatching: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  }, 
  summaryWrapper: {
    marginTop: 20,
    padding: 5,
    backgroundColor: '#F2F2F2',
    borderRadius: 5,
    alignSelf: 'flex-start',
    zIndex: 1,
  }, 
  textContainer: {
    marginTop: 8,
    alignItems: 'center',
  }, 
  summary: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  watchStatusContainer: {
    marginTop: 10,
    padding: 5,
    backgroundColor: '#0D253F',
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  watchStatus: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});