import { useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

import Routes from './routes/index';

import themes from './themes/index';


import NavigationScroll from 'layout/NavigationScroll';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from "./lib/react-query.js";
import GlobalLoader from './components/GlobalLoader.jsx';


const App = () => {
  const customization = useSelector((state) => state.customization);

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalLoader />
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={themes(customization)}>
          <CssBaseline />
          <NavigationScroll>
            <Routes />
          </NavigationScroll>
        </ThemeProvider>
      </StyledEngineProvider>
    </QueryClientProvider>
  );
};

export default App;
