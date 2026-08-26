import { StyleSheet, FlatList, Image, Pressable, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { movies } from '../../data/movies-data';

export default function HomeScreen() {
  const featuredMovie = movies.find(m => m.featured) || movies[0];
  const trendingMovies = movies.filter(m => m.trending);
  const actionMovies = movies.filter(m => m.genres.includes('Action'));

  const renderMovieRow = (title: string, data: any[]) => (
    <View style={styles.rowContainer}>
      <Text style={styles.rowTitle}>{title}</Text>
      <FlatList
        horizontal
        data={data}
        keyExtractor={(item) => item.title}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rowList}
        renderItem={({ item }) => (
          <Pressable style={styles.card}>
            <Image source={{ uri: item.poster }} style={styles.poster} />
          </Pressable>
        )}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.heroContainer}>
        <Image source={{ uri: featuredMovie.backdrop }} style={styles.heroImage} />
        <View style={styles.heroGradient} />
        <Text style={styles.heroTitle}>{featuredMovie.title}</Text>
        <Pressable style={styles.playButton}>
          <Text style={styles.playButtonText}>▶ Play</Text>
        </Pressable>
      </View>

      {renderMovieRow('Trending Now', trendingMovies.length > 0 ? trendingMovies : movies.slice(0, 10))}
      {renderMovieRow('Action & Adventure', actionMovies.length > 0 ? actionMovies : movies.slice(10, 20))}
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroContainer: {
    height: 400,
    width: '100%',
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)', 
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  playButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 5,
  },
  playButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  rowContainer: {
    marginTop: 20,
  },
  rowTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 10,
    color: '#fff',
  },
  rowList: {
    paddingLeft: 15,
  },
  card: {
    marginRight: 10,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
  }
});
