import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { themeSettings } from './theme';
import { useSelector } from 'react-redux';
import LoginPage from './scenes/loginPage/LoginPage';
import HomePage from './scenes/homePage/HomePage';
import ProfilePage from './scenes/profilePage/ProfilePage';

const App = () => {

  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])

  return (
    <>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </>
  )
}

export default App;