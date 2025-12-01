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
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../Helpers/Button";

type SOSDetailCardProps = {
  sos: SOSRequest;
  onClose: () => void;
  onUpdateStatus: (id: string, status: "processing" | "attended") => void;
};

export default function SOSDetailCard({
  sos,
  onClose,
  onUpdateStatus,
}: SOSDetailCardProps) {
  const user = sos.user_profile;
  const contacts = sos.emergency_contacts || [];
  const isPending = sos.estado === "pending";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
          <Text style={styles.backText}>Map</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency Details</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.heroSection}>
          <Text style={styles.emergencyType}>
            {sos.tipo_emergencia?.toUpperCase() || "GENERAL ALERT"}
          </Text>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: isPending
                  ? "rgba(255, 90, 90, 0.2)"
                  : "rgba(255, 215, 0, 0.2)",
              },
            ]}
          >
            <Ionicons
              name={isPending ? "alert-circle" : "time"}
              size={18}
              color={isPending ? "#FF5A5A" : "#FFD700"}
            />
            <Text
              style={[
                styles.statusText,
                { color: isPending ? "#FF5A5A" : "#FFD700" },
              ]}
            >
              STATUS: {sos.estado.toUpperCase()}
            </Text>
          </View>

          <Text style={styles.timestamp}>
            Reported: {new Date(sos.timestamp_inicio).toLocaleString()}
          </Text>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person" size={20} color="#06D23C" />
            <Text style={styles.sectionTitle}>Profile Info</Text>
          </View>

          <View style={styles.card}>
            <InfoRow
              label="Name"
              value={`${user.first_name} ${user.last_name}`}
              isBold
            />
            <Divider />
            <InfoRow label="Blood Type" value={user.blood_type} />
            <Divider />
            <InfoRow label="Allergies" value={user.allergies} />
            <Divider />
            <InfoRow label="Conditions" value={user.medical_conditions} />
            <Divider />
            <InfoRow label="Medications" value={user.medications} />
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="call" size={20} color="#06D23C" />
            <Text style={styles.sectionTitle}>Emergency Contact</Text>
          </View>

          {contacts.length > 0 ? (
            contacts.map((contact, index) => (
              <View key={contact.id || index} style={styles.contactCard}>
                <View style={styles.contactAvatar}>
                  <Text style={styles.avatarText}>
                    {contact.name ? contact.name[0] : "?"}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.contactName}>
                    {contact.name} {contact.last_name}
                  </Text>
                  <Text style={styles.contactRel}>{contact.relationship}</Text>
                  <Text style={styles.contactPhone}>{contact.phone}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noData}>No emergency contacts found.</Text>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        {sos.estado === "pending" && (
          <Button
            value="Process SOS Call"
            onClick={() => onUpdateStatus(sos.id, "processing")}
            backgroundColor="#1B251F"
            textColor="#FFFFFF"
          />
        )}

        {sos.estado === "processing" && (
          <Button
            value="Mark as attended"
            onClick={() => onUpdateStatus(sos.id, "attended")}
            backgroundColor="#1B251F"
            textColor="#FFFFFF"
          />
        )}
      </View>
    </SafeAreaView>
  );
}

function InfoRow({
  label,
  value,
  isBold,
}: {
  label: string;
  value: string;
  isBold?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, isBold && styles.valueBold]}>
        {value || "N/A"}
      </Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00160B",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
    minHeight: 80,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    width: 60,
  },
  backText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 4,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Lato-Bold",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  emergencyType: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
    letterSpacing: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    marginBottom: 10,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  timestamp: {
    color: "#666",
    fontSize: 13,
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  sectionTitle: {
    color: "#06D23C",
    fontSize: 16,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#1A2E24",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  label: {
    color: "#888",
    fontSize: 15,
  },
  value: {
    color: "#ddd",
    fontSize: 15,
    flex: 1,
    textAlign: "right",
  },
  valueBold: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A2E24",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(6, 210, 60, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#06D23C",
    fontWeight: "bold",
    fontSize: 18,
  },
  contactName: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  contactRel: {
    color: "#aaa",
    fontSize: 13,
  },
  contactPhone: {
    color: "#fff",
    fontSize: 13,
    marginTop: 2,
  },
  callButton: {
    backgroundColor: "#06D23C",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  noData: {
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 10,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "#00160B",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  actionBtn: {
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  btnProcessing: {
    backgroundColor: "#FFD700",
  },
  btnAttended: {
    backgroundColor: "#06D23C",
  },
  btnTextBlack: {
    color: "#000",
    fontSize: 16,
    fontWeight: "900",
  },
  btnTextWhite: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
});
