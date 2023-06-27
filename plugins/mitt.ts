import mitt from 'mitt';

const emitter = mitt();
export default defineNuxtPlugin(() => {
  return {
    provide: {
      mitt: {
        on: emitter.on,
        emit: emitter.emit,
        off: emitter.off,
      },
    },
  };
});

