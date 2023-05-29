import {
  faFileDownload,
  faFileZipper,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loading from 'components/Loading';
import { useAuth } from 'hooks/useAuth';
import {
  getAttachmentsDownloadUrl,
  getDownloadAttachmentUrl,
} from 'legacy/api/ispyb';
import { AutoProcIntegration } from 'legacy/helpers/mx/results/resultparser';
import { useAttachmentList } from 'legacy/hooks/ispyb';
import { PropsWithChildren, Suspense, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Col,
  Container,
  Modal,
  Row,
  Table,
} from 'react-bootstrap';

export function DownloadResultRow({
  result,
  proposalName,
  children,
}: PropsWithChildren<{
  result: AutoProcIntegration;
  proposalName: string;
}>) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <DownloadResultModal
        proposalName={proposalName}
        result={result}
        show={showModal}
        setShow={setShowModal}
      />
      <tr onClick={() => setShowModal(true)} style={{ cursor: 'pointer' }}>
        {children}
      </tr>
    </>
  );
}

function DownloadResultModal({
  result,
  proposalName,
  show,
  setShow,
}: {
  result: AutoProcIntegration;
  proposalName: string;
  show: boolean;
  setShow: (v: boolean) => void;
}) {
  return (
    <Modal
      centered
      size="lg"
      show={show}
      onHide={() => setShow(false)}
      onShow={() => setShow(true)}
    >
      <Modal.Header closeButton>
        <h5>Download results from {result.program}</h5>
      </Modal.Header>
      <Modal.Body>
        <Suspense fallback={<Loading />}>
          <DownloadResultModalContent
            proposalName={proposalName}
            result={result}
          />
        </Suspense>
      </Modal.Body>
    </Modal>
  );
}

function DownloadResultModalContent({
  result,
  proposalName,
}: {
  result: AutoProcIntegration;
  proposalName: string;
}) {
  const { data } = useAttachmentList({
    proposalName,
    autoprocprogramid: result.programId.toString(),
  });

  const { site, token } = useAuth();

  const urlPrefix = `${site.host}${site.apiPrefix}/${token}`;

  const downloadAllUrl = getAttachmentsDownloadUrl({
    proposalName,
    autoprocprogramid: result.programId.toString(),
  }).url;

  const downloadFile = (url: string, name?: string) => {
    const fileUrl = urlPrefix + url;
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', name || 'no_name');
    document.body.appendChild(link);
    link.click();
  };

  if (!data || data.flatMap((d) => d).length === 0)
    return <Alert>Nothing to download.</Alert>;
  return (
    <Container>
      <Col>
        <Row>
          <Col></Col>
          <Col xs={'auto'}>
            <Button
              style={{ marginBottom: 20 }}
              onClick={() => downloadFile(downloadAllUrl)}
            >
              <FontAwesomeIcon icon={faFileZipper} /> Download all
            </Button>
          </Col>
          <Col></Col>
        </Row>
        <Table striped={true} hover style={{ cursor: 'pointer' }}>
          <tbody>
            {data
              .flatMap((d) => d)
              .sort((a, b) =>
                (a.fileName || '').localeCompare(b.fileName || '')
              )
              .map((d) => (
                <tr
                  key={d.autoProcProgramAttachmentId}
                  onClick={() =>
                    downloadFile(
                      getDownloadAttachmentUrl({
                        proposalName,
                        autoprocattachmentid:
                          d.autoProcProgramAttachmentId.toString(),
                      }).url,
                      d.fileName
                    )
                  }
                >
                  <td style={{ width: 0 }}>
                    <FontAwesomeIcon icon={faFileDownload} />
                  </td>
                  <td>{d.fileName}</td>
                  <td>
                    <Badge bg="info">{d.fileType}</Badge>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Col>
    </Container>
  );
}
