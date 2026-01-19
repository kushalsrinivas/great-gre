import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  BorderRadius,
  Colors,
  Spacing,
  Typography,
} from "@/lib/constants/theme";
import { initializeUserProfile } from "@/lib/storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [learningVibe, setLearningVibe] = useState<"chill" | "intense">(
    "chill"
  );
  const [greMonth, setGreMonth] = useState("");
  const [greYear, setGreYear] = useState("");
  const [dailyGoal, setDailyGoal] = useState(10);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [validationError, setValidationError] = useState("");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

  const handleNext = () => {
    // Validate step 3
    if (step === 3) {
      if (!name.trim()) {
        setValidationError("Please enter your name");
        return;
      }
      setValidationError("");
    }

    if (step < 3) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    if (!name.trim()) {
      // show error / toast / alert
      Alert.alert("Missing name", "Please enter your name to continue");
      return;
    }

    try {
      // Format GRE test date if provided
      const greTestDate =
        greMonth && greYear ? `${greMonth} ${greYear}` : undefined;

      // Initialize user profile
      await initializeUserProfile(
        name.trim(), // ✅ guaranteed non-empty
        new Date().toISOString(),
        dailyGoal,
        learningVibe,
        greTestDate
      );

      // Navigate to main app
      router.replace("/(main)/(tabs)");
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleComplete}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {step === 1 && (
          <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
              <IconSymbol name="wifi.slash" size={60} color={Colors.text} />
            </View>
            <Text style={styles.heading}>
              Study Anywhere,{"\n"}
              <Text style={styles.headingBlue}>Anytime</Text>
            </Text>
            <Text style={styles.description}>
              Learn 1000+ GRE words fully offline. No internet? No problem, keep
              learning on the go.
            </Text>
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.heading}>Choose Your{"\n"}Learning Vibe</Text>
            <Text style={styles.description}>
              How would you like to pace your learning?
            </Text>

            <View style={styles.vibeContainer}>
              <TouchableOpacity
                style={[
                  styles.vibeOption,
                  learningVibe === "chill" && styles.vibeOptionSelected,
                ]}
                onPress={() => setLearningVibe("chill")}
              >
                <IconSymbol name="cloud.fill" size={48} color={Colors.primary} />
                <Text style={styles.vibeTitle}>Chill Mode</Text>
                <Text style={styles.vibeDesc}>Learn at your own pace</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.vibeOption,
                  learningVibe === "intense" && styles.vibeOptionSelected,
                ]}
                onPress={() => setLearningVibe("intense")}
              >
                <IconSymbol name="flame.fill" size={48} color={Colors.warning} />
                <Text style={styles.vibeTitle}>Intense Mode</Text>
                <Text style={styles.vibeDesc}>Fast-track your learning</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.heading}>Lets Get Started!</Text>
            <Text style={styles.description}>
              Tell us a bit about yourself to personalize your experience.
            </Text>

            <Card style={styles.formCard}>
              <Text style={styles.label}>What should we call you?</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor={Colors.textSecondary}
                value={name}
                onChangeText={setName}
              />

              <Text style={styles.label}>Daily Learning Goal</Text>
              <View style={styles.goalContainer}>
                {[5, 10, 20, 30].map((goal) => (
                  <TouchableOpacity
                    key={goal}
                    style={[
                      styles.goalOption,
                      dailyGoal === goal && styles.goalOptionSelected,
                    ]}
                    onPress={() => setDailyGoal(goal)}
                  >
                    <Text
                      style={[
                        styles.goalText,
                        dailyGoal === goal && styles.goalTextSelected,
                      ]}
                    >
                      {goal}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.helperText}>words per day</Text>

              <Text style={styles.label}>
                When is your GRE test? (Optional)
              </Text>
              <View style={styles.datePickerContainer}>
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => setShowMonthPicker(true)}
                >
                  <Text
                    style={[
                      styles.datePickerText,
                      !greMonth && styles.datePickerPlaceholder,
                    ]}
                  >
                    {greMonth || "Month"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => setShowYearPicker(true)}
                >
                  <Text
                    style={[
                      styles.datePickerText,
                      !greYear && styles.datePickerPlaceholder,
                    ]}
                  >
                    {greYear || "Year"}
                  </Text>
                </TouchableOpacity>
              </View>

              {validationError ? (
                <Text style={styles.errorText}>{validationError}</Text>
              ) : null}
            </Card>
          </View>
        )}
      </ScrollView>

      {/* Progress indicator */}
      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, Spacing["2xl"]) },
        ]}
      >
        <View style={styles.progressDots}>
          {[1, 2, 3].map((dot) => (
            <View
              key={dot}
              style={[
                styles.dot,
                step >= dot ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        <Button
          title={step === 3 ? "Get Started →" : "Next"}
          onPress={handleNext}
          size="large"
          style={styles.button}
        />
      </View>

      {/* Month Picker Modal */}
      <Modal
        visible={showMonthPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMonthPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerModal}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select Month</Text>
              <TouchableOpacity onPress={() => setShowMonthPicker(false)}>
                <Text style={styles.pickerClose}>Done</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={months}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.pickerItem}
                  onPress={() => {
                    setGreMonth(item);
                    setShowMonthPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      greMonth === item && styles.pickerItemSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Year Picker Modal */}
      <Modal
        visible={showYearPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowYearPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerModal}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select Year</Text>
              <TouchableOpacity onPress={() => setShowYearPicker(false)}>
                <Text style={styles.pickerClose}>Done</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={years}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.pickerItem}
                  onPress={() => {
                    setGreYear(item.toString());
                    setShowYearPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      greYear === item.toString() && styles.pickerItemSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  skipButton: {
    position: "absolute",
    top: 60,
    right: Spacing["2xl"],
    zIndex: 10,
    padding: Spacing.sm,
  },
  skipText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    fontWeight: Typography.semibold,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing["2xl"],
    paddingVertical: Spacing["5xl"],
  },
  stepContainer: {
    alignItems: "center",
    gap: Spacing.xl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    backgroundColor: Colors.primary,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  heading: {
    fontSize: Typography["4xl"],
    fontWeight: Typography.extrabold,
    color: Colors.text,
    textAlign: "center",
    lineHeight: 48,
  },
  headingBlue: {
    color: Colors.primary,
  },
  description: {
    fontSize: Typography.lg,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 28,
    paddingHorizontal: Spacing.xl,
  },
  vibeContainer: {
    flexDirection: "row",
    gap: Spacing.lg,
    marginTop: Spacing.xl,
  },
  vibeOption: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    gap: Spacing.md,
    borderWidth: 2,
    borderColor: "transparent",
  },
  vibeOptionSelected: {
    borderColor: Colors.primary,
  },
  vibeTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  vibeDesc: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  formCard: {
    width: "100%",
    marginTop: Spacing.xl,
  },
  label: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  input: {
    backgroundColor: Colors.cardBackgroundLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    fontSize: Typography.base,
    color: Colors.text,
  },
  goalContainer: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  goalOption: {
    flex: 1,
    backgroundColor: Colors.cardBackgroundLight,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  goalOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: "rgba(37, 99, 235, 0.1)",
  },
  goalText: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textSecondary,
  },
  goalTextSelected: {
    color: Colors.primary,
  },
  helperText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  footer: {
    padding: Spacing["2xl"],
    gap: Spacing.xl,
  },
  progressDots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  dot: {
    width: 24,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    backgroundColor: Colors.primary,
  },
  dotInactive: {
    backgroundColor: Colors.cardBackgroundLight,
  },
  button: {
    width: "100%",
  },
  datePickerContainer: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  datePickerButton: {
    flex: 1,
    backgroundColor: Colors.cardBackgroundLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: "center",
  },
  datePickerText: {
    fontSize: Typography.base,
    color: Colors.text,
    fontWeight: Typography.semibold,
  },
  datePickerPlaceholder: {
    color: Colors.textSecondary,
    fontWeight: Typography.normal,
  },
  errorText: {
    fontSize: Typography.sm,
    color: "#EF4444",
    marginTop: Spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  pickerModal: {
    backgroundColor: Colors.cardBackground,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: "50%",
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pickerTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.text,
  },
  pickerClose: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.primary,
  },
  pickerItem: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pickerItemText: {
    fontSize: Typography.base,
    color: Colors.text,
  },
  pickerItemSelected: {
    color: Colors.primary,
    fontWeight: Typography.bold,
  },
});
