import React from 'react';
import { Appbar, Button, Drawer, FAB } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BOTTOM_APPBAR_HEIGHT = 10;
const MEDIUM_FAB_HEIGHT = 56;

export default function HomeScreen() {
  const [drawerVisible, setDrawerVisible] = React.useState(false);
  const [activeItem, setActiveItem] = React.useState('inbox');
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Action
          icon="menu"
          onPress={() => setDrawerVisible(!drawerVisible)}
        />
        <Appbar.Content title="Home" />
        <Appbar.Action icon="magnify" onPress={() => {}} />
        <Appbar.Action icon="dots-vertical" onPress={() => {}} />
      </Appbar.Header>

      {drawerVisible && (
        <View style={styles.drawer}>
          <Drawer.Section title="Menu">
            <Drawer.Item
              label="Index"
              active={activeItem === 'Index'}
              onPress={() => setActiveItem('Index')}
            />
            <Drawer.Item
              label="Second Item"
              active={activeItem   === 'second Item'}
              onPress={() => setActiveItem('second Item')}
            />
          </Drawer.Section>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: 'aquamarine',
  },
  drawer: {
    width: 250,
    height: '100%',
    backgroundColor: 'white',
    paddingVertical: 12,
    elevation: 4,
  },

  bottom: {
    backgroundColor: 'aquamarine',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  fab: {
    position: 'absolute',
    right: 16,
  },
});
