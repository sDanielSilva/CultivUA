module.exports = function(config) {
  config.set({
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-html-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // Deixa os resultados visíveis no navegador
    },
    reporters: ['progress', 'kjhtml', 'html'],
    htmlReporter: {
      outputDir: 'karma-reports', // Diretório para guardar os relatórios
      focusOnFailures: true,
      namedFiles: true, // Nomeia os arquivos com base nos resultados
      urlFriendlyName: true
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: true,
    restartOnFileChange: true
  });
};