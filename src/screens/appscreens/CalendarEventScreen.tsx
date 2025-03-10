import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Agenda } from "react-native-calendars";
import EventsScreen from "./EventsScreen";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import ScreenHeader from "../../components/ScreenHeader";

// Keep existing interfaces unchanged
interface NavigationProp {
  navigate: (screen: string) => void;
}

interface CalendarEventScreenProps {
  navigation: NavigationProp;
}

interface AgendaItem {
  name: string;
  height: number;
}

interface CalendarDay {
  timestamp: number;
  dateString: string;
  day: number;
  month: number;
  year: number;
}

// Memoized component for each agenda item
const AgendaItemComponent = React.memo(({ item }: { item: AgendaItem }) => {
  return (
    <TouchableOpacity
      style={[styles.itemContainer, styles.shadow]}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={["#6366f1", "#4338ca"]}
        style={[styles.gradient, { minHeight: item.height }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.itemHeader}>
          <Text style={styles.itemTime}>09:00 AM</Text>
          <MaterialIcons name="event" size={20} color="white" />
        </View>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text style={styles.itemLocation}>Conference Room A</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
});

export default function CalendarEventScreen({
  navigation,
}: CalendarEventScreenProps) {
  const [items, setItems] = useState<Record<string, AgendaItem[]>>({});

  // Memoize the loadItems function so it doesn't change on every render
  const loadItems = useCallback((day: CalendarDay): void => {
    const newItems: Record<string, AgendaItem[]> = {};
    for (let i = -15; i < 85; i++) {
      const time = day.timestamp + i * 24 * 60 * 60 * 1000;
      const strTime = new Date(time).toISOString().split("T")[0];
      if (!newItems[strTime]) {
        newItems[strTime] = [];
        const numItems = Math.floor(Math.random() * 3 + 1);
        for (let j = 0; j < numItems; j++) {
          newItems[strTime].push({
            name: `Event for ${strTime}`,
            height: Math.max(50, Math.floor(Math.random() * 150)),
          });
        }
      }
    }
    setItems(newItems);
  }, []);

  // Memoize renderItem so it's not recreated every render
  const renderItem = useCallback(
    (item: AgendaItem, firstItemInDay: boolean): JSX.Element => {
      return <AgendaItemComponent item={item} />;
    },
    []
  );

  // Similarly, memoize renderEmptyDate
  const renderEmptyDate = useCallback(
    () => (
      <View style={styles.emptyDate}>
        <Text style={styles.emptyDateText}>No scheduled events</Text>
      </View>
    ),
    []
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title="Calendar and Events" navigation={navigation} />
      <Agenda
        items={items}
        loadItemsForMonth={loadItems}
        selected={new Date().toISOString().split("T")[0]}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDate}
        rowHasChanged={(r1: AgendaItem, r2: AgendaItem) =>
          r1.name !== r2.name || r1.height !== r2.height
        }
        windowSize={5} // Controls number of items rendered outside of viewport
        initialNumToRender={7} // Initial render batch size
        maxToRenderPerBatch={5} // Batch size
        updateCellsBatchingPeriod={50} // Delay between batches
        theme={{
          backgroundColor: "#ffffff",
          calendarBackground: "#ffffff",
          selectedDayBackgroundColor: "#005eb8",
          selectedDayTextColor: "#ffffff",
          todayTextColor: "#005eb8",
          dayTextColor: "#1e293b",
          monthTextColor: "#1e293b",
          textDisabledColor: "#94a3b8",
          dotColor: "#005eb8",
          agendaDayTextColor: "#005eb8",
          agendaDayNumColor: "#005eb8",
          agendaTodayColor: "#005eb8 ",
          textSectionTitleColor: "#64748b",
          textDayFontWeight: "500",
          textMonthFontWeight: "600",
          textDayHeaderFontWeight: "600",
          textDayFontSize: 14,
          textMonthFontSize: 18,
          agendaKnobColor: "#e2e8f0",
        }}
      />
      <EventsScreen navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  itemContainer: {
    borderRadius: 12,
    marginRight: 15,
    marginTop: 20,
    overflow: "hidden",
  },
  gradient: {
    padding: 16,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  itemTime: {
    color: "#e0e7ff",
    fontSize: 14,
    fontWeight: "500",
  },
  itemTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  itemLocation: {
    color: "#c7d2fe",
    fontSize: 14,
    fontWeight: "500",
  },
  emptyDate: {
    height: 15,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
  },
  emptyDateText: {
    color: "#94a3b8",
    fontSize: 16,
    fontWeight: "500",
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
});
