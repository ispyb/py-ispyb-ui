/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Number of people registered on this proposal (via ProposalHasPerson)
 */
export type Persons = number;
/**
 * Number of sessions
 */
export type Sessions = number;
/**
 * Beamlines allocated in this proposal
 */
export type Beamlines = string[];
/**
 * UI groups allocated in this proposal
 */
export type Uigroups = string[];

export interface ProposalMetaData {
  persons: Persons;
  sessions: Sessions;
  beamLines: Beamlines;
  uiGroups?: Uigroups;
}

type Constructor<T = {}> = new (...args: any[]) => T;
export function withProposalMetaData<TBase extends Constructor>(Base: TBase) {
  return class WithProposalMetaData extends Base {
    persons: Persons;
    sessions: Sessions;
    beamLines: Beamlines;
    uiGroups?: Uigroups;
  }
}