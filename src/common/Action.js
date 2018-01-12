
export const _actions = {};

export function create(name, callback) {
  const action = {
    name,
    defaultCallback: callback || null,
    instances: {},
  };

  // If it already exists, then throw an exception
  if ( _actions[name] ) {
    throw new Error(`Action ${name} already exists! Pick a different name`);
  }
  _actions[name] = action;

  return action;
}

export function get(name) {
  if ( ! _actions[name] ) {
    throw new Error(`No action named ${name}!`);
  }
  return _actions[name];
}

export function subscribe(instance, actionName, callback ) {
  const action = get(actionName);
  action.instances[instance] = callback;
}

export function unsubscribe(instance, actionName) {
  const action = get(actionName);
  if( action.instances[instance] ) {
    action.instances[instance] = null;
  }
}

export function fire(actionName, data) {
  const action = get(actionName);
  // Simplest case: data is already good to go, and we dont have a defaultCallback
  // that can transform the data before the listeners
  let resultingData = Promise.resolve(data);
  if( action.defaultCallback ) {
    const defaultData = action.defaultCallback(data);
    // if we were handed something
    if( defaultData ) {
      if( typeof defaultData.then === 'function' ) {
        // If it's a promise, then it's all good in the hood
        resultingData = defaultData;
      }
      else {
        // Otherwise, we need to wrap it up in a promise
        resultingData = Promise.resolve(defaultData);
      }
    }
  }
  return resultingData.then( modifiedData => {
    Object.keys(action.instances).forEach( instance => {
      if( action.instances[instance] ) {
        action.instances[instance](modifiedData);
      }
    });
  });
}

export function unsubscribeAll(instance) {
  Object.keys(_actions).forEach( actionName => {
    const action = get(actionName);
    unsubscribe(instance, actionName);
  });
}