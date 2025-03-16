import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "expo-checkbox";
import { Picker } from "@react-native-picker/picker";

const API_KEY = "AIzaSyB2H96Gr4dsnHKTGgOj4lbbtYaorYRB4Eg";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

interface Option {
  option: string;
  isCorrect: string;
  selected?: boolean;
}

interface Question {
  question: string;
  options: Option[];
}

interface QuizData {
  questions: Question[];
}

const QuizGenerator: React.FC = () => {
  const [numQuestions, setNumQuestions] = useState<string>("");
  const [numOptions, setNumOptions] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [quizData, setQuizData] = useState<Question[] | null>(null);
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [score, setScore] = useState<number | null>(null);

  const jsonTemplate = {
    questions: [
      {
        question: "",
        options: [{ option: "", isCorrect: "" }],
      },
    ],
  };

  const validateJSON = (
    jsonData: any,
    template: typeof jsonTemplate
  ): boolean => {
    return jsonData.questions && Array.isArray(jsonData.questions);
  };

  const saveQuiz = async (quiz: Question[]): Promise<void> => {
    try {
      await AsyncStorage.setItem("myQuiz", JSON.stringify(quiz));
    } catch (e) {
      console.error(e);
    }
  };

  const getQuiz = async (): Promise<Question[] | null> => {
    try {
      const quiz = await AsyncStorage.getItem("myQuiz");
      return quiz ? JSON.parse(quiz) : null;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const fetchGeminiContent = async (prompt: string): Promise<any> => {
    try {
      console.log("Sending request with prompt:", prompt);
      const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      console.log("Response Status:", response.status);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `API request failed with status ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Raw API Response:", JSON.stringify(data, null, 2));

      if (
        !data.candidates ||
        !data.candidates[0] ||
        !data.candidates[0].content
      ) {
        throw new Error(
          "Unexpected response structure: " + JSON.stringify(data)
        );
      }

      const textToParse = data.candidates[0].content.parts[0].text;
      console.log("Text to parse:", textToParse);

      // Strip markdown code fences
      const cleanedText = textToParse
        .replace(/```json\n/, "") // Remove opening ```json and newline
        .replace(/\n```/, ""); // Remove closing ``` and preceding newline

      console.log("Cleaned text:", cleanedText);
      return JSON.parse(cleanedText);
    } catch (error: any) {
      console.error("Fetch Error Details:", error);
      throw new Error("Failed to fetch from Gemini API: " + error.message);
    }
  };

  const generateQuiz = async (): Promise<void> => {
    if (
      !numQuestions ||
      !numOptions ||
      !subject ||
      !difficulty ||
      parseInt(numOptions) < 2
    ) {
      setError("All fields required. Options must be > 1");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Generate paragraphs
      const paragraphPrompt = `Generate 2 paragraphs about ${subject} (difficulty: ${difficulty}) in JSON format: {"paragraphs": ["",""]}`;
      const paragraphsData = await fetchGeminiContent(paragraphPrompt);
      setParagraphs(paragraphsData.paragraphs);

      // Generate questions
      const quizPrompt = `Create ${numQuestions} multiple choice questions with ${numOptions} options each about ${subject} (difficulty: ${difficulty}). Return in JSON format: ${JSON.stringify(
        jsonTemplate
      )}`;
      const quizResponse = await fetchGeminiContent(quizPrompt);

      if (validateJSON(quizResponse, jsonTemplate)) {
        setQuizData(quizResponse.questions);
        saveQuiz(quizResponse.questions);
      } else {
        throw new Error("Invalid quiz format");
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const submitQuiz = async (): Promise<void> => {
    const storedQuiz = await getQuiz();
    if (!storedQuiz) return;

    let newScore = 0;
    storedQuiz.forEach((question: Question) => {
      const selected = question.options.find((opt) => opt.selected);
      if (selected && JSON.parse(selected.isCorrect)) {
        newScore++;
      }
    });

    setScore(newScore);
  };

  const handleOptionSelect = (
    questionIndex: number,
    optionIndex: number
  ): void => {
    if (!quizData) return;

    const newQuizData = [...quizData];
    newQuizData[questionIndex].options.forEach((opt, idx) => {
      opt.selected = idx === optionIndex;
    });
    setQuizData(newQuizData);
    saveQuiz(newQuizData);
  };

  const renderQuestion = ({
    item,
    index,
  }: {
    item: Question;
    index: number;
  }) => {
    return (
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{`${index + 1}. ${
          item.question
        }`}</Text>
        {item.options.map((option, optionIndex) => (
          <View key={optionIndex} style={styles.optionContainer}>
            <Checkbox
              value={option.selected || false}
              onValueChange={() => handleOptionSelect(index, optionIndex)}
              style={styles.checkbox}
              disabled={score !== null}
            />
            <Text style={styles.optionText}>{option.option}</Text>
            {score !== null && JSON.parse(option.isCorrect) && (
              <Text style={styles.correctBadge}> (Correct)</Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Produce your own quiz!</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Number of Questions"
          keyboardType="numeric"
          value={numQuestions}
          onChangeText={setNumQuestions}
        />
        <TextInput
          style={styles.input}
          placeholder="Number of Options"
          keyboardType="numeric"
          value={numOptions}
          onChangeText={setNumOptions}
        />
        <TextInput
          style={styles.input}
          placeholder="Subject"
          value={subject}
          onChangeText={setSubject}
        />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={difficulty}
            onValueChange={(itemValue) => setDifficulty(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Easy" value="easy" />
            <Picker.Item label="Medium" value="medium" />
            <Picker.Item label="Hard" value="hard" />
          </Picker>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={generateQuiz}>
          <Text style={styles.buttonText}>Generate Quiz</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.restartButton]}
          onPress={() => {
            setQuizData(null);
            setParagraphs([]);
            setScore(null);
            setNumQuestions("");
            setNumOptions("");
            setSubject("");
            setDifficulty("medium");
            setError("");
          }}
        >
          <Text style={styles.buttonText}>Restart</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#1e87f0" />
          <Text style={styles.loadingText}>Generating...</Text>
        </View>
      )}

      {error && <Text style={styles.error}>{error}</Text>}

      {paragraphs.map((para, index) => (
        <Text key={index} style={styles.paragraph}>
          {para}
        </Text>
      ))}

      {quizData && (
        <>
          <FlatList
            data={quizData}
            renderItem={renderQuestion}
            keyExtractor={(_, index) => index.toString()}
          />
          {score !== null && (
            <Text style={styles.result}>
              Your Score: {score}/{quizData.length}
            </Text>
          )}
          <TouchableOpacity style={styles.submitButton} onPress={submitQuiz}>
            <Text style={styles.buttonText}>Submit Quiz</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#005eb8",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#005eb8",
    borderRadius: 5,
    marginBottom: 15,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#005eb8",
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#005eb8",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  restartButton: {
    backgroundColor: "#dc3545",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  loading: {
    alignItems: "center",
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    color: "#1e87f0",
  },
  error: {
    color: "red",
    marginBottom: 20,
  },
  paragraph: {
    marginBottom: 15,
    lineHeight: 20,
  },
  questionCard: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 10,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  checkbox: {
    marginRight: 10,
  },
  optionText: {
    fontSize: 14,
  },
  correctBadge: {
    color: "green",
    fontSize: 12,
  },
  submitButton: {
    backgroundColor: "#005eb8",
    padding: 15,
    borderRadius: 5,
    marginVertical: 20,
    marginBottom: 40,
  },
  result: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
});

export default QuizGenerator;
