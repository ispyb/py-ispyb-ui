import { BaseEditorComponent, HotEditorProps } from '@handsontable/react';
import Handsontable from 'handsontable';
import _ from 'lodash';
import { Crystal, Protein } from 'pages/model';
import React, { MouseEvent } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import Select from 'react-select';
import { getCrystalInfo, parseCrystalInfo } from './containertotabledata';
import { EditCrystalModal } from './crystaleditmodal';

type PropsType = {
  data: (string | number | undefined)[][];
  crystals: Crystal[];
  proteins: Protein[];
};

export class CrystalEditor extends BaseEditorComponent<PropsType> {
  data: (string | number | undefined)[][];
  crystals: Crystal[];
  proteins: Protein[];

  constructor(props: HotEditorProps & PropsType) {
    super(props);
    this.data = props.data;
    this.crystals = props.crystals;
    this.proteins = props.proteins;

    this.state = {
      value: undefined,
      display: 'none',
      left: '0px',
      top: '0px',
      showModal: false,
    };
  }

  stopMousedownPropagation(e: MouseEvent) {
    e.stopPropagation();
  }

  setValue(value: string, callback: (() => void) | undefined) {
    this.setState(() => {
      return { value: value };
    }, callback);
  }

  getValue() {
    return this.state.value;
  }

  open() {
    this.setState({ display: 'block' });
  }

  close() {
    if (!this.state.showModal) {
      //   this.setState({
      //     display: 'none',
      //     value: undefined,
      //     showModal: false,
      //   });
    }
  }

  prepare(row: any, col: any, prop: any, td: { getBoundingClientRect: () => any }, originalValue: any, cellProperties: any) {
    super.prepare(row, col, prop, td, originalValue, cellProperties);

    const tdPosition = td.getBoundingClientRect();

    this.setState({
      left: tdPosition.left + 'px',
      top: tdPosition.top + 'px',
    });
  }

  getCystals() {
    const protein = this.data[this.row][1];
    if (protein) {
      return _.uniq([
        ..._(this.crystals)
          .filter((c) => c.proteinVO.acronym == protein)
          .map(getCrystalInfo)
          .uniq()
          .sort()
          .value(),
      ]);
    }
    return [];
  }

  render() {
    const style: React.CSSProperties = {
      display: this.state.display,
      position: 'absolute',
      zIndex: 999,
      background: '#fff',
      border: '1px solid #cecece',

      top: this.state.top,
      left: this.state.left,
    };
    if (this.col != null && this.row != null && this.state.value != undefined && this.data[this.row][1] != undefined) {
      const d = [this.data[this.row][0], this.data[this.row][1], undefined, undefined, this.state.value];
      const crystal: Crystal = parseCrystalInfo(d, this.crystals, this.proteins);

      return (
        <div style={style} onMouseDown={this.stopMousedownPropagation} onClick={this.stopMousedownPropagation}>
          <Container style={{ padding: 15, width: 500 }}>
            <Col>
              <Row>
                <Select
                  value={{ label: this.state.value, value: this.state.value }}
                  options={this.getCystals().map((c) => {
                    return { label: c, value: c };
                  })}
                  onChange={(v) => this.setValue(v?.value, undefined)}
                ></Select>
              </Row>
              <Row style={{ marginTop: 10 }}>
                <Col></Col>
                <Col md={'auto'}>
                  <Button>New...</Button>
                </Col>
                <Col md={'auto'}>
                  <Button
                    onClick={() => {
                      this.setState({ showModal: true });
                    }}
                  >
                    Edit selected...
                  </Button>
                </Col>
                <Col md={'auto'}>
                  <Button onClick={() => this.finishEditing()}>Apply</Button>
                </Col>
              </Row>
            </Col>
          </Container>
          {this.state.showModal ? (
            <EditCrystalModal
              crystal={crystal}
              show={this.state.showModal}
              setShow={(show) => {
                this.setState({ showModal: show });
              }}
            ></EditCrystalModal>
          ) : undefined}
        </div>
      );
    } else {
      return (
        <div style={style}>
          <small>Please select protein first.</small>
        </div>
      );
    }
  }
}
