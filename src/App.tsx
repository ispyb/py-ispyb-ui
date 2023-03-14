import { Suspense, useEffect } from 'react';
import { useRoutes } from 'react-router-dom';

import routes from 'routes';
import { useAuth } from 'hooks/useAuth';
import Loading from 'components/Loading';

function App() {
  const { restoreToken } = useAuth();
  useEffect(() => {
    restoreToken();
  }, [restoreToken]);

  const routesElement = useRoutes(routes);
  return (
    <div className="App">
      <Suspense fallback={<Loading />}>{routesElement}</Suspense>
    </div>
  );
}

export default App;
