import React from 'react';
import { Carousel } from 'react-bootstrap';

export default function WelcomeCarousel() {
  return (
    <Carousel fade variant="dark">
      <Carousel.Item style={{ textAlign: 'center' }}>
        <img className="w-75" src="/images/carousel/sessions_cosmo_reduced.png" alt="Second slide" />
        <Carousel.Caption>
          <h3>Welcome to ISPyB</h3>
          <p>This is the most recent interface to ISPyB. It's compatible with ISPyB and the newest py-ISPyB.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item style={{ textAlign: 'center' }}>
        <img className="w-50" src="/images/carousel/statistics_reduced.jpeg" alt="Second slide" />

        <Carousel.Caption>
          <h3>Monitor your experiment in real time</h3>
          <p>Real time statistics helps with the decision-making during the experiment</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item style={{ textAlign: 'center', margin: '-50' }}>
        <img className="w-50" src="/images/carousel/2dclassification.gif" alt="Second slide" />
        <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br />
        <Carousel.Caption style={{ textAlign: 'center', margin: '-50' }}>
          <br />
          <h3>EM 2d Classification</h3>
          <p>Cluster analysis with resolution filtering</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item style={{ textAlign: 'center', margin: '-50' }}>
        <img className="w-50" src="/images/carousel/movies.jpeg" alt="Second slide" />
        <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br />
        <Carousel.Caption style={{ textAlign: 'center', margin: '-50' }}>
          <br />
          <h3>EM Movies statistics</h3>
          <p>Motion correction drift and CFT</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item style={{ textAlign: 'center', margin: '-50' }}>
        <img
          className="w-50"
          src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.g2crowd.com%2Fuploads%2Fproduct%2Fimage%2Fsocial_landscape%2Fsocial_landscape_048daf32d4748a4dcd8a38617af4ff85%2Fkeycloak.png&f=1&nofb=1"
          alt="Second slide"
        />
        <br />
        <Carousel.Caption style={{ textAlign: 'center', margin: '-50' }}>
          <br />
          <h3>Multiple authentication plugins</h3>
          <p>Authenticate users with openId or LDAP out of the box</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}
