import {expectType} from 'tsd-check';
import randelay from '.';

expectType<void>(await randelay(200));

expectType<string>(await randelay(200, {value: '🦄'}));
expectType<number>(await randelay(200, {value: 0}));

expectType<never>(await randelay.reject(200, {value: '🦄'}));
expectType<never>(await randelay.reject(200, {value: 0}));

const customRandelay = randelay.createWithTimers({clearTimeout, setTimeout})
expectType<void>(await customRandelay(200));

expectType<string>(await customRandelay(200, {value: '🦄'}));
expectType<number>(await customRandelay(200, {value: 0}));

expectType<never>(await customRandelay.reject(200, {value: '🦄'}));
expectType<never>(await customRandelay.reject(200, {value: 0}));
