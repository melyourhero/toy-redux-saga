import {
  CallEffect,
  SagaEffect,
  TakeEffect,
} from './ReduxSagaInterfaces';

export const call = <Fn extends (...args: any[]) => any> (func: Fn, ...args: Parameters<Fn>): CallEffect => {
  return {
    effect: SagaEffect.CALL,
    func,
    payload: args,
  };
};

export const take = (type: string | symbol): TakeEffect => {
  return {
    effect: SagaEffect.TAKE,
    type,
  };
};
