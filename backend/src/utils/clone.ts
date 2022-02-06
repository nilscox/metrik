import _ from 'lodash';

// export const clone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));
export const clone = _.cloneDeep;
