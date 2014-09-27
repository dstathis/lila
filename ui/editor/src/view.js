var chessground = require('chessground');
var editor = require('./editor');

function promptNewFen(ctrl) {
  var fen = prompt('Paste FEN position').trim();
  if (fen) ctrl.loadNewFen(fen);
}

function castleCheckBox(ctrl, id, label, reversed) {
  var input = m('input[type=checkbox]', {
    checked: ctrl.data.castles[id](),
    onchange: function() {
      ctrl.data.castles[id](this.checked);
    }
  });
  return m('label', reversed ? [input, label] : [label, input]);
}

function controls(ctrl, fen) {
  return m('div#editor-side', [
    m('div', [
      m('a.button', {
        onclick: ctrl.startPosition
      }, ctrl.trans('startPosition')),
      m('a.button', {
        onclick: ctrl.clearBoard
      }, ctrl.trans('clearBoard'))
    ]),
    m('div', [
      m('a.button[data-icon=B]', {
        onclick: ctrl.chessground.toggleOrientation
      }, ctrl.trans('flipBoard')),
      m('a.button', {
        onclick: promptNewFen.bind(ctrl)
      }, ctrl.trans('loadPosition'))
    ]),
    m('div', [
      m('select.color', {
        value: ctrl.data.color(),
        onchange: m.withAttr('value', ctrl.data.color)
      }, [
        m('option[value=w]', ctrl.trans('whitePlays')),
        m('option[value=b]', ctrl.trans('blackPlays'))
      ])
    ]),
    m('div.castling', [
      m('strong', 'Castling'),
      m('div', [
        castleCheckBox(ctrl, 'K', 'White O-O', false),
        castleCheckBox(ctrl, 'Q', 'White O-O-O', true)
      ]),
      m('div', [
        castleCheckBox(ctrl, 'k', 'Black O-O', false),
        castleCheckBox(ctrl, 'q', 'Black O-O-O', true)
      ])
    ]),
    m('div', [
      m('a.button', {
        href: '/?fen=' + fen + '#ai'
      }, ctrl.trans('playWithTheMachine')),
      m('a.button', {
        href: '/?fen=' + fen + '#friend'
      }, ctrl.trans('playWithAFriend'))
    ])
  ]);
}

function inputs(ctrl, fen) {
  return m('div.copyables', [
    m('p', [
      m('strong.name', 'FEN'),
      m('input.copyable[readonly][spellCheck=false]', {
        value: fen
      })
    ]),
    m('p', [
      m('strong.name', 'URL'),
      m('input.copyable[readonly][spellCheck=false]', {
        value: editor.makeUrl(ctrl.data, fen)
      })
    ])
  ]);
}

module.exports = function(ctrl) {
  var fen = ctrl.computeFen();
  return m('div.editor', [
    chessground.view(ctrl.chessground),
    controls(ctrl, fen),
    inputs(ctrl, fen)
  ]);
};
