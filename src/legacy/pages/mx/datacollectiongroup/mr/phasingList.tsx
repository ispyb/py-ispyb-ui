import { useAuth } from 'hooks/useAuth';
import {
  getPhasingAttachmentDownloadUrl,
  getPhasingAttachmentImageUrl,
} from 'legacy/api/ispyb';
import {
  Alert,
  Badge,
  Button,
  Col,
  OverlayTrigger,
  Popover,
  Row,
} from 'react-bootstrap';
import { PhasingInfo } from '../../model';

import { MolData, UglyMolPreview } from 'components/Molecules/UglymolViewer';
import { Tree, TreeNode } from 'react-organizational-chart';
import { formatDateToDay, formatDateToTime } from 'helpers/dateparser';
import { useState } from 'react';
import _ from 'lodash';
import ZoomImage from 'legacy/components/image/zoomimage';

export function PhasingList({
  proposalName,
  results,
}: {
  results: PhasingInfo[];
  proposalName: string;
}) {
  return (
    <Col>
      <Chart
        infos={results.filter((r) => r.PhasingStep_phasingStepId)}
        proposalName={proposalName}
      ></Chart>
      <div style={{ padding: 10, lineHeight: '1rem' }}>
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
      </div>

      <div style={{ padding: 10, lineHeight: '1rem' }}>
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
      </div>

      <div style={{ padding: 10, lineHeight: '1rem' }}>
        <small>
          <strong>UglyMol: Electron Density Viewer</strong>
          <br />
          <a href="https://github.com/uglymol/uglymol">
            https://github.com/uglymol/uglymol
          </a>
        </small>
      </div>
    </Col>
  );
}

function Chart({
  infos,
  proposalName,
}: {
  infos: PhasingInfo[];
  proposalName: string;
}) {
  const [selectedGroup, setSelectedGroup] = useState('All');
  const roots = infos.filter(
    (i) => i.PhasingStep_previousPhasingStepId === null
  );
  const spaceGroups = _.uniq(roots.map((r) => r.SpaceGroup_spaceGroupName));
  return (
    <>
      <Row style={{ marginBottom: 10 }}>
        <Col xs={'auto'}>
          <Button
            variant={selectedGroup === 'All' ? 'primary' : 'outline-primary'}
            onClick={() => setSelectedGroup('All')}
            size="sm"
          >
            All
          </Button>
        </Col>
        {spaceGroups.map((group) => {
          if (!group) return null;
          return (
            <Col xs={'auto'} key={group}>
              <Button
                variant={
                  selectedGroup === group ? 'primary' : 'outline-primary'
                }
                onClick={() => setSelectedGroup(group)}
                size="sm"
              >
                {group}
              </Button>
            </Col>
          );
        })}
      </Row>
      <Row>
        <div
          style={{
            maxHeight: _([window.innerHeight * 0.5, 500]).max(),
            overflowY: 'auto',
            borderBottom: '1px solid black',
          }}
        >
          {roots
            .filter(
              (r) =>
                selectedGroup === 'All' ||
                r.SpaceGroup_spaceGroupName === selectedGroup
            )
            .map((r) => (
              <ChartLine
                key={r.PhasingStep_phasingStepId}
                infos={infos}
                root={r}
                proposalName={proposalName}
              />
            ))}
        </div>
      </Row>
    </>
  );
}

function ChartLine({
  infos,
  root,
  proposalName,
}: {
  infos: PhasingInfo[];
  root: PhasingInfo;
  proposalName: string;
}) {
  const [selected, setSelected] = useState<PhasingInfo | undefined>(undefined);

  const { site, token } = useAuth();
  const urlPrefix = `${site.host}${site.apiPrefix}/${token}`;
  const mol = selected
    ? parseUglymols([selected], proposalName, urlPrefix)
    : undefined;
  return (
    <Alert
      key={root.PhasingStep_phasingStepId}
      variant="light"
      style={{ padding: 10, lineHeight: '1rem' }}
    >
      <Row>
        <Col xs={'auto'}>
          <Badge>{root.PhasingStep_method} </Badge>
        </Col>
        <Col xs={'auto'}>
          <Badge>{root.SpaceGroup_spaceGroupName}</Badge>
        </Col>
      </Row>
      <div style={{ overflowX: 'auto', padding: 1 }}>
        <Tree
          label={
            <PhasingStepNode
              proposalName={proposalName}
              node={root}
              selected={selected === root}
              onSelect={setSelected}
            />
          }
        >
          <ChartChildren
            node={root}
            infos={infos}
            selected={selected}
            onSelect={setSelected}
            proposalName={proposalName}
          />
        </Tree>
      </div>
      {mol && hasAnyMol(mol) && (
        <>
          <div style={{ borderTop: '1px solid gray', height: 0, margin: 20 }} />
          <Row>
            {mol.density && (
              <Col>
                <UglyMolPreview mol={mol.density} title="Density" />
              </Col>
            )}
            {mol.mr && (
              <Col>
                <UglyMolPreview mol={mol.mr} title="MR" />
              </Col>
            )}
            {mol.refined && (
              <Col>
                <UglyMolPreview mol={mol.refined} title="Refined" />
              </Col>
            )}
          </Row>
        </>
      )}
    </Alert>
  );
}

