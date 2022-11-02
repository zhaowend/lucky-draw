module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  // publicPath:  process.env.NODE_ENV === 'production'? '': '/', // 公共路径(必须有的)
  outputDir: "docs", // 输出文件目录
  assetsDir: "static"//静态资源文件名称
};
