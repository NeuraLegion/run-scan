export enum Discovery {
  ARCHIVE = 'archive',
  CRAWLER = 'crawler',
  GRAPHQL = 'graphql',
  OAS = 'oas'
}

export const validateDiscovery = (discoveryTypes: Discovery[] = []) => {
  if (discoveryTypes.some((x: Discovery) => !isValidDiscovery(x))) {
    throw new Error('Unknown discovery type supplied.');
  }

  const uniqueDiscoveryTypes = new Set<Discovery>(discoveryTypes);

  if (uniqueDiscoveryTypes.size !== discoveryTypes.length) {
    throw new Error('Discovery contains duplicate values.');
  }

  if (uniqueDiscoveryTypes.size !== 1) {
    disallowDiscoveryCombination(uniqueDiscoveryTypes);
  }
};

const isValidDiscovery = (x: Discovery) => Object.values(Discovery).includes(x);

const disallowDiscoveryCombination = (discoveryTypes: Set<Discovery>): void => {
  const disallowedCombinations = getDisallowedDiscoveryCombination([
    ...discoveryTypes
  ]);

  if (disallowedCombinations.length) {
    const [firstInvalidCombination]: [Discovery, readonly Discovery[]][] =
      disallowedCombinations;

    throw new Error(
      `The discovery list cannot include both ${
        firstInvalidCombination[0]
      } and any of ${firstInvalidCombination[1].join(', ')} simultaneously.`
    );
  }
};

const disallowedDiscoveryCombinations = new Map([
  [Discovery.OAS, [Discovery.CRAWLER, Discovery.ARCHIVE]]
]);

const getDisallowedDiscoveryCombination = (discoveryTypes: Discovery[]) =>
  [...disallowedDiscoveryCombinations].filter(
    ([x]: [Discovery, readonly Discovery[]]) => discoveryTypes.includes(x)
  );
