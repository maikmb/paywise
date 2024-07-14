import { PropsWithChildren } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./ThemedText";

type Props = PropsWithChildren<{
  title: string;
  onPress: () => void;
}>;

export default function AcaoItem({ children, title, onPress }: Props) {
  return (
    <View style={styles.acaoItem}>
      <TouchableOpacity onPress={onPress} style={styles.acao}>
        {children}
      </TouchableOpacity>
      <ThemedText align="center" >{title}</ThemedText>
    </View>
  )
}

const styles = StyleSheet.create({
  acaoItem: {
    display: 'flex',
    alignItems: 'center',
    width: 130
  },
  acao: {
    width: 60,
    height: 60,
    borderRadius: 50,
    padding: 20,
    backgroundColor: '#6666',
    margin: 10
  }
});
