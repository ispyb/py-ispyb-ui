import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { ChevronCompactLeft, ChevronCompactRight } from 'react-bootstrap-icons';

import { LazyImage } from 'api/resources/XHRFile';

function LightBoxHolder({ children }: { children: JSX.Element }) {
  return (
    <div className="lightbox-main">
      <div className="lightbox-wrap">{children}</div>
    </div>
  );
}

interface ILightBox {
  images: string[];
  children: JSX.Element;
  local?: boolean;
}

export default function LightBox(props: ILightBox) {
  const { images, children, local } = props;
  const [showLightBox, setShowLightBox] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<number>(0);

  return (
    <>
      <Modal
        show={showLightBox}
        onHide={() => setShowLightBox(false)}
        dialogAs={LightBoxHolder}
      >
        <Button
          disabled={currentImage === 0}
          className="rounded-0"
          onClick={() =>
            setCurrentImage(currentImage > 0 ? currentImage - 1 : 0)
          }
        >
          <ChevronCompactLeft />
        </Button>
        <LazyImage local={local} src={images[currentImage]} />
        <Button
          disabled={currentImage === images.length - 1}
          className="rounded-0"
          onClick={() =>
            setCurrentImage(
              currentImage < images.length - 1
                ? currentImage + 1
                : images.length - 1
            )
          }
        >
          <ChevronCompactRight />
        </Button>
      </Modal>
      <div className="lightbox-holder" onClick={() => setShowLightBox(true)}>
        {children}
      </div>
    </>
  );
}
