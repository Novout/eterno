export * from 'vue-pubsub'

declare module 'vue-pubsub' {
  export interface Channels {
    'load-view-from-url': string
    'load-view-from-historic': null
    'load-view-from-start-browser': null
    'add-first-page': null
    'view-back-in-view': null
    'view-forward-in-view': null
    'download-started': null
    'download-finished': null
  }
}
