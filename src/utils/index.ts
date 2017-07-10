import R    from 'ramda';
import util from 'util';

export const debug = val => {
  if (val instanceof Object) {
    return util.inspect(
        R.omit([ 'client'
               , 'connection'
               , 'socket'
               , 'request'
               , 'ReadableState'
               , 'req'], val)
      , { depth: null, colors: true}
    );
  } else {
    return util.inspect(val, { depth: null, colors: true});
  }
};

export const isProdEnv = process.env.NODE_ENV === 'production';
export const isDevEnv  = process.env.NODE_ENV !== 'production';
