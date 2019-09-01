import { AnyAction, Dispatch } from 'redux';

import {
  CallEffect,
  ReduxSagaEffects,
  RunReduxSagaDynamicallyHandler,
  Saga,
  SagaEffect,
  SagaEffectResult,
  Store,
  TakeEffect,
} from './ReduxSagaInterfaces';

export default function createReduxSagaMiddleware() {
  let waiting: any;

  const handlePromiseCall = (
    store: Store,
    iterator: Iterator<ReduxSagaEffects>,
    promise: Promise<SagaEffectResult>,
  ) => {
    return promise
      .then((result: SagaEffectResult) => runIterator(store, iterator, iterator.next(result)))
      .catch((error)  => runIterator(store, iterator, iterator.throw(error)));
  };

  const handleCallEffect = (
    store: Store,
    iterator: Iterator<ReduxSagaEffects>,
    next: IteratorResult<CallEffect>,
  ): SagaEffectResult => {
    let result = null;
    try {
      result = next.value.func(next.value.payload);
    } catch (error) {
      return {
        shouldPause: false,
        nextResult: iterator.throw(error),
      };
    }
    if (!(result instanceof Promise)) {
      return {
        nextResult: iterator.next(result),
        shouldPause: false,
      };
    }
    handlePromiseCall(store, iterator, result);
    return {
      nextResult: null,
      shouldPause: true,
    };
  };

  const handleTakeEffect = (
    store: Store,
    iterator: Iterator<ReduxSagaEffects>,
    next: IteratorResult<TakeEffect>,
  ): SagaEffectResult => {
    waiting = Object.assign(next.value, { iterator });
    return {
      nextResult: null,
      shouldPause: true,
    };
  };

  const handleEffect = (store: Store, iterator: Iterator<ReduxSagaEffects>, next: IteratorResult<ReduxSagaEffects>) => {
    const { value: { effect } } = next;
    if (effect === SagaEffect.CALL) {
      return handleCallEffect(store, iterator, next as IteratorResult<CallEffect>);
    }
    if (effect === SagaEffect.TAKE) {
      return handleTakeEffect(store, iterator, next as IteratorResult<TakeEffect>);
    }
    return {
      shouldPause: false,
      nextResult: iterator.next(),
    };
  };

  function runIterator(
    store: Store,
    iterator: Iterator<ReduxSagaEffects>,
    startNext: IteratorResult<ReduxSagaEffects>,
  ) {
    let next = startNext;
    while (!next.done) {
      if (!next.value || !next.value.effect) {
        next = iterator.next();
        continue;
      }
      const { shouldPause, nextResult } = handleEffect(store, iterator, next);
      if (shouldPause) {
        break;
      }
      next = nextResult;
    }
  }

  const handleAction = (store: Store, action: AnyAction) => {
    if (action.type !== waiting.type) {
      return;
    }
    runIterator(store, waiting.iterator, waiting.iterator.next(action));
  };

  const runSagaFactory = (store: Store) => (saga: Saga) => {
    const iterator = saga();
    runIterator(store, iterator, iterator.next());
  };

  let runReduxSagaDynamically: RunReduxSagaDynamicallyHandler;
  function sagaMiddleware(store: Store) {
    runReduxSagaDynamically = runSagaFactory(store);
    return (next: Dispatch) => {
      return (action: AnyAction) => {
        const result = next(action);
        handleAction(store, action);
        return result;
      };
    };
  }
  sagaMiddleware.run = (saga: Saga) => {
    if (!runReduxSagaDynamically) {
      throw new Error('Before running a saga, you must mount the saga middleware on the store');
    }
    return runReduxSagaDynamically(saga);
  };
  return sagaMiddleware;
}
