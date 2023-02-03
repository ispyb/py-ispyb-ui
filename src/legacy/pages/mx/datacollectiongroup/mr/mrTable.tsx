import { useAuth } from 'hooks/useAuth';
import { getPhasingAttachmentDownloadUrl } from 'legacy/api/ispyb';
import _ from 'lodash';
import { Alert, Card, Col, Table } from 'react-bootstrap';
import { PhasingInfo } from '../../model';
import { openInNewTab } from 'legacy/helpers/opentab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

export function MRTable({
  proposalName,
  results,
}: {
  results: PhasingInfo[];
  proposalName: string;
}) {
  return (
    <Col>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th className="text-center"></th>
          </tr>
        </thead>
        <tbody>
          {_(results)
            .groupBy((r) => r.SpaceGroup_spaceGroupName)
            .map((group) => (
              <ResultLine
                group={group}
                key={group[0].PhasingStep_phasingStepId}
                proposalName={proposalName}
              ></ResultLine>
            ))
            .value()}
        </tbody>
      </Table>
      <Alert variant="light" style={{ padding: 10, lineHeight: '1rem' }}>
        <small>
          <strong>
            Automatic processing of macromolecular crystallography X-ray
            diffraction data at the ESRF.
          </strong>
          <br />
          <i>
            Monaco S, Gordon E, Bowler MW, Delageniere S, Guijarro M, Spruce D,
            Svensson O, McSweeney SM, McCarthy AA, Leonard G, Nanao MH.
            <br />
          </i>
          J Appl Crystallogr. 2013 Jun 1;46(Pt 3):804-810.
          <br />
          <a href="https://www.ncbi.nlm.nih.gov/pubmed/?term=monaco+ESRF ">
            https://www.ncbi.nlm.nih.gov/pubmed/?term=monaco+ESRF
          </a>
        </small>
      </Alert>

      <Alert variant="light" style={{ padding: 10, lineHeight: '1rem' }}>
        <small>
          <strong>
            Experimental phasing with SHELXC/D/E: combining chain tracing with
            density modification.
          </strong>
          <br />
          <i>
            Sheldrick GM.
            <br />
          </i>
          Acta Crystallogr D Biol Crystallogr. 2010 Apr;66(Pt 4):479-85. doi:
          10.1107/S0907444909038360.
          <br />
          <a href="https://www.ncbi.nlm.nih.gov/pubmed/20383001">
            https://www.ncbi.nlm.nih.gov/pubmed/20383001
          </a>
        </small>
      </Alert>

      <Alert variant="light" style={{ padding: 10, lineHeight: '1rem' }}>
        <small>
          <strong>UglyMol: Electron Density Viewer</strong>
          <br />
          <a href="https://github.com/uglymol/uglymol">
            https://github.com/uglymol/uglymol
          </a>
        </small>
      </Alert>
    </Col>
  );
}

function ResultLine({
  group,
  proposalName,
}: {
  group: PhasingInfo[];
  proposalName: string;
}) {
  if (!group.length) return null;
  const ref = group[0];
  if (!ref.SpaceGroup_spaceGroupName) return null;
  return (
    <tr>
      <td>{ref.SpaceGroup_spaceGroupName}</td>
      <td>{ref.PhasingProgramRun_phasingPrograms}</td>
      <td>{ref.PhasingStep_method}</td>
      <td>{group.map((p) => p.PhasingStep_phasingStepType).join(', ')}</td>
      <td>{group.map((p) => p.PhasingStep_phasingStepId).join(', ')}</td>
      <td>
        {Number(ref.PhasingStep_highRes).toFixed(1)} -
        {Number(ref.PhasingStep_lowRes).toFixed(1)}
      </td>
      <UglyMolLinks group={group} proposalName={proposalName} />
    </tr>
  );
}

function UglyMolLinks({
  group,
  proposalName,
}: {
  group: PhasingInfo[];
  proposalName: string;
}) {
  const { site, token } = useAuth();
  const urlPrefix = `${site.host}${site.apiPrefix}/${token}`;

  const uglymols = parseUglymols(group, proposalName, urlPrefix);

  return (
    <>
      <td key={'density'} style={{ width: 0 }}>
        {uglymols.density && (
          <UglyMolPreview title="Density" src={uglymols.density} />
        )}
      </td>
      <td key={'mr'} style={{ width: 0 }}>
        {uglymols.mr && <UglyMolPreview title="MR" src={uglymols.mr} />}
      </td>
      <td key={'refined'} style={{ width: 0 }}>
        {uglymols.refined && (
          <UglyMolPreview title="Refined" src={uglymols.refined} />
        )}
      </td>
    </>
  );
}

