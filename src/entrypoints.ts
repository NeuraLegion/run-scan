export enum EntryPointStatus {
  NEW = 'new',
  CHANGED = 'changed',
  TESTED = 'tested',
  VULNERABLE = 'vulnerable'
}

const isValidStatus = (status: EntryPointStatus) =>
  Object.values(EntryPointStatus).includes(status);

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
