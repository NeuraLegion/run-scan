export enum EntryPointStatus {
  NEW = 'new',
  CHANGED = 'changed',
  TESTED = 'tested',
  VULNERABLE = 'vulnerable'
}

export enum Connectivity {
  OK = 'ok',
  PROBLEM = 'problem',
  UNAUTHORIZED = 'unauthorized',
  UNREACHABLE = 'unreachable'
}

const isValidStatus = (status: EntryPointStatus) =>
  Object.values(EntryPointStatus).includes(status);

const isValidConnectivity = (status: Connectivity) =>
  Object.values(Connectivity).includes(status);

export const validateEntryPointsStatuses = (
  statuses: EntryPointStatus[]
): void => {
  const invalidStatuses = statuses.filter(x => !isValidStatus(x));

  if (invalidStatuses.length) {
    throw new Error(
      `Invalid entrypoints_statuses value(s): ${invalidStatuses.join(
        ', '
      )}. Valid values are: ${Object.values(EntryPointStatus).join(', ')}`
    );
  }

  const uniqueStatuses = new Set<EntryPointStatus>(statuses);

  if (uniqueStatuses.size !== statuses.length) {
    throw new Error('Entrypoint statuses contain duplicate values.');
  }
};

export const validateConnectivityStatuses = (
  statuses: Connectivity[]
): void => {
  const invalidStatuses = statuses.filter(x => !isValidConnectivity(x));

  if (invalidStatuses.length) {
    throw new Error(
      `Invalid entrypoint_connectivity_statuses value(s): ${invalidStatuses.join(
        ', '
      )}. Valid values are: ${Object.values(Connectivity).join(', ')}`
    );
  }

  const uniqueStatuses = new Set<Connectivity>(statuses);

  if (uniqueStatuses.size !== statuses.length) {
    throw new Error(
      'Entrypoint connectivity statuses contain duplicate values.'
    );
  }
};
