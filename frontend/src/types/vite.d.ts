declare module 'vite' {
  export interface UserConfig {
    // Basic options
    root?: string;
    base?: string;
    mode?: string;
    define?: Record<string, any>;
    plugins?: PluginOption[];
    publicDir?: string;
    cacheDir?: string;
    resolve?: ResolveOptions;
    css?: CSSOptions;
    json?: JsonOptions;
    esbuild?: ESBuildOptions;
    optimizeDeps?: DepOptimizationOptions;
    server?: ServerOptions;
    build?: BuildOptions;
    preview?: PreviewOptions;
    ssr?: SSROptions;
    worker?: WorkerOptions;
    logLevel?: 'info' | 'warn' | 'error' | 'silent';
    clearScreen?: boolean;
    envDir?: string;
    envPrefix?: string | string[];
    appType?: 'spa' | 'mpa' | 'custom';
  }

  export type PluginOption = Plugin | false | null | undefined | PluginOption[];

  export interface Plugin {
    name?: string;
    [key: string]: any;
  }

  export interface ResolveOptions {
    alias?: Record<string, string> | Array<{ find: string | RegExp; replacement: string }>;
    dedupe?: string[];
    conditions?: string[];
    mainFields?: string[];
    extensions?: string[];
    preserveSymlinks?: boolean;
  }

  export interface CSSOptions {
    modules?: Record<string, any>;
    preprocessorOptions?: Record<string, any>;
    postcss?: string | Record<string, any> | boolean;
    devSourcemap?: boolean;
  }

  export interface JsonOptions {
    stringify?: boolean;
  }

  export interface ESBuildOptions {
    include?: string | RegExp | (string | RegExp)[];
    exclude?: string | RegExp | (string | RegExp)[];
    jsxFactory?: string;
    jsxFragment?: string;
    target?: string | string[];
    minify?: boolean;
    keepNames?: boolean;
    tsconfigRaw?: string | Record<string, any>;
  }

  export interface DepOptimizationOptions {
    entries?: string | string[];
    exclude?: string[];
    include?: string[];
    esbuildOptions?: ESBuildOptions;
    force?: boolean;
    disabled?: boolean;
  }

  export interface ServerOptions {
    host?: string;
    port?: number;
    strictPort?: boolean;
    https?: boolean | Record<string, any>;
    open?: boolean | string;
    proxy?: Record<string, string | ProxyOptions>;
    cors?: boolean | Record<string, any>;
    headers?: Record<string, string>;
    hmr?: boolean | Record<string, any>;
    watch?: Record<string, any>;
  }

  export interface ProxyOptions {
    target: string;
    changeOrigin?: boolean;
    ws?: boolean;
    rewrite?: (path: string) => string;
    secure?: boolean;
    headers?: Record<string, string>;
  }

  export interface BuildOptions {
    target?: string | string[];
    outDir?: string;
    assetsDir?: string;
    assetsInlineLimit?: number;
    cssCodeSplit?: boolean;
    cssMinify?: boolean;
    sourcemap?: boolean | 'inline' | 'hidden';
    minify?: boolean | 'terser' | 'esbuild';
    emptyOutDir?: boolean | null;
    rollupOptions?: Record<string, any>;
  }

  export interface PreviewOptions {
    host?: string;
    port?: number;
    strictPort?: boolean;
    https?: boolean | Record<string, any>;
    open?: boolean | string;
    proxy?: Record<string, string | ProxyOptions>;
  }

  export interface SSROptions {
    external?: string[];
    noExternal?: string | RegExp | (string | RegExp)[] | true;
    target?: 'node' | 'webworker';
  }

  export interface WorkerOptions {
    format?: 'es' | 'iife';
    plugins?: Plugin[];
    rollupOptions?: Record<string, any>;
  }

  export function defineConfig(config: UserConfig): UserConfig;
  export function defineConfig(config: UserConfig | (() => UserConfig)): UserConfig;
}