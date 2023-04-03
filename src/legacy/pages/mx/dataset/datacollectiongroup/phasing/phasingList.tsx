import { getPhasingAttachmentImageUrl } from 'legacy/api/ispyb';
import {
  Alert,
  Badge,
  Button,
  Col,
  OverlayTrigger,
  Popover,
  Row,
} from 'react-bootstrap';

import { UglyMolPreview } from 'components/Molecules/UglymolViewer';
import { Tree, TreeNode } from 'react-organizational-chart';
import { formatDateToDay, formatDateToTime } from 'helpers/dateparser';
import { useState } from 'react';
import _ from 'lodash';
import ZoomImage from 'legacy/components/image/zoomimage';
import {
  PhasingStep,
  PhasingTree,
  PhasingTreeNode,
  PHASING_RANKING_METHOD_DESCRIPTION,
  stepsToTrees,
} from 'legacy/helpers/mx/results/phasingparser';
import { HelpIconCol } from 'components/Common/HelpIcon';

export function PhasingList({
  proposalName,
  results,
}: {
  results: PhasingStep[];
  proposalName: string;
}) {
  const phasingTrees = stepsToTrees(results);
  const [selected, setSelected] = useState<PhasingTreeNode | undefined>(
    undefined
  );

  return (
    <Col>
      <Chart
        data={phasingTrees}
        proposalName={proposalName}
        selected={selected}
        setSelected={setSelected}
      ></Chart>
      <SelectedStepInfo
        proposalName={proposalName}
        selected={selected}
        setSelected={setSelected}
      ></SelectedStepInfo>
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
          <a href="https://pubmed.ncbi.nlm.nih.gov/23682196">
            https://pubmed.ncbi.nlm.nih.gov/23682196
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
          <a href="https://pubmed.ncbi.nlm.nih.gov/20383001">
            https://pubmed.ncbi.nlm.nih.gov/20383001
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

function SelectedStepInfo({
  selected,
  setSelected,
}: {
  proposalName: string;
  selected: PhasingTreeNode | undefined;
  setSelected: (s: PhasingTreeNode | undefined) => void;
}) {
  if (!selected)
    return (
      <Alert variant="dark" style={{ marginTop: 10, backgroundColor: 'black' }}>
        Select a step above to see details.
      </Alert>
    );

  return (
    <Alert variant="dark" style={{ marginTop: 10, backgroundColor: 'black' }}>
      <Row>
        <Col md={12} xl={4} xxl={2}>
          <Row>
            <Col xs={'auto'}>
              <Badge bg="light" style={{ margin: 0 }}>
                {selected.step.phasing.PhasingStep_method}
              </Badge>
            </Col>
            <Col xs={'auto'}>
              <Badge bg="light" style={{ margin: 0 }}>
                {selected.step.phasing.SpaceGroup_spaceGroupName}
              </Badge>
            </Col>
          </Row>
          <div
            style={{
              border: '1px solid white',
              marginTop: 10,
              marginBottom: 10,
            }}
          />
          <Row>
            <PhasingStepNodeInfo node={selected}></PhasingStepNodeInfo>
          </Row>
        </Col>

        {selected.step.molecules.length ? (
          selected.step.molecules.map((mol, index) => (
            <Col
              key={mol.pdb}
              md={12}
              xl={index === 0 ? 8 : 12}
              xxl={selected.step.molecules.length === 1 ? 10 : 5}
            >
              <div style={{ border: '1px solid white', margin: 5, padding: 1 }}>
                <UglyMolPreview mol={mol} key={mol.pdb} />
              </div>
            </Col>
          ))
        ) : (
          <Col>
            <Alert
              style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              variant="dark"
            >
              {selected.step.phasing.pdb
                ? `${selected.step.phasing.pdbFileName} could not be interpreted by ISPyB.`
                : 'This step did not produce any PDB file'}
            </Alert>
          </Col>
        )}
      </Row>
    </Alert>
  );
}

function Chart({
  data,
  proposalName,
  selected,
  setSelected,
}: {
  data: PhasingTree[];
  proposalName: string;
  selected: PhasingTreeNode | undefined;
  setSelected: (s: PhasingTreeNode | undefined) => void;
}) {
  const countUnsuccessful = data.filter((d) => !d.root.success).length;
  const countSuccessful = data.filter((d) => d.root.success).length;
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [selectedMethod, setSelectedMethod] = useState('All');

  const [successFilter, setSuccessFilter] = useState<
    'all' | 'success' | 'failed'
  >(countSuccessful ? 'success' : 'all');

  const spaceGroups = _(data)
    .groupBy((d) => d.root.step.phasing.SpaceGroup_spaceGroupName)
    .map((d, group) => ({
      group,
      count: d.length,
    }))
    .value();
  const methods = _(data)
    .groupBy((d) => d.method)
    .map((d, method) => ({
      method,
      count: d.length,
    }))
    .value();

  const filteredData = data.filter((d) => {
    if (successFilter === 'success' && !d.root.success) return false;
    if (successFilter === 'failed' && d.root.success) return false;
    if (selectedGroup !== 'All') {
      return d.root.step.phasing.SpaceGroup_spaceGroupName === selectedGroup;
    }
    if (selectedMethod !== 'All') {
      return d.method === selectedMethod;
    }
    return true;
  });

  return (
    <>
      <Row style={{ marginBottom: 10 }}>
        <Col xs={'auto'}>
          <Button
            variant={selectedGroup === 'All' ? 'primary' : 'outline-primary'}
            onClick={() => setSelectedGroup('All')}
            size="sm"
          >
            Any space group ({data.length})
          </Button>
        </Col>
        {spaceGroups.map((group) => {
          if (!group) return null;
          return (
            <Col xs={'auto'} key={group.group}>
              <Button
                variant={
                  selectedGroup === group.group ? 'primary' : 'outline-primary'
                }
                onClick={() => setSelectedGroup(group.group)}
                size="sm"
              >
                {group.group} ({group.count})
              </Button>
            </Col>
          );
        })}
      </Row>
      <Row style={{ marginBottom: 10 }}>
        <Col xs={'auto'}>
          <Button
            variant={successFilter === 'all' ? 'primary' : 'outline-primary'}
            onClick={() => setSuccessFilter('all')}
            size="sm"
          >
            Any status ({data.length})
          </Button>
        </Col>
        <Col xs={'auto'}>
          <Button
            variant={
              successFilter === 'success' ? 'primary' : 'outline-primary'
            }
            onClick={() => setSuccessFilter('success')}
            size="sm"
          >
            Successful ({countSuccessful})
          </Button>
        </Col>
        <Col xs={'auto'}>
          <Button
            variant={successFilter === 'failed' ? 'primary' : 'outline-primary'}
            onClick={() => setSuccessFilter('failed')}
            size="sm"
          >
            Unsuccessful ({countUnsuccessful})
          </Button>
        </Col>

        <HelpIconCol
          size={'lg'}
          message="Phasing pipelines are considered successful when they end up generating at least one PDB file."
        />
      </Row>
      <Row style={{ marginBottom: 10 }}>
        <Col xs={'auto'}>
          <Button
            variant={selectedMethod === 'All' ? 'primary' : 'outline-primary'}
            onClick={() => setSelectedMethod('All')}
            size="sm"
          >
            Any method ({data.length})
          </Button>
        </Col>
        {methods.map((method) => {
          if (!method) return null;
          return (
            <Col xs={'auto'} key={method.method}>
              <Button
                variant={
                  selectedMethod === method.method
                    ? 'primary'
                    : 'outline-primary'
                }
                onClick={() => setSelectedMethod(method.method)}
                size="sm"
              >
                {method.method} ({method.count})
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
          {filteredData.map((r) => (
            <ChartLine
              key={r.root.step.phasing.PhasingStep_phasingStepId}
              data={r}
              proposalName={proposalName}
              selected={selected}
              setSelected={setSelected}
            />
          ))}
        </div>
      </Row>
    </>
  );
}

function ChartLine({
  data,
  proposalName,
  selected,
  setSelected,
}: {
  data: PhasingTree;
  proposalName: string;
  selected: PhasingTreeNode | undefined;
  setSelected: (s: PhasingTreeNode | undefined) => void;
}) {
  return (
    <Alert
      key={data.root.step.phasing.PhasingStep_phasingStepId}
      variant="light"
      style={{ padding: 10, lineHeight: '1rem' }}
    >
      <Row>
        <Col xs={'auto'}>
          <Badge>{data.root.step.phasing.PhasingStep_method} </Badge>
        </Col>
        <Col xs={'auto'}>
          <Badge>{data.root.step.phasing.SpaceGroup_spaceGroupName}</Badge>
        </Col>
      </Row>
      <div style={{ overflowX: 'auto', padding: 1 }}>
        <Tree
          label={
            <PhasingStepNode
              proposalName={proposalName}
              node={data.root}
              selected={selected}
              onSelect={setSelected}
            />
          }
        >
          <ChartChildren
            node={data.root}
            selected={selected}
            onSelect={setSelected}
            proposalName={proposalName}
          />
        </Tree>
      </div>
    </Alert>
  );
}

function ChartChildren({
  node,
  proposalName,
  selected,
  onSelect,
}: {
  node: PhasingTreeNode;
  proposalName: string;
  selected?: PhasingTreeNode;
  onSelect: (p: PhasingTreeNode) => void;
}) {
  if (!node.children.length) return null;
  return (
    <>
      {node.children.map((c) => {
        return (
          <TreeNode
            key={c.step.phasing.PhasingStep_phasingStepId}
            label={
              <PhasingStepNode
                proposalName={proposalName}
                node={c}
                parent={node}
                selected={selected}
                onSelect={onSelect}
              />
            }
          >
            {c.children.length ? (
              <ChartChildren
                node={c}
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
  node: PhasingTreeNode;
  parent?: PhasingTreeNode;
}) {
  const getToDisplay = (
    node: PhasingTreeNode
  ): {
    label: React.ReactNode;
    value: React.ReactNode;
    key: string;
  }[] => {
    const getTimeValue = () => {
      if (
        node.step.phasing.PhasingProgramRun_phasingStartTime &&
        node.step.phasing.PhasingProgramRun_phasingEndTime
      ) {
        const startDay = formatDateToDay(
          node.step.phasing.PhasingProgramRun_phasingStartTime
        );
        const startTime = formatDateToTime(
          node.step.phasing.PhasingProgramRun_phasingStartTime
        );
        const endDay = formatDateToDay(
          node.step.phasing.PhasingProgramRun_phasingEndTime
        );
        const endTime = formatDateToTime(
          node.step.phasing.PhasingProgramRun_phasingEndTime
        );
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
        value: node.step.phasing.PhasingProgramRun_phasingPrograms,
        key: 'program',
      },
      {
        label: 'Time',
        value: getTimeValue(),
        key: 'time',
      },
      {
        label: 'Resolution',
        value: `${node.step.phasing.PhasingStep_highRes}Å - ${node.step.phasing.PhasingStep_lowRes}Å`,
        key: 'resolution',
      },
      {
        label: 'Enantiomorph',
        value: node.step.phasing.PhasingStep_enantiomorph,
        key: 'enantiomorph',
      },
      {
        label: 'Solvent',
        value: node.step.phasing.PhasingStep_solventContent,
        key: 'solvent',
      },
      ...(node.step.phasing.statisticsValue && node.step.phasing.metric
        ? _(node.step.phasing.metric.split(', '))
            .zip(node.step.phasing.statisticsValue.split(', '))
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
    <Col xs={'auto'}>
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
                    alt={'phasing attachment'}
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
  node: PhasingTreeNode;
  parent?: PhasingTreeNode;
  proposalName: string;
  selected: PhasingTreeNode | undefined;
  onSelect: (p: PhasingTreeNode) => void;
}) {
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
        {node.step.phasing.PhasingStep_phasingStepType}
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
      placement="auto"
      overlay={overlay}
    >
      <div
        style={{
          border: !node.success
            ? '2px solid red'
            : node.step.molecules.length
            ? '2px solid green'
            : '1px solid blue',
          borderRadius: 5,
          width: 'auto',
          padding: 5,
          display: 'inline-block',
          backgroundColor:
            selected?.step.phasing.PhasingStep_phasingStepId ===
            node.step.phasing.PhasingStep_phasingStepId
              ? 'lightblue'
              : node.isBest
              ? 'lightgreen'
              : 'white',
          cursor: 'pointer',
        }}
        onClick={() => onSelect(node)}
      >
        <Col>
          <Row>
            <small>
              <strong>
                {capitalizeName(
                  mapName(node.step.phasing.PhasingStep_phasingStepType)
                )}
              </strong>
            </small>
          </Row>
          {node.isBest && (
            <Row style={{ margin: 0, marginTop: 2 }}>
              <Col style={{ padding: 0 }}>
                <Badge bg={'success'} style={{ margin: 0 }}>
                  BEST
                </Badge>
              </Col>
              <HelpIconCol
                message={[
                  `This is the best ${node.step.phasing.PhasingStep_method} phasing for this data collection group.`,
                  ...PHASING_RANKING_METHOD_DESCRIPTION,
                ]}
              />
            </Row>
          )}
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
          {node.step.molecules.map((m) => (
            <Row style={{ margin: 0 }} key={m.pdb}>
              <Badge style={{ margin: 0, marginTop: 5 }}>{m.displayType}</Badge>
            </Row>
          ))}
          <PhasingStepImages
            proposalName={proposalName}
            ids={node.step.phasing.png}
            names={node.step.phasing.fileType}
          />
        </Col>
      </div>
    </OverlayTrigger>
  );
}
