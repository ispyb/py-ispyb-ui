import { Session } from 'legacy/pages/model';

export function allSessionsEmpty(sessions?: Session[]) {
  if (sessions) {
    for (const session of sessions) {
      if (!sessionIsEmpty(session)) {
        return false;
      }
    }
    return true;
  }
  return true;
}

export function sessionIsEmpty(session: Session) {
  return !hasAny([
    session.energyScanCount,
    session.xrfSpectrumCount,
    session.sampleCount,
    session.testDataCollectionGroupCount,
    session.dataCollectionGroupCount,
    session.calibrationCount,
    session.sampleChangerCount,
    session.hplcCount,
    session.EMdataCollectionGroupCount,
  ]);
}

function hasAny(properties: number[]) {
  for (const p of properties) {
    if (has(p)) {
      return true;
    }
  }
  return false;
}

function has(p: number) {
  return !isNaN(p) && p > 0;
}
