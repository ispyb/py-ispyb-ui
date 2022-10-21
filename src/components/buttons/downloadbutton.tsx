import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import NotificationToast from 'components/notification/notificationtoast';
import { useState } from 'react';
import { Button, ButtonProps, Spinner } from 'react-bootstrap';
import { saveAs } from 'file-saver';

export default function DownloadButton({ title, url, fileName, icon = faDownload, ...btnprops }: { title: string; url: string; fileName: string; icon?: IconProp } & ButtonProps) {
  const [notif, setNotif] = useState<JSX.Element | undefined>(undefined);
  const [downloading, setDownloading] = useState(false);

  const download = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, href: string, fileName: string) => {
    setDownloading(true);
    axios({
      url: href,
      method: 'GET',
      responseType: 'blob',
    }).then(
      (response) => {
        saveAs(response.data, fileName);
        setDownloading(false);
        if (btnprops.onClick) btnprops.onClick(e);
      },
      (error) => {
        console.error(error);
        setDownloading(false);
        setNotif(<NotificationToast type="error" message={`Could not download ${fileName}`} onClose={() => setNotif(undefined)}></NotificationToast>);
      }
    );
  };

  return (
    <>
      {notif}
      <Button {...btnprops} onClick={(e) => download(e, url, fileName)}>
        {downloading ? <Spinner style={{ marginRight: 5 }} animation="border" size="sm" /> : <FontAwesomeIcon icon={icon} style={{ marginRight: 5 }}></FontAwesomeIcon>}
        {title}
      </Button>
    </>
  );
}