export function UglyMolPreview({ title, src }: { title: string; src: string }) {
  return (
    <Card style={{ width: 400, height: 250 }}>
      <Card.Body>
        <iframe
          style={{
            width: '100%',
            height: '100%',
          }}
          onClick={(e) => e.preventDefault()}
          src={src}
          title={title}
        ></iframe>
      </Card.Body>
      <Card.Footer
        style={{ cursor: 'pointer' }}
        onClick={() => openInNewTab(src || '')}
        className="text-center text-primary"
      >
        <FontAwesomeIcon icon={faEye}></FontAwesomeIcon> {title}
      </Card.Footer>
    </Card>
  );
}

export function parseUglymols(
  group: PhasingInfo[],
  proposalName: string,
  urlPrefix: string
) {
  let res: { density?: string; mr?: string; refined?: string } = {
    density: undefined,
    mr: undefined,
    refined: undefined,
  };

  for (const step of group) {
    if (
      step.PhasingStep_phasingStepType &&
      ['MODELBUILDING', 'REFINEMENT', 'LIGAND_FIT'].includes(
        step.PhasingStep_phasingStepType
      )
    ) {
      if (
        step.PhasingStep_phasingStepType === 'MODELBUILDING' &&
        step.map &&
        step.pdb
      ) {
        res.density = buildUglymolUrl(
          step.pdb,
          step.map.split(','),
          undefined,
          urlPrefix,
          proposalName
        );
      } else if (
        step.PhasingStep_phasingStepType === 'REFINEMENT' ||
        step.PhasingStep_phasingStepType === 'LIGAND_FIT'
      ) {
        const maps = parseAttachments(step.mapFileName, step.map);
        const csvs = parseAttachments(step.csvFileName, step.csv);
        const pdbs = parseAttachments(step.pdbFileName, step.pdb);
        if (
          'MR.pdb' in pdbs &&
          '2FOFC_MR.map' in maps &&
          'FOFC_MR.map' in maps &&
          'peaks.csv' in csvs
        ) {
          res.mr = buildUglymolUrl(
            pdbs['MR.pdb'],
            [maps['2FOFC_MR.map'], maps['FOFC_MR.map']],
            csvs['peaks.csv'],
            urlPrefix,
            proposalName
          );
        }
        if (
          'refined.pdb' in pdbs &&
          '2FOFC_REFINE.map' in maps &&
          'FOFC_REFINE.map' in maps &&
          'peaks.csv' in csvs
        ) {
          res.refined = buildUglymolUrl(
            pdbs['refined.pdb'],
            [maps['2FOFC_REFINE.map'], maps['FOFC_REFINE.map']],
            csvs['peaks.csv'],
            urlPrefix,
            proposalName
          );
        }
      }
    }
  }
  return res;
}

function buildUglymolUrl(
  pdb: string,
  maps: string[],
  peaks: string | undefined,
  urlPrefix: string,
  proposalName: string
) {
  const pdbUrl =
    urlPrefix +
    getPhasingAttachmentDownloadUrl({
      proposalName,
      phasingprogramattachmentid: pdb,
    }).url;
  const mapFiles = maps.map(
    (m) =>
      urlPrefix +
      getPhasingAttachmentDownloadUrl({
        proposalName,
        phasingprogramattachmentid: m,
      }).url
  );
  const peaksUrl = peaks
    ? urlPrefix +
      getPhasingAttachmentDownloadUrl({
        proposalName,
        phasingprogramattachmentid: peaks,
      }).url
    : undefined;
  return (
    `https://exi.esrf.fr/viewer/uglymol/index.html?pdb=${pdbUrl}${mapFiles
      .map((f, i) => `&map${i + 1}=${f}`)
      .join('')}` + (peaksUrl ? `&peaks=${peaksUrl}` : '')
  );
}

function parseAttachments(
  names?: string,
  ids?: string
): { [name: string]: string } {
  if (!ids || !names) return {};
  const idList = ids.split(',');
  const nameList = names.split(',');
  if (idList.length !== nameList.length) return {};

  const res: { [name: string]: string } = {};

  nameList.forEach((name, index) => {
    res[name] = idList[index];
  });

  return res;
}
