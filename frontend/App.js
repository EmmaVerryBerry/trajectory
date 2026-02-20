import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import screens (to be created)
// import HomeScreen from './src/screens/HomeScreen';
// import GoalsScreen from './src/screens/GoalsScreen';
// import TimerScreen from './src/screens/TimerScreen';
// import SocialScreen from './src/screens/SocialScreen';
// import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

// Placeholder component until screens are created
function PlaceholderScreen({ title }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: '#000814' },
          tabBarActiveTintColor: '#FFC300',
          tabBarInactiveTintColor: '#003566',
          headerStyle: { backgroundColor: '#000814' },
          headerTintColor: '#FFC300',
        }}
      >
        <Tab.Screen
          name="Home"
          component={() => <PlaceholderScreen title="Home" />}
        />
        <Tab.Screen
          name="Goals"
          component={() => <PlaceholderScreen title="Goals" />}
        />
        <Tab.Screen
          name="Timer"
          component={() => <PlaceholderScreen title="Timer" />}
        />
        <Tab.Screen
          name="Social"
          component={() => <PlaceholderScreen title="Social" />}
        />
        <Tab.Screen
          name="Profile"
          component={() => <PlaceholderScreen title="Profile" />}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001D3D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#FFC300',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
