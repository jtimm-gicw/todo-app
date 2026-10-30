/**
 * Top-level application layout and routing.
 * The login screen replaces protected pages until the API verifies a session.
 */
import { useContext } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Center, Container, Loader } from '@mantine/core';
import { AuthContext } from './Context/Auth/Auth';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Login from './Components/Login/Login';
import SettingsForm from './Components/SettingsForm/SettingsForm';
import ToDo from './Components/ToDo/ToDo';

export default function App() {
  const { isLoggedIn, authLoading } = useContext(AuthContext);

  // LOADING: wait for /me to validate a restored cookie.
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Header />
        <main className="main-content">
          <Container size="xl">
            {authLoading ? (
              <Center mih={400}><Loader aria-label="Checking your session" /></Center>
            ) : isLoggedIn ? (
              <Routes>
                <Route path="/" element={<ToDo />} />
                <Route path="/settings" element={<SettingsForm />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            ) : (
              <Login />
            )}
          </Container>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
