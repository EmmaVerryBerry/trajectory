import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import screens 
import HomeScreen from './src/screens/HomeScreen';
import GoalsScreen from './src/screens/GoalsScreen';
import TimerScreen from './src/screens/TimerScreen';
import SocialScreen from './src/screens/SocialScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();


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
         name="Home" component={HomeScreen} />
        <Tab.Screen
          name="Goals"
          component={GoalsScreen}
        />
        <Tab.Screen
          name="Timer"
          component={TimerScreen}
        />
        <Tab.Screen
          name="Social"
          component={SocialScreen}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
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
