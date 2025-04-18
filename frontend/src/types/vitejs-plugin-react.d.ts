declare module '@vitejs/plugin-react' {
  import { PluginOption } from 'vite';

  interface ReactPluginOptions {
    include?: string | RegExp | (string | RegExp)[];
    exclude?: string | RegExp | (string | RegExp)[];
    jsxRuntime?: 'automatic' | 'classic';
    jsxImportSource?: string;
    babel?: Record<string, any>;
    fastRefresh?: boolean;
  }

  export default function react(options?: ReactPluginOptions): PluginOption;
}
