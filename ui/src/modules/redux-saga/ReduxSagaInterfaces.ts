import { TypedObject } from '../../utils/GeneralUtils';

export enum SagaEffect {
  CALL = 'CALL',
  PUT = 'PUT',
  SELECT = 'SELECT',
  TAKE = 'TAKE',
}

export type Store = TypedObject<any>;

export type Saga = () => Iterator<any>;

export interface CallEffect<T = any> {
  effect: SagaEffect.CALL;
  func: (...args: any[]) => any;
  payload: T;
}

export interface TakeEffect {
  effect: SagaEffect.TAKE;
  type: string | symbol;
}

export type ReduxSagaEffects = CallEffect | TakeEffect;

export interface SagaEffectResult {
  nextResult: IteratorResult<ReduxSagaEffects>;
  shouldPause: boolean;
}
export type RunReduxSagaDynamicallyHandler = (saga: Saga) => void;
