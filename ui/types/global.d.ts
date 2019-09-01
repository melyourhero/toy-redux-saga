/** Global definitions for development **/
// for style loader
declare module '*.scss' {
  const styles: any;
  export default styles;
}

declare module '*.png' {
  const url: string;
  export default url;
}

declare module '*.svg' {
  const url: string;
  export default url;
}

declare module '*.json' {
  const json: any;
  export default json;
}

declare const lgm: any;

declare const __DEV__: boolean;

interface Window {
  devToolsExtension: any;
}
