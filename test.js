var test = require('tap').test
var fss = require('./')
var clone = require('clone')
var s = JSON.stringify

test('circular reference to root', function (assert) {
  var fixture = {name: 'Tywin Lannister'}
  fixture.circle = fixture
  var expected = s(
    {name: 'Tywin Lannister', circle: '[Circular]'}
  )
  var actual = fss(fixture)
  assert.is(actual, expected)
  assert.end()
})

test('nested circular reference to root', function (assert) {
  var fixture = {name: 'Tywin Lannister'}
  fixture.id = {circle: fixture}
  var expected = s(
    {name: 'Tywin Lannister', id: {circle: '[Circular]'}}
  )
  var actual = fss(fixture)
  assert.is(actual, expected)
  assert.end()
})

test('child circular reference', function (assert) {
  var fixture = {name: 'Tywin Lannister', child: {name: 'Tyrion Lannister'}}
  fixture.child.dinklage = fixture.child
  var expected = s({
    name: 'Tywin Lannister',
    child: {
      name: 'Tyrion Lannister', dinklage: '[Circular]'
    }
  })
  var actual = fss(fixture)
  assert.is(actual, expected)
  assert.end()
})

test('nested child circular reference', function (assert) {
  var fixture = {name: 'Tywin Lannister', child: {name: 'Tyrion Lannister'}}
  fixture.child.actor = {dinklage: fixture.child}
  var expected = s({
    name: 'Tywin Lannister',
    child: {
      name: 'Tyrion Lannister', actor: {dinklage: '[Circular]'}
    }
  })
  var actual = fss(fixture)
  assert.is(actual, expected)
  assert.end()
})

test('circular objects in an array', function (assert) {
  var fixture = {name: 'Tywin Lannister'}
  fixture.hand = [fixture, fixture]
  var expected = s({
    name: 'Tywin Lannister', hand: ['[Circular]', '[Circular]']
  })
  var actual = fss(fixture)
  assert.is(actual, expected)
  assert.end()
})

test('nested circular references in an array', function (assert) {
  var fixture = {
    name: 'Tywin Lannister',
    offspring: [{name: 'Tyrion Lannister'}, {name: 'Cersei Lannister'}]
  }
  fixture.offspring[0].dinklage = fixture.offspring[0]
  fixture.offspring[1].headey = fixture.offspring[1]

  var expected = s({
    name: 'Tywin Lannister',
    offspring: [
      {name: 'Tyrion Lannister', dinklage: '[Circular]'},
      {name: 'Cersei Lannister', headey: '[Circular]'}
    ]
  })
  var actual = fss(fixture)
  assert.is(actual, expected)
  assert.end()
})

test('circular arrays', function (assert) {
  var fixture = []
  fixture.push(fixture, fixture)
  var expected = s(['[Circular]', '[Circular]'])
  var actual = fss(fixture)
  assert.is(actual, expected)
  assert.end()
})

test('nested circular arrays', function (assert) {
  var fixture = []
  fixture.push(
    {name: 'Jon Snow', bastards: fixture},
    {name: 'Ramsay Bolton', bastards: fixture}
  )
  var expected = s([
    {name: 'Jon Snow', bastards: '[Circular]'},
    {name: 'Ramsay Bolton', bastards: '[Circular]'}
  ])
  var actual = fss(fixture)
  assert.is(actual, expected)
  assert.end()
})

test('repeated non-circular references in objects', function (assert) {
  var daenerys = {name: 'Daenerys Targaryen'}
  var fixture = {
    motherOfDragons: daenerys,
    queenOfMeereen: daenerys
  }
  var expected = s(fixture)
  var actual = fss(fixture)
  assert.is(actual, expected)
  assert.end()
})

test('repeated non-circular references in arrays', function (assert) {
  var daenerys = {name: 'Daenerys Targaryen'}
  var fixture = [daenerys, daenerys]
  var expected = s(fixture)
  var actual = fss(fixture)
  assert.is(actual, expected)
  assert.end()
})

test('double child circular reference', function (assert) {
  // create circular reference
  var child = {name: 'Tyrion Lannister'}
  child.dinklage = child

  // include it twice in the fixture
  var fixture = {name: 'Tywin Lannister', childA: child, childB: child}
  var cloned = clone(fixture)
  var expected = s({
    name: 'Tywin Lannister',
    childA: {
      name: 'Tyrion Lannister', dinklage: '[Circular]'
    },
    childB: {
      name: 'Tyrion Lannister', dinklage: '[Circular]'
    }
  })
  var actual = fss(fixture)
  assert.is(actual, expected)

  // check if the fixture has not been modified
  assert.deepEqual(fixture, cloned)
  assert.end()
})

test('allow JSON.stringify options', function (assert) {
  var person = {name: 'Tyrion Lannister'}
  var expected = '{\n\t"name": "Tywin Lannister"\n}'
  var actual = fss(person, function (k, v) {
    if (k === 'name') {
      return 'Tywin Lannister'
    } else {
      return v
    }
  }, '\t')

  assert.is(actual, expected)
  assert.end()
})
