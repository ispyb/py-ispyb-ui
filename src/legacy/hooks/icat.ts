import useSWR from 'swr';
import axios from 'axios';
import { getMXDataCollectionsBy } from 'legacy/api/ispyb';

import { useAuth } from 'hooks/useAuth';
import { Dataset, getDatasetParam } from './icatmodel';
import _ from 'lodash';

interface GetHookOption {
  autoRefresh: boolean;
}
const defaultOptions: GetHookOption = {
  autoRefresh: true,
};

// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-explicit-any
function useGet<T = any>(
  url: string,
  def: T,
  options: GetHookOption = defaultOptions,
  editData: (data: T) => T = (d) => d,
  suspense = true,
  prefix?: string
) {
  const { site, token, clearToken } = useAuth();
  const fetcher = (url: string) =>
    axios
      .get(url)
      .catch((e) => {
        clearToken();
      })
      .then((res) => res?.data);

  const fullUrl = prefix
    ? `${site.host}${site.apiPrefix}/${prefix}/${token}${url}`
    : `${site.host}${site.apiPrefix}/${token}${url}`;

  const { data, error, mutate } = useSWR<T>(fullUrl, fetcher, {
    suspense: suspense,
    revalidateIfStale: options.autoRefresh,
    revalidateOnFocus: options.autoRefresh,
    revalidateOnReconnect: options.autoRefresh,
  });
  return {
    data: data === undefined ? def : editData(data),
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export function useDatasetsBySession(
  { sessionId }: { sessionId: string },
  options?: GetHookOption
) {
  const req = getDatasetsBySession(sessionId);
  return useGet<Dataset[]>(
    req.url,
    [],
    options,
    undefined,
    undefined,
    req.prefix
  );
}

export function getDatasetsBySession(
  sessionId: string,
  type: string = 'acquisition'
) {
  return {
    url: `/dataset?sortby=startTime&sortOrder=-1&datasetType=${type}&investigationId=${sessionId}`,
    prefix: 'catalogue',
  };
}

function filterGroupingType(datasets: Dataset[], groupingType: string): any[] {
  const types = _(datasets)
    .map((ds) => getDatasetParam(ds, 'grouping'))
    .uniq()
    .value();
  return datasets.filter(
    (ds) => getDatasetParam(ds, 'grouping') === groupingType
  );
}

export function useSubDatasets(
  {
    dataset,
    type,
  }: {
    dataset: Dataset | Dataset[];
    type: 'autoprocintegration' | 'phasing' | 'datacollection' | 'workflow';
  },
  options?: GetHookOption
) {
  const outputDatasets =
    dataset instanceof Array
      ? dataset
          .map((d) => getDatasetParam(d, 'output_datasetIds'))
          .flatMap((v) => (v ? v.split(' ') : []))
          .join(',')
      : getDatasetParam(dataset, 'output_datasetIds')?.split(' ').join(',') ||
        '';
  const req = getSubDatasets(outputDatasets);
  return useGet<Dataset[]>(
    req.url,
    [],
    options,
    (set) => filterGroupingType(set, type),
    undefined,
    req.prefix
  );
}

export function getSubDatasets(datasetIds: string) {
  return {
    url: `/dataset?datasetIds=${datasetIds}`,
    prefix: 'catalogue',
  };
}

export function getIcatGalleryDownloadUrl(id: string) {
  return {
    url: `/file/download?resourceId=${id}`,
  };
}
