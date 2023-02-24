export type Investigation = {
  id: number;
  createId: string;
  createTime: string;
  modId: string;
  modTime: string;
  datasets: undefined[];
  doi: string;
  endDate: string;
  investigationGroups: undefined[];
  investigationInstruments: [
    {
      id: number;
      createId: string;
      createTime: string;
      modId: string;
      modTime: string;
      instrument: {
        id: number;
        createId: string;
        createTime: string;
        modId: string;
        modTime: string;
        description: string;
        fullName: string;
        instrumentScientists: undefined[];
        investigationInstruments: undefined[];
        name: string;
        type: string;
      };
    }
  ];
  investigationUsers: undefined[];
  keywords: undefined[];
  name: string;
  parameters: [
    {
      id: number;
      createId: string;
      createTime: string;
      modId: string;
      modTime: string;
      stringValue: string;
    }
  ];
  publications: undefined[];
  releaseDate: string;
  samples: undefined[];
  shifts: undefined[];
  startDate: string;
  studyInvestigations: undefined[];
  summary: string;
  title: string;
  visitId: string;
};

export type Dataset = {
  parameters: [
    {
      name: string;
      value: string;
    }
  ];
  investigation: Investigation;
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  sampleName: string;
  outputDatasets: Dataset[];
  type: string;
};

export function getDatasetParam(
  dataset: Dataset,
  name: string
): string | undefined {
  const param = dataset.parameters.find((p) => p.name === name);
  return param ? param.value : undefined;
}

export function getNotes<T>(dataset: Dataset): T {
  const res: { [key: string]: any } = {};
  dataset.parameters.forEach((p) => {
    if (p.name.startsWith('Notes_')) {
      const obj = JSON.parse(p.value);
      for (const key in obj) {
        res[key] = obj[key];
      }
    }
  });

  res['dataset'] = dataset;
  return res as T;
}
