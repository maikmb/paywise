import { StyleSheet, View } from 'react-native';

export function HomeTab({ items, onClick }) {
  return (
    <View>
      {items.map((item: any) => {
        return (
          <View >
            {item.name}
          </View>
        )
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 28,
    lineHeight: 32,
    marginTop: -6,
  },
});
