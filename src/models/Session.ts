import { Entity } from '@rest-hooks/rest';
import { SingletonEntity } from 'api/resources/Base/Singleton';

/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Sessionid = number;
export type Proposalid = number;
export type Session1 = string;
export type Proposal = string;
export type Beamlinesetupid = number;
export type Synchrotronmode = string;
export type Undulatortype1 = string;
export type Undulatortype2 = string;
export type Undulatortype3 = string;
export type Focalspotsizeatsample = number;
export type Focusingoptic = string;
export type Beamdivergencehorizontal = number;
export type Beamdivergencevertical = number;
export type Polarisation = number;
export type Monochromatortype = string;
export type Setupdate = string;
export type Synchrotronname = string;
export type Maxexptimeperdatacollection = number;
export type Minexposuretimeperimage = number;
export type Goniostatmaxoscillationspeed = number;
export type Goniostatminoscillationwidth = number;
export type Mintransmission = number;
export type Cs = number;
export type VisitNumber = number;
export type Startdate = string;
export type Enddate = string;
export type Beamlinename = string;
export type Beamlineoperator = string;
export type Scheduled = boolean;
export type Comments = string;
export type Nbreimbdewars = number;
/**
 * Number of datacollections
 */
export type Datacollections = number;
/**
 * UI groups for this session
 */
export type Uigroups = string[];
/**
 * Number of people registered on this session (via SessionHasPerson)
 */
export type Persons = number;
/**
 * Whether this session is active
 */
export type Active = boolean;
/**
 * Whether this session is due to start soon or has ended recently (+/-20 min)
 */
export type ActiveSoon = boolean;
/**
 * Session types for this session
 */
export type Sessiontypes = string[];

export interface Session {
  sessionId: Sessionid;
  proposalId: Proposalid;
  session: Session1;
  proposal: Proposal;
  BeamLineSetup?: BeamLineSetup;
  visit_number?: VisitNumber;
  startDate: Startdate;
  endDate: Enddate;
  beamLineName: Beamlinename;
  beamLineOperator?: Beamlineoperator;
  scheduled?: Scheduled;
  comments?: Comments;
  nbReimbDewars?: Nbreimbdewars;
  _metadata: SessionMetaData;
}
export interface BeamLineSetup {
  beamLineSetupId: Beamlinesetupid;
  synchrotronMode?: Synchrotronmode;
  undulatorType1?: Undulatortype1;
  undulatorType2?: Undulatortype2;
  undulatorType3?: Undulatortype3;
  focalSpotSizeAtSample?: Focalspotsizeatsample;
  focusingOptic?: Focusingoptic;
  beamDivergenceHorizontal?: Beamdivergencehorizontal;
  beamDivergenceVertical?: Beamdivergencevertical;
  polarisation?: Polarisation;
  monochromatorType?: Monochromatortype;
  setupDate?: Setupdate;
  synchrotronName?: Synchrotronname;
  maxExpTimePerDataCollection?: Maxexptimeperdatacollection;
  minExposureTimePerImage?: Minexposuretimeperimage;
  goniostatMaxOscillationSpeed?: Goniostatmaxoscillationspeed;
  goniostatMinOscillationWidth?: Goniostatminoscillationwidth;
  minTransmission?: Mintransmission;
  CS?: Cs;
}
export interface SessionMetaData {
  datacollections?: Datacollections;
  uiGroups?: Uigroups;
  persons: Persons;
  active: Active;
  active_soon: ActiveSoon;
  sessionTypes: Sessiontypes;
}


export abstract class SessionBase extends Entity {
  sessionId: Sessionid;
  proposalId: Proposalid;
  session: Session1;
  proposal: Proposal;
  BeamLineSetup?: BeamLineSetup;
  visit_number?: VisitNumber;
  startDate: Startdate;
  endDate: Enddate;
  beamLineName: Beamlinename;
  beamLineOperator?: Beamlineoperator;
  scheduled?: Scheduled;
  comments?: Comments;
  nbReimbDewars?: Nbreimbdewars;
  _metadata: SessionMetaData;
}

export abstract class SessionSingletonBase extends SingletonEntity {
  sessionId: Sessionid;
  proposalId: Proposalid;
  session: Session1;
  proposal: Proposal;
  BeamLineSetup?: BeamLineSetup;
  visit_number?: VisitNumber;
  startDate: Startdate;
  endDate: Enddate;
  beamLineName: Beamlinename;
  beamLineOperator?: Beamlineoperator;
  scheduled?: Scheduled;
  comments?: Comments;
  nbReimbDewars?: Nbreimbdewars;
  _metadata: SessionMetaData;
}

export abstract class BeamLineSetupBase extends Entity {
  beamLineSetupId: Beamlinesetupid;
  synchrotronMode?: Synchrotronmode;
  undulatorType1?: Undulatortype1;
  undulatorType2?: Undulatortype2;
  undulatorType3?: Undulatortype3;
  focalSpotSizeAtSample?: Focalspotsizeatsample;
  focusingOptic?: Focusingoptic;
  beamDivergenceHorizontal?: Beamdivergencehorizontal;
  beamDivergenceVertical?: Beamdivergencevertical;
  polarisation?: Polarisation;
  monochromatorType?: Monochromatortype;
  setupDate?: Setupdate;
  synchrotronName?: Synchrotronname;
  maxExpTimePerDataCollection?: Maxexptimeperdatacollection;
  minExposureTimePerImage?: Minexposuretimeperimage;
  goniostatMaxOscillationSpeed?: Goniostatmaxoscillationspeed;
  goniostatMinOscillationWidth?: Goniostatminoscillationwidth;
  minTransmission?: Mintransmission;
  CS?: Cs;
}

export abstract class BeamLineSetupSingletonBase extends SingletonEntity {
  beamLineSetupId: Beamlinesetupid;
  synchrotronMode?: Synchrotronmode;
  undulatorType1?: Undulatortype1;
  undulatorType2?: Undulatortype2;
  undulatorType3?: Undulatortype3;
  focalSpotSizeAtSample?: Focalspotsizeatsample;
  focusingOptic?: Focusingoptic;
  beamDivergenceHorizontal?: Beamdivergencehorizontal;
  beamDivergenceVertical?: Beamdivergencevertical;
  polarisation?: Polarisation;
  monochromatorType?: Monochromatortype;
  setupDate?: Setupdate;
  synchrotronName?: Synchrotronname;
  maxExpTimePerDataCollection?: Maxexptimeperdatacollection;
  minExposureTimePerImage?: Minexposuretimeperimage;
  goniostatMaxOscillationSpeed?: Goniostatmaxoscillationspeed;
  goniostatMinOscillationWidth?: Goniostatminoscillationwidth;
  minTransmission?: Mintransmission;
  CS?: Cs;
}

export abstract class SessionMetaDataBase extends Entity {
  datacollections?: Datacollections;
  uiGroups?: Uigroups;
  persons: Persons;
  active: Active;
  active_soon: ActiveSoon;
  sessionTypes: Sessiontypes;
}

export abstract class SessionMetaDataSingletonBase extends SingletonEntity {
  datacollections?: Datacollections;
  uiGroups?: Uigroups;
  persons: Persons;
  active: Active;
  active_soon: ActiveSoon;
  sessionTypes: Sessiontypes;
}

