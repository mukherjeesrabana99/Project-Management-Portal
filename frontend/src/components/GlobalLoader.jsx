
import { useIsFetching } from "@tanstack/react-query";
import { LinearProgress } from "@mui/material";

const GlobalLoader = () => {
  const isFetching = useIsFetching();

  if (!isFetching) return null;

  return <LinearProgress />;
};

export default GlobalLoader;