function ChartChildren({
  infos,
  node,
  proposalName,
  selected,
  onSelect,
}: {
  infos: PhasingInfo[];
  node: PhasingInfo;
  proposalName: string;
  selected?: PhasingInfo;
  onSelect: (p: PhasingInfo) => void;
}) {
  const children = infos.filter(
    (i) =>
      i.PhasingStep_previousPhasingStepId === node.PhasingStep_phasingStepId
  );
  if (!children.length) return null;
  return (
    <>
      {children.map((r) => {
        const subChildren = infos.filter(
          (i) =>
            i.PhasingStep_previousPhasingStepId === r.PhasingStep_phasingStepId
        );
        return (
          <TreeNode
            key={r.PhasingStep_phasingStepId}
            label={
              <PhasingStepNode
                proposalName={proposalName}
                node={r}
                parent={node}
                selected={selected === r}
                onSelect={onSelect}
              />
            }
          >
            {subChildren.length ? (
              <ChartChildren
                node={r}
                infos={infos}
                proposalName={proposalName}
                selected={selected}
                onSelect={onSelect}
              />
            ) : undefined}
          </TreeNode>
        );
      })}
    </>
  );
}

function PhasingStepNodeInfo({
  node,
  parent,
}: {
  node: PhasingInfo;
  parent?: PhasingInfo;
}) {
  const getToDisplay = (
    node: PhasingInfo
  ): {
    label: React.ReactNode;
    value: React.ReactNode;
    key: string;
  }[] => {
    const getTimeValue = () => {
      if (
        node.PhasingProgramRun_phasingStartTime &&
        node.PhasingProgramRun_phasingEndTime
      ) {
        const startDay = formatDateToDay(
          node.PhasingProgramRun_phasingStartTime
        );
        const startTime = formatDateToTime(
          node.PhasingProgramRun_phasingStartTime
        );
        const endDay = formatDateToDay(node.PhasingProgramRun_phasingEndTime);
        const endTime = formatDateToTime(node.PhasingProgramRun_phasingEndTime);
        if (startDay !== endDay)
          return (
            <Row>
              <small>
                <i>
                  {startDay} {startTime}
                  {' - '}
                  {endDay} {endTime}
                </i>
              </small>
            </Row>
          );
        return (
          <Row>
            <small>
              <i>
                {startDay} {startTime}
                {' - '}
                {endTime}
              </i>
            </small>
          </Row>
        );
      }
      return null;
    };
    return [
      {
        label: 'Program',
        value: node.PhasingProgramRun_phasingPrograms,
        key: 'program',
      },
      {
        label: 'Time',
        value: getTimeValue(),
        key: 'time',
      },
      {
        label: 'Resolution',
        value: `${node.PhasingStep_highRes}Å - ${node.PhasingStep_lowRes}Å`,
        key: 'resolution',
      },
      {
        label: 'Enantiomorph',
        value: node.PhasingStep_enantiomorph,
        key: 'enantiomorph',
      },
      {
        label: 'Solvent',
        value: node.PhasingStep_solventContent,
        key: 'solvent',
      },
      ...(node.statisticsValue && node.metric
        ? _(node.metric.split(', '))
            .zip(node.statisticsValue.split(', '))
            .map(([metric, value]) => {
              if (
                Number.isNaN(Number(value)) ||
                Number.isInteger(Number(value))
              ) {
                return {
                  label: metric,
                  value: value,
                  key: metric || 'undefined',
                };
              }
              return {
                label: metric,
                value: Number(value).toFixed(2),
                key: metric || 'undefined',
              };
            })
            .value()
        : []),
    ];
  };
  let info = getToDisplay(node).filter((i) => i.value);

  if (parent) {
    const infoParent = getToDisplay(parent);
    info = info.filter((i) => {
      const parentInfo = infoParent.find((p) => p.key === i.key);
      return !parentInfo || parentInfo.value !== i.value;
    });
  }
  if (info.length === 0) return null;

  return (
    <Col>
      {info.map((i) => (
        <Row key={i.key}>
          {' '}
          <small>
            <strong>{i.label}:</strong> {i.value}
          </small>
        </Row>
      ))}
    </Col>
  );
}

