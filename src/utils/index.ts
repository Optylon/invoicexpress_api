import util from 'util';

export const debug = val => util.inspect(val, { depth: null, colors: true});

export const isProdEnv = process.env.NODE_ENV === 'production';
export const isDevEnv  = process.env.NODE_ENV !== 'production';
