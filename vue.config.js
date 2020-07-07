module.exports = {
    chainWebpack: config => {
        // 静的リソースのインライン化 (Data URI Scheme化)
        config.module
            .rule('images')
            .use('url-loader')
            .options({})
    }
}