function PhasingStepImages({
  ids,
  names,
  proposalName,
}: {
  ids?: string;
  names?: string;
  proposalName: string;
}) {
  if (!names || !ids) return null;
  const images = _(names.split(','))
    .zip(ids.split(','))
    .map(([name, id]) => ({ name, id }))
    .value();

  return (
    <Row>
      {images.map(
        (i) =>
          i.id &&
          i.name && (
            <Col key={i.id} xs={images.length === 1 ? 12 : 6}>
              <Row>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ZoomImage
                    src={
                      getPhasingAttachmentImageUrl({
                        proposalName,
                        phasingprogramattachmentid: i.id,
                      }).url
                    }
                    style={{ width: 100 }}
                  />
                </div>
              </Row>
              {i.name.split('_').map((n) => (
                <Row key={n}>
                  <small>
                    <i>{n.toLowerCase()}</i>
                  </small>
                </Row>
              ))}
            </Col>
          )
      )}
    </Row>
  );
}

function PhasingStepNode({
  node,
  parent,
  proposalName,
  selected,
  onSelect,
}: {
  node: PhasingInfo;
  parent?: PhasingInfo;
  proposalName: string;
  selected: boolean;
  onSelect: (p: PhasingInfo) => void;
}) {
  const { site, token } = useAuth();
  const urlPrefix = `${site.host}${site.apiPrefix}/${token}`;

  const mol = parseUglymols([node], proposalName, urlPrefix);
  const hasMol = hasAnyMol(mol);

  const mapName = (name?: string) => {
    if (name === 'SUBSTRUCTUREDETERMINATION') {
      return 'SUBSTRUCTURE DETERMINATION';
    }
    if (name === 'MODELBUILDING') {
      return 'MODEL BUILDING';
    }
    return name;
  };
  const capitalizeName = (name?: string) => {
    if (!name) return name;
    return name
      .split(' ')
      .map((n) => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase())
      .join(' ');
  };

  const overlay = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">
        {node.PhasingStep_phasingStepType}
      </Popover.Header>
      <Popover.Body>
        <PhasingStepNodeInfo node={node} />
      </Popover.Body>
    </Popover>
  );

  const infos = <PhasingStepNodeInfo node={node} parent={parent} />;

  return (
    <OverlayTrigger
      trigger={['hover', 'focus']}
      placement="bottom"
      overlay={overlay}
    >
      <div
        style={{
          border: hasMol ? '1px solid blue' : '1px solid gray',
          borderRadius: 5,
          width: 'auto',
          padding: 5,
          display: 'inline-block',
          backgroundColor: selected ? 'lightblue' : 'white',
          cursor: hasMol ? 'pointer' : 'default',
        }}
        onClick={() => hasMol && onSelect(node)}
      >
        <Col>
          <Row>
            <small>
              <strong>
                {capitalizeName(mapName(node.PhasingStep_phasingStepType))}
              </strong>
            </small>
          </Row>
          {infos && (
            <Row
              style={{
                marginRight: 0,
                marginLeft: 0,
                marginBottom: 5,
                marginTop: 5,
              }}
            >
              <div
                style={{
                  borderTop: '1px solid gray',
                }}
              />
            </Row>
          )}
          {infos}
          {mol.density && (
            <Row style={{ margin: 0 }}>
              <Badge style={{ margin: 0, marginTop: 5 }}>Density</Badge>
            </Row>
          )}
          {mol.mr && (
            <Row style={{ margin: 0 }}>
              <Badge style={{ margin: 0, marginTop: 5 }}>MR</Badge>
            </Row>
          )}
          {mol.refined && (
            <Row style={{ margin: 0 }}>
              <Badge style={{ margin: 0, marginTop: 5 }}>Refined</Badge>
            </Row>
          )}
          <PhasingStepImages
            proposalName={proposalName}
            ids={node.png}
            names={node.fileType}
          />
        </Col>
      </div>
    </OverlayTrigger>
  );
}

export type UglyMol = { density?: MolData; mr?: MolData; refined?: MolData };

function hasAnyMol(uglymols?: UglyMol) {
  return !!uglymols?.density || !!uglymols?.mr || !!uglymols?.refined;
}

export function parseUglymols(
  group: PhasingInfo[],
  proposalName: string,
  urlPrefix: string
) {
  let res: UglyMol = {
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

  return { pdb: pdbUrl, map1: mapFiles[0], map2: mapFiles[1], peaks: peaksUrl };
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
