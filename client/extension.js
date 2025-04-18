const path = require('path');
const vscode = require('vscode');
const {
  LanguageClient,
  TransportKind
} = require('vscode-languageclient/node');

function activate(context) {
  const serverModule = path.join(__dirname, '..', 'server', 'server.js');
  const serverOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: { module: serverModule, transport: TransportKind.ipc }
  };
  const clientOptions = {
    documentSelector: [{ scheme: 'file', language: 'omniscript' }]
  };

  const client = new LanguageClient(
    'omniLangServer',
    'OmniScript Language Server',
    serverOptions,
    clientOptions
  );

  context.subscriptions.push(client.start());
}

module.exports = {
  activate
};
