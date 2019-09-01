import { TypedObject } from './GeneralUtils';

type Case = any;

type DefaultCase = Case;

type Cases = TypedObject<Case>;

export const switchCase = (cases: Cases) => {
  return (defaultCase: DefaultCase) => {
    return (caseName: string | symbol) => {
      const propertyName = caseName as unknown as string;
      return cases.hasOwnProperty(propertyName) ? cases[propertyName] : defaultCase;
    };
  };
};
