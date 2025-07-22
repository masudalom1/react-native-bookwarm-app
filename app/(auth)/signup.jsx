import React, { useState } from 'react';
import  { useRouter } from "expo-router"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';

export default function SignupScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router=useRouter()
  const {isLooding,register}=useAuthStore();

  const handleSubmit=async()=>{
    const result=await register(username,email,password);
    if(!result.sucess) Alert.alert("Error",result.error)
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* Illustration */}
          <View style={styles.illustrationContainer}>
            <Image
              source={require('../../assets/images/signup.png')} 
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>

          
          <View style={styles.form}>
          
            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#aaa"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your username"
                placeholderTextColor="#aaa"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                accessibilityLabel="Username input"
              />
            </View>

      
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#aaa"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                accessibilityLabel="Email input"
              />
            </View>

            
            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#aaa"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#aaa"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!passwordVisible}
                accessibilityLabel="Password input"
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
                style={styles.eyeIcon}
                accessibilityLabel={
                  passwordVisible ? 'Hide password' : 'Show password'
                }
              >
                <Ionicons
                  name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#aaa"
                />
              </TouchableOpacity>
            </View>

           
            <TouchableOpacity
              style={styles.signupButton}
              activeOpacity={0.8}
              onPress={handleSubmit}
              accessibilityRole="button"
              accessibilityLabel="Sign Up"
            >
              <Text style={styles.signupButtonText}>Sign Up</Text>
            </TouchableOpacity>

       
            <View style={styles.loginContainer}>
              <Text>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.loginText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6fff9',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 60,
     
  },
  illustration: {
    width: 300,
    height: 250,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    height: 48,
  },
  eyeIcon: {
    padding: 4,
  },
  signupButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  signupButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
});
