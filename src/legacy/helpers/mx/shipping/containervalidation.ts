import _ from 'lodash';
import { ProposalSample } from 'legacy/pages/model';
import { ShippingContainer } from 'legacy/pages/shipping/model';

/**
 *
 * @param containers containers to validate (from the same)
 * @returns list of error messages. Empty if all okay.
 */
export function validateContainers(
  containers: ShippingContainer[],
  proposalSamples: ProposalSample[]
) {
  const errors: string[] = [];

  for (const container of containers) {
    for (const sample of container.sampleVOs.filter(
      (s) => s !== undefined && s !== null
    )) {
      if (
        sample.location === undefined ||
        sample.location === null ||
        sample.location === ''
      ) {
        errors.push(`A sample has no location.`);
      }
      if (
        sample.name === undefined ||
        sample.name === null ||
        sample.name === ''
      ) {
        errors.push(`Sample in position ${sample.location} is not named.`);
      }
      if (sample.name && sample.name.match(/[^a-zA-Z0-9_-]/)) {
        const invalids = [...sample.name.matchAll(/[^a-zA-Z0-9_-]/g)];
        if (invalids.length > 1) {
          errors.push(
            `Sample named '${sample.name}' in position ${
              sample.location
            } has invalid characters '${invalids.join(',')}'.`
          );
        } else {
          errors.push(
            `Sample named '${sample.name}' in position ${sample.location} has invalid character '${invalids[0]}'.`
          );
        }
      }
      if (sample.crystalVO === undefined) {
        errors.push(`Sample in position ${sample.location} has no crystal.`);
      }
      if (
        sample.crystalVO?.proteinVO === undefined ||
        sample.crystalVO?.proteinVO === null ||
        sample.crystalVO?.proteinVO?.acronym === undefined ||
        sample.crystalVO?.proteinVO?.acronym === null ||
        sample.crystalVO?.proteinVO?.acronym === ''
      ) {
        errors.push(`Sample in position ${sample.location} has no protein.`);
      }
    }
  }

  const getSampleKey = (protein?: string, name?: string) => {
    return `protein=${protein}+name=${name}`;
  };

  const sampleKeys = containers
    .flatMap((c) => c.sampleVOs)
    .map((sample) =>
      getSampleKey(sample.crystalVO?.proteinVO.acronym, sample.name)
    );
  const duplicates = _(sampleKeys)
    .filter((key, index) => sampleKeys.indexOf(key) !== index)
    .uniq()
    .value();
  if (duplicates.length === 1) {
    errors.push(`non-unique sample key: ${duplicates[0]} `);
  } else if (duplicates.length > 1) {
    errors.push(`non-unique sample keys: ${duplicates.join(', ')} `);
  }

  const containerIds = containers.map((c) => c.containerId);
  const proposalSampleKeys = proposalSamples
    .filter((s) => !containerIds.includes(s.Container_containerId))
    .map((s) => getSampleKey(s.Protein_acronym, s.BLSample_name));

  const proposalDuplicates = _(proposalSampleKeys)
    .filter((key) => sampleKeys.includes(key))
    .uniq()
    .value();

  if (proposalDuplicates.length === 1) {
    errors.push(`non-unique sample key in proposal: ${proposalDuplicates[0]} `);
  } else if (proposalDuplicates.length > 1) {
    errors.push(
      `non-unique sample keys in proposal: ${proposalDuplicates.join(', ')} `
    );
  }
  return errors;
}
