// const {WebpackWarPlugin} = require('../../dist');
const {WebpackWarPlugin} = require('webpack-war-plugin');
const fs = require('fs');
const {resolve, relative, parse} = require('path');

const files = allFiles(__dirname + '/src/build');

function allFiles(srcpath) {
    let files = [];
    const getFiles = (path) => {
        const files_ = [];
        const a = fs.readdirSync(path).map(file => {
            const url = resolve(path, file);
            if (fs.statSync(url).isFile()) {
                files_.push(url);
            }
            if (fs.statSync(url).isDirectory()) {
                files_.push(...getFiles(url));
            }
        });
        return files_;
    }
    files = getFiles(srcpath);
    return files;
}

module.exports = {
    entry: './' + relative(__dirname, files[0]),
    context: __dirname,
    output: {
        path: __dirname + "/dist",
        filename: "[name].[ext]"
    },
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|svg|html)$/i,
                use: ['file-loader'],
            }]
    },
    plugins: [
        new WebpackWarPlugin({
            archiveName: 'archive',
            webInf: 'WEB-INF',
            additionalElements: [
                {path: './META-INF'},
                {path: './pom.xml'},
                // Содержание файла из path будет помещенно по адресу destPath в папке dist
                {path: './manifest.xml', destPath: 'dir/man.xml'},
                {path: './src/build', destPath: '/'}
            ]
        })
    ]
};
