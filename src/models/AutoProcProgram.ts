import { Entity } from '@rest-hooks/rest';
import { SingletonEntity } from 'api/resources/Base/Singleton';

/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Autoprocprogramid = number;
export type Processingcommandline = string;
export type Processingprograms = string;
/**
 * An enumeration.
 */
export type StatusEnum = null | 0 | 1 | 2;
export type Processingmessage = string;
export type Processingstarttime = string;
export type Processingendtime = string;
export type Processingenvironment = string;
export type Recordtimestamp = string;
export type Processingjobid = number;
export type Displayname = string;
export type Comments = string;
export type Recordtimestamp1 = string;
export type Recipe = string;
export type Automatic = boolean;
export type Parameterkey = string;
export type Parametervalue = string;
export type Processingjobparameters = ProcessingJobParameter[];
/**
 * Number of attachments
 */
export type Attachments = number;
export type Autoprocprogrammessageid = number;
export type Autoprocprogramid1 = number;
export type Description = string;
export type Message = string;
/**
 * An enumeration.
 */
export type AutoProcProgramMessageSeverity = "ERROR" | "WARNING" | "INFO";
export type Recordtimestamp2 = string;
export type Autoprocprogrammessages = AutoProcProgramMessage[];
export type Imagesweepcount = number;

export interface AutoProcProgram {
  autoProcProgramId: Autoprocprogramid;
  processingCommandLine?: Processingcommandline;
  processingPrograms?: Processingprograms;
  processingStatus?: StatusEnum;
  processingMessage?: Processingmessage;
  processingStartTime?: Processingstarttime;
  processingEndTime?: Processingendtime;
  processingEnvironment?: Processingenvironment;
  recordTimeStamp: Recordtimestamp;
  ProcessingJob?: ProcessingJob;
  _metadata: AutoProcProgramMetadata;
}
export interface ProcessingJob {
  processingJobId: Processingjobid;
  displayName?: Displayname;
  comments?: Comments;
  recordTimestamp: Recordtimestamp1;
  recipe?: Recipe;
  automatic: Automatic;
  ProcessingJobParameters?: Processingjobparameters;
}
export interface ProcessingJobParameter {
  parameterKey: Parameterkey;
  parameterValue: Parametervalue;
}
export interface AutoProcProgramMetadata {
  attachments?: Attachments;
  autoProcProgramMessages?: Autoprocprogrammessages;
  imageSweepCount?: Imagesweepcount;
}
export interface AutoProcProgramMessage {
  autoProcProgramMessageId: Autoprocprogrammessageid;
  autoProcProgramId: Autoprocprogramid1;
  description: Description;
  message: Message;
  severity: AutoProcProgramMessageSeverity;
  recordTimeStamp: Recordtimestamp2;
}


export abstract class AutoProcProgramBase extends Entity {
  autoProcProgramId: Autoprocprogramid;
  processingCommandLine?: Processingcommandline;
  processingPrograms?: Processingprograms;
  processingStatus?: StatusEnum;
  processingMessage?: Processingmessage;
  processingStartTime?: Processingstarttime;
  processingEndTime?: Processingendtime;
  processingEnvironment?: Processingenvironment;
  recordTimeStamp: Recordtimestamp;
  ProcessingJob?: ProcessingJob;
  _metadata: AutoProcProgramMetadata;
}

export abstract class AutoProcProgramSingletonBase extends SingletonEntity {
  autoProcProgramId: Autoprocprogramid;
  processingCommandLine?: Processingcommandline;
  processingPrograms?: Processingprograms;
  processingStatus?: StatusEnum;
  processingMessage?: Processingmessage;
  processingStartTime?: Processingstarttime;
  processingEndTime?: Processingendtime;
  processingEnvironment?: Processingenvironment;
  recordTimeStamp: Recordtimestamp;
  ProcessingJob?: ProcessingJob;
  _metadata: AutoProcProgramMetadata;
}

export abstract class ProcessingJobBase extends Entity {
  processingJobId: Processingjobid;
  displayName?: Displayname;
  comments?: Comments;
  recordTimestamp: Recordtimestamp1;
  recipe?: Recipe;
  automatic: Automatic;
  ProcessingJobParameters?: Processingjobparameters;
}

export abstract class ProcessingJobSingletonBase extends SingletonEntity {
  processingJobId: Processingjobid;
  displayName?: Displayname;
  comments?: Comments;
  recordTimestamp: Recordtimestamp1;
  recipe?: Recipe;
  automatic: Automatic;
  ProcessingJobParameters?: Processingjobparameters;
}

export abstract class ProcessingJobParameterBase extends Entity {
  parameterKey: Parameterkey;
  parameterValue: Parametervalue;
}

export abstract class ProcessingJobParameterSingletonBase extends SingletonEntity {
  parameterKey: Parameterkey;
  parameterValue: Parametervalue;
}

export abstract class AutoProcProgramMetadataBase extends Entity {
  attachments?: Attachments;
  autoProcProgramMessages?: Autoprocprogrammessages;
  imageSweepCount?: Imagesweepcount;
}

export abstract class AutoProcProgramMetadataSingletonBase extends SingletonEntity {
  attachments?: Attachments;
  autoProcProgramMessages?: Autoprocprogrammessages;
  imageSweepCount?: Imagesweepcount;
}

export abstract class AutoProcProgramMessageBase extends Entity {
  autoProcProgramMessageId: Autoprocprogrammessageid;
  autoProcProgramId: Autoprocprogramid1;
  description: Description;
  message: Message;
  severity: AutoProcProgramMessageSeverity;
  recordTimeStamp: Recordtimestamp2;
}

export abstract class AutoProcProgramMessageSingletonBase extends SingletonEntity {
  autoProcProgramMessageId: Autoprocprogrammessageid;
  autoProcProgramId: Autoprocprogramid1;
  description: Description;
  message: Message;
  severity: AutoProcProgramMessageSeverity;
  recordTimeStamp: Recordtimestamp2;
}

