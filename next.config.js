// next.config.js
module.exports = {
    // webpack(config, options) {
    //     config.module.rules.push({
    //         test: /\.module\.css$/,
    //         use: [
    //             options.defaultLoaders.babel,
    //             {
    //                 loader: require('styled-jsx/webpack').loader,
    //                 options: {
    //                     type: 'scoped'
    //                 }
    //             },
    //             'css-loader'
    //         ]
    //     });

    //     return config;
    // },
    // async redirects() {
    //     return [
    //         {
    //             source: '/documents/:path*',
    //             destination: '/home',
    //             permanent: false,
    //         },
    //     ];
    // },
    pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
};
