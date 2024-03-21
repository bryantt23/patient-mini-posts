import Posts from './components/Posts';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
function App() {
  return (
    <ThemeProvider theme={theme}>
      <Posts />
    </ThemeProvider>
  );
}

export default App;
