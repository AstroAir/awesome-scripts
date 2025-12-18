import path from 'path';
import { fileURLToPath } from 'url';
import { UserscriptPlugin } from 'webpack-userscript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 脚本元数据配置
const scriptsMetadata = {
  'github-fold-about': {
    name: 'GitHub Fold About Sidebar',
    version: '1.0.0',
    description: 'Fold/unfold the About section in GitHub repository sidebar',
    icon: 'https://www.google.com/s2/favicons?sz=64&domain=github.com',
    author: 'AstroAir',
    namespace: 'http://tampermonkey.net/',
    license: 'MIT',
    match: ['https://github.com/*/*'],
    grant: ['GM_addStyle'],
    runAt: 'document-end',
  },
  'github-fold-files': {
    name: 'GitHub Fold Files Enhanced',
    version: '1.0.1',
    description: 'Enhanced file/folder collapsing for GitHub with smooth animations',
    icon: 'https://www.google.com/s2/favicons?sz=64&domain=github.com',
    author: 'AstroAir',
    namespace: 'http://tampermonkey.net/',
    license: 'MIT',
    match: ['https://github.com/*'],
    grant: ['GM_addStyle'],
    runAt: 'document-end',
  },
  'github-trending-button': {
    name: 'GitHub Trending Button Enhanced',
    version: '2.0.0',
    description: 'Enhanced trending button with language filter, favorites, and quick access',
    icon: 'https://github.githubassets.com/favicons/favicon.svg',
    author: 'AstroAir',
    namespace: 'https://github.com/AstroAir',
    license: 'MIT',
    match: ['https://github.com/*'],
    grant: ['GM_setValue', 'GM_getValue', 'GM_registerMenuCommand', 'GM_addStyle'],
    runAt: 'document-end',
  },
  'github-enhanced-toolbar': {
    name: 'GitHub 增强工具栏',
    version: '2.1.1',
    description: '在 Github 网站顶部显示 Github.dev、DeepWiki 和 ZreadAi 按钮，完美支持亮暗色主题自动适配',
    icon: 'https://github.com/favicons/favicon.svg',
    author: 'Txy-Sky',
    namespace: 'https://github.com/txy-sky',
    license: 'MIT',
    match: ['https://github.com/*'],
    grant: ['none'],
    runAt: 'document-end',
  },
  'linuxdo-autoreader': {
    name: 'Linux.do 自动标记已读 Ultimate',
    version: '4.0',
    description: '自动将 Linux.do 论坛的帖子及回复标记为已读 - 真实行为模拟版',
    author: 'by.三文鱼 (Ultimate版)',
    namespace: 'http://tampermonkey.net/',
    license: 'MIT',
    match: ['https://linux.do/*'],
    grant: ['GM_addStyle', 'GM_setValue', 'GM_getValue', 'GM_notification'],
    runAt: 'document-end',
  },
  'linuxdo-post-export': {
    name: 'Linux.do Forum Post Exporter',
    version: '2.1.0',
    description: 'Export forum posts from linux.do with replies in JSON or HTML format - Optimized & Beautiful with i18n support',
    author: 'Forum Exporter',
    namespace: 'https://linux.do/',
    license: 'MIT',
    match: ['https://linux.do/t/*', 'https://linux.do/t/topic/*'],
    grant: ['GM_getValue', 'GM_setValue'],
    runAt: 'document-idle',
  },
};

// 生成入口点配置
const entries = Object.keys(scriptsMetadata).reduce((acc, name) => {
  acc[name] = path.resolve(__dirname, `src/scripts/${name}/index.js`);
  return acc;
}, {});

// 生成 WebpackUserscript 插件配置 - 使用函数根据 chunk 名称返回不同的 headers
const userscriptPlugin = new UserscriptPlugin({
  headers: (_headers, ctx) => {
    // 从 fileInfo 获取入口名称
    const entryName = ctx.fileInfo.chunk.name || ctx.fileInfo.basename.replace('.user.js', '');
    const metadata = scriptsMetadata[entryName];
    if (!metadata) {
      return { name: entryName };
    }
    return {
      name: metadata.name,
      version: metadata.version,
      description: metadata.description,
      icon: metadata.icon,
      author: metadata.author,
      namespace: metadata.namespace,
      license: metadata.license,
      match: metadata.match,
      grant: metadata.grant,
      'run-at': metadata.runAt,
    };
  },
  pretty: true,
  proxyScript: {
    filename: '[name].proxy.user.js',
    baseUrl: 'file://' + path.resolve(__dirname, 'dist') + '/',
  },
});

export default (env, argv) => {
  const isDev = argv.mode === 'development';

  return {
    mode: argv.mode || 'production',
    entry: entries,
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].user.js',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: {
                      browsers: ['last 2 Chrome versions', 'last 2 Firefox versions'],
                    },
                    modules: false,
                  },
                ],
              ],
            },
          },
        },
        {
          test: /\.css$/,
          use: ['raw-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@core': path.resolve(__dirname, 'src/core'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@styles': path.resolve(__dirname, 'src/styles'),
        '@scripts': path.resolve(__dirname, 'src/scripts'),
      },
    },
    optimization: {
      minimize: !isDev,
      splitChunks: false, // UserScript 不需要代码分割
    },
    devtool: isDev ? 'inline-source-map' : false,
    plugins: [userscriptPlugin],
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 300,
    },
    performance: {
      hints: false,
    },
  };
};
