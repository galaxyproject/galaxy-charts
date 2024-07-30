module.exports = {
    filenameHashing: false,
    css: {
        extract: false,
    },
    configureWebpack: {
        optimization: {
            splitChunks: false
        }
    },
}