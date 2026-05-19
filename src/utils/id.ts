let seed = 0;

export const createId = (prefix = 'node'): string => {
  seed += 1;
  return `${prefix}_${Date.now().toString(36)}_${seed.toString(36)}`;
};
