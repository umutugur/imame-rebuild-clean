import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const { login, promptGoogle, promptFacebook } = useContext(AuthContext); // Google & Facebook fonksiyonları eklendi
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password);
      navigation.replace('Main'); // Ana sayfaya yönlendir
    } catch (error) {
      alert('Giriş başarısız: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Giriş Yap</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Giriş Yap</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.googleButton} onPress={() => promptGoogle()}>
        <Text style={styles.socialText}>Google ile Giriş Yap</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
  style={styles.facebookButton}
  onPress={() => alert('Facebook ile giriş şu anda devre dışı.')}
>
  <Text style={styles.socialText}>Facebook ile Giriş Yap</Text>
</TouchableOpacity>
    

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Hesabın yok mu?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerLink}> Kayıt ol</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff8e1',
  },
  logo: {
    width: 640,
    height: 240,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4e342e',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#6d4c41',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  googleButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#4285F4',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  facebookButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#3b5998',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  socialText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  registerText: {
    color: '#4e342e',
    fontSize: 14,
  },
  registerLink: {
    color: '#6d4c41',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
