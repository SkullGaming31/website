declare const Twitch: {
  Embed: {
    new (targetID: string, options?: {
      width?: number;
      height?: number;
      channel?: string;
      layout?: string;
      autoplay?: boolean;
      parent?: string[];
    }): any;
    VIDEO_READY: string;
  }
};
