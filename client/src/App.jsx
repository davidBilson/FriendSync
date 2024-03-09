import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import HomePage from 'scenes/homePage/HomePage';
import LoginPage from 'scenes/loginPage/LoginPage';;
import ProfilePage from 'scenes/profilePage/ProfilePage';
import { themeSettings } from './theme';
import { useSelector } from 'react-redux';

const App = () => {

  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])

  return (
    <>
      <BrowserRouter>
        <Routes> 
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;