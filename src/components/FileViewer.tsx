import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';

import { IFrameFile } from 'api/resources/XHRFile';

export function FileViewer({
  title,
  url,
  show,
  onHide,
}: {
  title: string;
  url: string;
  show: boolean;
  onHide: () => void;
}) {
  return (
    <Modal fullscreen="sm-down" size="lg" show={show} onHide={onHide}>
      <Modal.Header closeButton>{title}</Modal.Header>
      <Modal.Body>
        <IFrameFile src={url} style={{ width: '100%', height: '75vh' }} />
      </Modal.Body>
    </Modal>
  );
}

export default function ButtonFileViewer({
  url,
  title,
  icon,
  buttonClasses,
}: {
  url: string;
  title: string;
  icon?: JSX.Element;
  buttonClasses?: string;
}) {
  const [show, setShow] = useState<boolean>(false);
  return (
    <>
      <FileViewer
        title={title}
        url={url}
        show={show}
        onHide={() => setShow(false)}
      />
      <Button className={buttonClasses} size="sm" onClick={() => setShow(true)}>
        {icon ? icon : <Search />}
      </Button>
    </>
  );
}
