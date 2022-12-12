import { Suspense, useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import Header from 'components/Header';
import LoadingProgress from 'components/LoadingProgress';
import Breadcrumbs from 'components/Breadcrumbs';

import routes from 'routes';
import { useAuth } from 'hooks/useAuth';
import Loading from 'components/Loading';

function Footer() {
  return (
    <div className="footer">
      <Container className="text-center">&copy; 2022 ESRF</Container>
    </div>
  );
}

function App() {
  const { restoreToken } = useAuth();
  useEffect(() => {
    restoreToken();
  }, [restoreToken]);

  const routesElement = useRoutes(routes);
  return (
    <div className="App">
      <Header />
      <LoadingProgress />
      <Breadcrumbs />
      <Suspense fallback={<Loading />}>
        <section className="main-wrapper">
          <Container
            style={{ paddingLeft: 100, paddingRight: 100 }}
            fluid
            className="main"
          >
            {routesElement}
          </Container>
        </section>
      </Suspense>
      <Footer />
    </div>
  );
}

export default App;
