import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SOSRequest } from "@/models/SOSModel";
import { Ionicons } from "@expo/vector-icons";

type SOSDetailCardProps = {
  sos: SOSRequest;
  onClose: () => void;
  // NEW PROP
  onUpdateStatus: (id: string, status: "processing" | "attended") => void;
};

export default function SOSDetailCard({
  sos,
  onClose,
  onUpdateStatus,
}: SOSDetailCardProps) {
  const user = sos.user_profile;
  const contacts = sos.emergency_contacts || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            EMERGENCY: {sos.tipo_emergencia || "General"}
          </Text>
          <Text
            style={[
              styles.status,
              { color: sos.estado === "pending" ? "#FF5A5A" : "#FFD700" },
            ]}
          >
            Status: {sos.estado.toUpperCase()}
          </Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* User Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Information</Text>
          <InfoRow
            label="Name"
            value={`${user.first_name} ${user.last_name}`}
          />
          <InfoRow label="Blood Type" value={user.blood_type} />
          <InfoRow label="Allergies" value={user.allergies} />
          <InfoRow label="Conditions" value={user.medical_conditions} />
          <InfoRow label="Medications" value={user.medications} />
        </View>

        {/* Contacts Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          {contacts.length > 0 ? (
            contacts.map((contact, index) => (
              <View key={contact.id || index} style={styles.contactCard}>
                <Text style={styles.contactName}>
                  {contact.name} {contact.last_name}
                </Text>
                <Text style={styles.contactDetail}>
                  {contact.relationship} • {contact.phone}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noData}>No emergency contacts found.</Text>
          )}
        </View>

        {/* Timestamp */}
        <Text style={styles.timestamp}>
          Reported: {new Date(sos.timestamp_inicio).toLocaleString()}
        </Text>

        {/* SPACER for buttons */}
        <View style={{ height: 60 }} />
      </ScrollView>

      {/* ACTION BUTTONS */}
      <View style={styles.actionContainer}>
        {sos.estado === "pending" && (
          <TouchableOpacity
            style={[styles.actionBtn, styles.btnProcessing]}
            onPress={() => onUpdateStatus(sos.id, "processing")}
          >
            <Text style={styles.btnText}>ACKNOWLEDGE & PROCESS</Text>
          </TouchableOpacity>
        )}

        {sos.estado === "processing" && (
          <TouchableOpacity
            style={[styles.actionBtn, styles.btnAttended]}
            onPress={() => onUpdateStatus(sos.id, "attended")}
          >
            <Text style={styles.btnText}>MARK AS ATTENDED</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value || "N/A"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%", // Increased slightly for buttons
    backgroundColor: "#1A2E24",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "Lato-Bold",
  },
  status: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  closeBtn: {
    padding: 5,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: 15,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#06D23C",
    fontWeight: "bold",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingBottom: 5,
  },
  row: {
    flexDirection: "row",
    marginBottom: 6,
  },
  label: {
    color: "#aaa",
    width: 100,
    fontWeight: "500",
  },
  value: {
    color: "#fff",
    flex: 1,
    fontWeight: "400",
  },
  contactCard: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  contactName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  contactDetail: {
    color: "#ccc",
    fontSize: 14,
  },
  noData: {
    color: "#777",
    fontStyle: "italic",
  },
  timestamp: {
    color: "#666",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 20,
  },
  // NEW STYLES
  actionContainer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
  },
  actionBtn: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  btnProcessing: {
    backgroundColor: "#FFD700", // Yellow for processing
  },
  btnAttended: {
    backgroundColor: "#06D23C", // Green for done
  },
  btnText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Lato-Bold",
  },
});
