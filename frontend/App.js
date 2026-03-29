import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import { Aldrich_400Regular } from '@expo-google-fonts/aldrich';
import { SpaceGrotesk_400Regular, SpaceGrotesk_500Medium, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import GoalSettingScreen from './src/screens/GoalSettingScreen';
import LogSessionScreen from './src/screens/LogSessionScreen';
import PomodoroScreen from './src/screens/PomodoroScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';
import FriendsScreen from './src/screens/FriendsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CommunityScreen from './src/screens/CommunityScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Main App Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0A1628',
          borderTopWidth: 0,
          elevation: 0,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#FFD700',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.4)',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('./assets/icons/home.png')}
              style={[
                styles.tabIcon,
                { tintColor: focused ? '#FFD700' : 'rgba(255, 255, 255, 0.4)' }
              ]}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Log"
        component={LogSessionScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('./assets/icons/book.png')}
              style={[
                styles.tabIcon,
                { tintColor: focused ? '#FFD700' : 'rgba(255, 255, 255, 0.4)' }
              ]}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Start"
        component={PomodoroScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.startButtonContainer}>
              <View style={styles.startButton}>
                <View style={styles.playIconTriangle} />
              </View>
            </View>
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.startLabel, { color: focused ? '#FFD700' : 'rgba(255, 255, 255, 0.4)' }]}>
              Start
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Friends"
        component={FriendsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('./assets/icons/users.png')}
              style={[
                styles.tabIcon,
                { tintColor: focused ? '#FFD700' : 'rgba(255, 255, 255, 0.4)' }
              ]}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Badges"
        component={AchievementsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('./assets/icons/badge.png')}
              style={[
                styles.tabIcon,
                { tintColor: focused ? '#FFD700' : 'rgba(255, 255, 255, 0.4)' }
              ]}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  // Load fonts
  const [fontsLoaded] = useFonts({
    'Aldrich': Aldrich_400Regular,
    'SpaceGrotesk-Regular': SpaceGrotesk_400Regular,
    'SpaceGrotesk-Medium': SpaceGrotesk_500Medium,
    'SpaceGrotesk-Bold': SpaceGrotesk_700Bold,
  });

  // Auth and onboarding state
  // TODO: Replace with actual authentication logic (AsyncStorage, Context, etc.)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        ) : !hasCompletedOnboarding ? (
          <Stack.Screen name="Onboarding" component={GoalSettingScreen} />
        ) : null}
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  // Tab navigation styles
  tabIcon: {
    width: 24,
    height: 24,
  },

  // Start button (center) styles
  startButtonContainer: {
    marginTop: -20,
  },
  startButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366F1', // Purple/blue color for Start button
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  playIconTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: '#FFFFFF',
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: 4,
  },
  startLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
});
