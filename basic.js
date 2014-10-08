var Test = Backbone.View.extend({
  tagName: 'p',
  className: 'brook',
  id: 'shmuk',

  render: function() {
    this.$el.html('ummmm..... yeah');
  }
});

var myTest = new Test();
myTest.render();
console.log(myTest.el);
console.log(myTest.$el);
