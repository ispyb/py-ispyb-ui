import _ from 'lodash';
import { ShippingContainer } from 'pages/shipping/model';

/**
 *
 * @param containers containers to validate (from the same)
 * @returns list of error messages. Empty if all okay.
 */
export function validateContainers(containers: ShippingContainer[]) {
  const errors: string[] = [];

  for (const container of containers) {
    for (const sample of container.sampleVOs.filter((s) => s != undefined && s != null)) {
      if (sample.location == undefined || sample.location == null || sample.location == '') {
        errors.push(`A sample has no location.`);
      }
      if (sample.name == undefined || sample.name == null || sample.name == '') {
        errors.push(`Sample in position ${sample.location} is not named.`);
      }
      if (sample.crystalVO == undefined || sample.name == null) {
        errors.push(`Sample in position ${sample.location} has no crystal.`);
      }
      if (
        sample.crystalVO?.proteinVO == undefined ||
        sample.crystalVO?.proteinVO == null ||
        sample.crystalVO?.proteinVO?.acronym == undefined ||
        sample.crystalVO?.proteinVO?.acronym == null ||
        sample.crystalVO?.proteinVO?.acronym == ''
      ) {
        errors.push(`Sample in position ${sample.location} has no protein.`);
      }
    }
  }

  const sampleKeys = containers.flatMap((c) => c.sampleVOs).map((sample) => `protein=${sample.crystalVO.proteinVO.acronym}+name=${sample.name}`);

  const duplicates = _(sampleKeys)
    .filter((key, index) => sampleKeys.indexOf(key) != index)
    .uniq()
    .value();
  if (duplicates.length == 1) {
    errors.push(`non-unique sample key: ${duplicates[0]} `);
  } else if (duplicates.length > 1) {
    errors.push(`non-unique sample keys: ${duplicates.join(', ')} `);
  }

  return errors;
}
