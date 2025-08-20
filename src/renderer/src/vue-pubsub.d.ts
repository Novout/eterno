export * from 'vue-pubsub';

declare module "vue-pubsub" {
  export interface Channels {
    'load-view-from-url': string;
  }
}
