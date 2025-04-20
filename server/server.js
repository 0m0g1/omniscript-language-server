const {
    createConnection,
    TextDocuments,
    DiagnosticSeverity,
    ProposedFeatures
  } = require('vscode-languageserver');
  
  const connection = createConnection(ProposedFeatures.all);
  const documents = new TextDocuments();

  function handleNestedComments(text) {
    let inComment = false;
    let nestedDepth = 0;
    let result = '';
    let i = 0;
  
    while (i < text.length) {
      if (text.substring(i, i + 2) === '/*' && !inComment) {
        // Start of comment block
        inComment = true;
        nestedDepth = 1;
        result += '<comment>';
        i += 2;
      } else if (text.substring(i, i + 2) === '/*' && inComment) {
        // Nested comment inside an open comment block
        nestedDepth++;
        result += '<nested-comment>';
        i += 2;
      } else if (text.substring(i, i + 2) === '*/' && inComment) {
        // End of comment block
        if (nestedDepth > 1) {
          nestedDepth--;
          result += '<end-nested-comment>';
          i += 2;
        } else {
          inComment = false;
          result += '</comment>';
          i += 2;
        }
      } else {
        result += text[i];
        i++;
      }
    }
  
    return result;
  }
  
  connection.onInitialize(() => {
    return {
      capabilities: {
        textDocumentSync: documents.syncKind,
        hoverProvider: true,
        completionProvider: {
          resolveProvider: false
        }
      }
    };
  });
  
  documents.onDidChangeContent(change => {
    const text = change.document.getText();
    const transformedText = handleNestedComments(text);
    connection.sendDiagnostics({ uri: change.document.uri, diagnostics: [] });
    
    // Simulate a fake diagnostic (you’ll replace this with real parsing logic)
    // const diagnostics = [];
    // if (text.includes('badword')) {
    //   diagnostics.push({
    //     severity: DiagnosticSeverity.Warning,
    //     range: {
    //       start: { line: 0, character: 0 },
    //       end: { line: 0, character: 7 }
    //     },
    //     message: `"badword" is not allowed.`,
    //     source: 'omniscript'
    //   });
    // }
  
    // connection.sendDiagnostics({ uri: change.document.uri, diagnostics });
  });
  
  connection.onHover(() => {
    return {
      contents: {
        kind: 'markdown',
        value: '**Some OmniScript code!🤷‍♂️**\nAurthor: @0m0g1'
      }
    };
  });
  
  connection.onCompletion(() => {
    return [
      { label: 'function', kind: 3, data: 1 },
      { label: 'const', kind: 14, data: 2 },
      { label: 'let', kind: 14, data: 3 }
    ];
  });
  
  documents.listen(connection);
  connection.listen();
  