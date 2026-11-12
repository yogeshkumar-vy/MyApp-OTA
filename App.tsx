// import { NewAppScreen } from '@react-native/new-app-screen';
// import { StatusBar, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native';
// import { useState } from 'react';
// import {
//   SafeAreaProvider,
//   useSafeAreaInsets,
// } from 'react-native-safe-area-context';
// import { NavigationContainer } from '@react-navigation/native';
// import BottomTabNavigator from './src/navigation/BottomNavigation';
// import { PaperProvider } from 'react-native-paper';
// import { Home } from 'lucide-react-native';
// import HomeScreen from './src/screens/HomeScreen';
// import codePush from "@revopush/react-native-code-push";

// function App() {
//   const isDarkMode = useColorScheme() === 'dark';

//   return (
//     // <SafeAreaProvider>
//     //   <PaperProvider>
//     //   <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
//     //   <AppContent />
//     //   </PaperProvider>
//     // </SafeAreaProvider>

//     <SafeAreaProvider>
//       <HomeScreen />
//     </SafeAreaProvider>
//   );
// }

// function AppContent() {
//   const safeAreaInsets = useSafeAreaInsets();
//   const [text, setText] = useState('');

//   return (
//    <NavigationContainer>
//       <BottomTabNavigator />
//     </NavigationContainer>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   text: {
//     padding: 16,
//     marginTop: 16,

//   },
//   textInput: {
//     padding: 16,
//     marginTop: 16,
//     backgroundColor: 'lightgray',
//     borderRadius: 8,
//     borderColor: 'gray',
//     borderWidth: 1,
//   },
// });

// export default codePush(App);

import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { hotUpdater, reportUpdateError } from './src/hotUpdater';

export default function App() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [status, setStatus] = useState('Ready to check for updates');

  async function applyUpdate() {
    if (isUpdating) return;

    setIsUpdating(true);
    setStatus('Checking for updates...');

    let checkFailed = false;

    try {
      const update = await hotUpdater.checkForUpdate({
        updateStrategy: 'appVersion',

        onError: error => {
          checkFailed = true;
          console.error('Update check failed:', error);
          setStatus(`Update check failed: ${error.message}`);
        },
      });

      console.log('Update check result:', update);

      if (!update) {
        setStatus('No compatible update available.');
        Alert.alert(
          'No Update Available',
          'There is no compatible update for this app.',
        );

        return;
      }

      console.log('Selected release:', {
        id: update.id,
        message: update.message,
        status: update.status,
        shouldForceUpdate: update.shouldForceUpdate,
      });

      setStatus('Update found! Downloading bundle...');

      const downloaded = await update.updateBundle();

      console.log('Bundle download result:', downloaded);

      if (!downloaded) {
        throw new Error('Could not prepare the update.');
      }

      setStatus('Update downloaded. Restarting app...');

      await hotUpdater.reload();
    } catch (error) {
      console.error('Hot Updater error:', error);

      reportUpdateError(error);

      setStatus('Update failed. Please try again.');

      Alert.alert(
        'OTA Update Failed',
        error instanceof Error ? error.message : String(error),
      );
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Hot Updater Demo</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Current Bundle ID</Text>

          <Text style={styles.bundleId}>
            {hotUpdater.getBundleId() ?? 'Unknown'}
          </Text>

          <Text style={styles.label}>Update Channel</Text>

          <Text style={styles.value}>ota-test</Text>

          <Text style={styles.label}>Update Strategy</Text>

          <Text style={styles.value}>appVersion</Text>
        </View>

        <View style={styles.statusContainer}>
          {isUpdating && <ActivityIndicator size="small" />}

          <Text style={styles.status}>{status}</Text>
        </View>

        <View style={styles.button}>
          <Button
            title={isUpdating ? 'Please wait...' : 'Check and Apply Update'}
            disabled={isUpdating}
            onPress={applyUpdate}
          />
        </View>

        <View
          style={{
            padding: 30,
            marginTop: 30,
            backgroundColor: '#f40c0c',
            borderRadius: 12,
            elevation: 3,
          }}
        >
          <Text>Development: {String(__DEV__)}</Text>
          <Text>App version: {hotUpdater.getAppVersion()}</Text>
          <Text>Current channel: {hotUpdater.getChannel()}</Text>
          <Text>Default channel: {hotUpdater.getDefaultChannel()}</Text>
          <Text>Current bundle ID: {hotUpdater.getBundleId()}</Text>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
            OTA Update Successful - Supabase
          </Text>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#5b6790',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#737373',
  },
  card: {
    backgroundColor: '#f8f5f5',
    padding: 20,
    borderRadius: 12,
    elevation: 3,
  },
  label: {
    fontSize: 13,
    color: '#777',
    marginTop: 12,
  },
  bundleId: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginTop: 5,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginTop: 5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 30,
  },
  status: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
  },
  button: {
    marginTop: 25,
  },
});
