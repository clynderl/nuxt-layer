export default defineNuxtPlugin(() => {
  const {$mitt} = useNuxtApp();
  const modal = {
    open(comp: object, data?: object): void {
      $mitt.emit('modal:open', {comp, data});
    },
    close: () => $mitt.emit('modal:close'),
  };

  return {
    provide: {
      modal,
    },
  };
});
