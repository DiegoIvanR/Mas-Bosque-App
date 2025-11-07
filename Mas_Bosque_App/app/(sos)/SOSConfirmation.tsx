import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Pressable, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SOSConfirmationProps {
  onEmergencySelected: (type: string) => void;
  onSend: (type: string) => void;
}

// Configurable vertical gap used for selector->options and options->send
const GAP = 25;

export default function SOSConfirmation({
  onEmergencySelected,
  onSend,
}: SOSConfirmationProps) {
  const [selectedEmergency, setSelectedEmergency] = useState<string>('');
  const [pickerVisible, setPickerVisible] = useState(false);

  const options = [
    { label: 'Medical emergency', value: 'medical' },
    { label: 'Lost user', value: 'lost' },
    { label: 'Mechanical failure', value: 'mechanical' },
  ];

  // Compute dropdown reserved height so the layout never shifts or overlaps.
  const OPTION_ROW_HEIGHT = 48; // estimated row height (padding + text)
  const DROPDOWN_BOX_PADDING = 16; // padding inside the box
  const dropdownHeight = options.length * OPTION_ROW_HEIGHT + DROPDOWN_BOX_PADDING;

  // Animated value for dropdown toggle (0 = closed, 1 = open)
  const dropdownAnim = React.useRef(new Animated.Value(pickerVisible ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(dropdownAnim, {
      toValue: pickerVisible ? 1 : 0,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [pickerVisible, dropdownAnim]);

  const handleSend = () => {
    if (selectedEmergency) {
      onSend(selectedEmergency);
    }
  };

  return (
    <LinearGradient
      colors={['#300001', '#960002']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <Text style={styles.title}>SOS Call Sent</Text>
      <Text style={styles.subtitle}>What is your emergency?</Text>

      {/* Styled pressable acting as the visible dropdown */}
      <Pressable
        onPress={() => setPickerVisible((v) => !v)}
        style={styles.pickerWrapper}
      >
        <View pointerEvents="none" style={styles.pickerInner}>
          <Text
            style={[
              styles.pickerText,
              !selectedEmergency && { color: '#9b9b9b' },
            ]}
          >
            {selectedEmergency
              ? options.find((o) => o.value === selectedEmergency)?.label
              : 'Select emergency'}
          </Text>
          <Text style={styles.caret}>{pickerVisible ? '▴' : '▾'}</Text>
        </View>
      </Pressable>

      {/* Reserve fixed space for dropdown so layout doesn't shift or overlay */}
      <View style={[styles.dropdownSpacer, { height: dropdownHeight }]}> 
        {/* Animated dropdown box: slides down from -height -> 0 and fades in */}
        <Animated.View
          style={[
            styles.dropdownBox,
            { height: dropdownHeight },
            {
              opacity: dropdownAnim,
              transform: [
                {
                  translateY: dropdownAnim.interpolate({ inputRange: [0, 1], outputRange: [-dropdownHeight, 0] }),
                },
              ],
            },
          ]}
        >
          {options.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={styles.dropdownOption}
              onPress={() => {
                setSelectedEmergency(opt.value);
                onEmergencySelected(opt.value);
                setPickerVisible(false);
              }}
            >
              <Text style={styles.dropdownOptionText}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </View>

      <TouchableOpacity
        style={[
          styles.sendButton,
          !selectedEmergency && styles.disabledButton,
        ]}
        disabled={!selectedEmergency}
        onPress={handleSend}
      >
        <Text style={styles.sendButtonText}>Send emergency type</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 20,
  },
  pickerWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    width: '90%',
    marginBottom: GAP,
  },
  pickerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  pickerText: {
    color: '#000000',
    fontSize: 16,
  },
  caret: {
    color: '#000000',
    fontSize: 20,
    marginLeft: 8,
  },
  dropdownBox: {
    backgroundColor: '#fff',
    borderRadius: 14,
    width: '100%',
    paddingVertical: 8,
    // shadow / elevation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  dropdownOption: {
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#111',
  },
  dropdownHidden: {
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 14,
  },
  dropdownSpacer: {
    width: '90%',
    marginBottom: GAP,
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  sendButton: {
    backgroundColor: '#200101',
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 30,
    marginTop: 0,
    alignItems: 'center',
    width: '90%',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#4a2a2a',
  },
});
