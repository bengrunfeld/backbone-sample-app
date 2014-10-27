var people = new Backbone.Collection;

var tom = new Backbone.Model({name: 'Tom', gid: 5, can: 'do'});
var rob = new Backbone.Model({name: 'Rob', gid: 10, can: 'dont'});
var tim = new Backbone.Model({name: 'Tim', gid: 10, can: 'do'});

people.add(tom);
people.add(rob);
people.add(tim);

console.log(tom.pairs());
