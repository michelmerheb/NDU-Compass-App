import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import EventsCard from "../../components/EventsCard";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Event = {
  image: string;
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
};

export default function EventsScreen({ navigation }: any) {
  const { user } = useSelector((state: RootState) => state.auth);
  const isModerator = user?.role === "moderator";

  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const storedEvents = await AsyncStorage.getItem("events");
        if (storedEvents) {
          setEvents(JSON.parse(storedEvents));
        }
      } catch (error) {
        console.error("Error loading events", error);
      }
    };

    loadEvents();
  }, []);

  useEffect(() => {
    const saveEvents = async () => {
      try {
        await AsyncStorage.setItem("events", JSON.stringify(events));
      } catch (error) {
        console.error("Error saving events", error);
      }
    };
    saveEvents();
  }, [events]);

  const handleAddEvent = () => {
    navigation.navigate("AddEventScreen", { setEvents });
  };

  return (
    <View style={styles.container}>
      <View style={styles.addContent}>
        {isModerator && (
          <TouchableOpacity onPress={handleAddEvent} style={styles.button}>
            <Text style={styles.buttonText}>Add Event</Text>
          </TouchableOpacity>
        )}

        {events.length > 0 ? (
          <FlatList
            data={events}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("EventDetails", {
                    event: item,
                    setEvents,
                  })
                }
              >
                <EventsCard
                  id={item.id}
                  setEvents={setEvents}
                  headerImage={item.image}
                  title={item.title}
                  date={item.date}
                  location={item.location}
                  description={item.description}
                  onPress={() => console.log(`${item.title} pressed`)}
                />
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text style={styles.noEventsText}>
            No events available. Come back later!
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  addContent: {
    padding: 20,
  },
  button: {
    backgroundColor: "#005eb8",
    padding: 10,
    marginVertical: 15,
    borderRadius: 15,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
  },
  noEventsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
});
