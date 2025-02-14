// components/StudyGroupsList.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { FIREBASE_DB, FIREBASE_AUTH } from "../config/firebaseConfig";
import {
  collectionGroup,
  query,
  orderBy,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface StudyRequest {
  id: string;
  course: string;
  availableTimes: string;
  note?: string;
  createdAt: any;
  joinedUsers?: string[];
  // We'll extract the owner id from the document path.
  userId: string;
  // Keep a reference to the document so we can update it.
  ref: any;
}

const StudyGroupsList: React.FC = () => {
  const [studyGroups, setStudyGroups] = useState<StudyRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    // Wait until both Redux and Firebase Auth are ready.
    if (!currentUser || !FIREBASE_AUTH.currentUser) {
      console.warn("User not authenticated; skipping study groups query.");
      return;
    }

    const fetchStudyGroups = async () => {
      try {
        // Query all studyRequests across every user's subcollection.
        const studyGroupsQuery = query(
          collectionGroup(FIREBASE_DB, "studyRequests"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(studyGroupsQuery);
        const groups: StudyRequest[] = [];

        querySnapshot.forEach((docSnap) => {
          // The document path is in the form "users/{userId}/studyRequests/{docId}".
          const pathSegments = docSnap.ref.path.split("/");
          const userId = pathSegments[1]; // index 0: "users", 1: userId, 2: "studyRequests", 3: docId

          groups.push({
            id: docSnap.id,
            userId,
            ...docSnap.data(),
            ref: docSnap.ref,
          } as StudyRequest);
        });
        setStudyGroups(groups);
      } catch (error) {
        console.error("Error fetching study groups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudyGroups();
  }, [currentUser]);

  // Function to join a study group.
  const handleJoinGroup = async (group: StudyRequest) => {
    if (!currentUser || !currentUser.uid) {
      Alert.alert("Error", "You must be logged in to join a study group.");
      return;
    }
    try {
      await updateDoc(group.ref, {
        joinedUsers: arrayUnion(currentUser.uid),
      });
      Alert.alert("Success", "You have joined the study group.");
      // Update local state, explicitly casting joinedUsers as string[]
      setStudyGroups((prev) =>
        prev.map((g) =>
          g.id === group.id
            ? {
                ...g,
                joinedUsers: currentUser.uid
                  ? ([...(g.joinedUsers || [])] as string[]).concat(
                      currentUser.uid
                    )
                  : g.joinedUsers,
              }
            : g
        )
      );
    } catch (error) {
      console.error("Error joining study group:", error);
      Alert.alert("Error", "Failed to join study group.");
    }
  };

  // Function to leave a study group.
  const handleLeaveGroup = async (group: StudyRequest) => {
    if (!currentUser || !currentUser.uid) {
      Alert.alert("Error", "You must be logged in to leave a study group.");
      return;
    }
    try {
      await updateDoc(group.ref, {
        joinedUsers: arrayRemove(currentUser.uid),
      });
      Alert.alert("Success", "You have left the study group.");
      // Update local state, filtering out currentUser.uid.
      setStudyGroups((prev) =>
        prev.map((g) =>
          g.id === group.id
            ? {
                ...g,
                joinedUsers: ((g.joinedUsers || []) as string[]).filter(
                  (id) => id !== currentUser.uid
                ),
              }
            : g
        )
      );
    } catch (error) {
      console.error("Error leaving study group:", error);
      Alert.alert("Error", "Failed to leave study group.");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      {studyGroups.length === 0 ? (
        <View style={styles.emptyState}>
          <FontAwesome6 name="people-group" size={24} color="black" />
          <Text style={styles.emptyStateText}>
            No study groups found. Be the first to create one!
          </Text>
        </View>
      ) : (
        <FlatList
          data={studyGroups}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const hasJoined = currentUser?.uid
              ? !!item.joinedUsers?.includes(currentUser.uid)
              : false;
            const participantsCount = item.joinedUsers?.length || 0;

            return (
              <View style={styles.groupContainer}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.course}</Text>
                </View>

                <Text style={styles.metaText}>🕒 {item.availableTimes}</Text>

                {item.note && (
                  <Text style={[styles.metaText, { color: "#4B5563" }]}>
                    📌 {item.note}
                  </Text>
                )}

                <Text style={styles.metaText}>
                  👥 {participantsCount}{" "}
                  {participantsCount === 1 ? "member" : "members"}
                </Text>

                <View style={styles.buttonContainer}>
                  {hasJoined ? (
                    <TouchableOpacity
                      style={styles.leaveButton}
                      onPress={() => handleLeaveGroup(item)}
                    >
                      <Text style={{ color: "white", textAlign: "center" }}>
                        Leave
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.joinButton}
                      onPress={() => handleJoinGroup(item)}
                    >
                      <Text style={{ color: "white", textAlign: "center" }}>
                        Join Group
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  groupContainer: {
    padding: 16,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  metaText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
  },
  badgeText: {
    color: "#3B82F6",
    fontSize: 12,
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  joinButton: {
    backgroundColor: "#10B981",
    borderRadius: 8,
    paddingVertical: 8,
    flex: 1,
    marginRight: 4,
  },
  leaveButton: {
    backgroundColor: "#EF4444",
    borderRadius: 8,
    paddingVertical: 8,
    flex: 1,
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
  },
});

export default StudyGroupsList;
