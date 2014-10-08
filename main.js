// Model
var ExampleModel = Backbone.Model.extend({
	defaults: {
		name: 'Ben'
	}
});

// View
var DisplayView = Backbone.View.extend({
	el: $('.example-content'),
	template: _.template( $('#example-target').html() ),

	render: function(){
		var exampleTemplate = this.template(this.model.toJSON());
		this.$el.html(exampleTemplate);
	}
});

// Router
AppRouter = Backbone.Router.extend({
	routes: {
		'*html': 'somefunc'
	}
});

// Routing methods
app_router = new AppRouter();
app_router.on('route:somefunc', function(id){
	alert('hi there ' + id);
});

Backbone.history.start();

var example_model = new ExampleModel({name: 'Jack'});
var display_view = new DisplayView({ model: example_model });
display_view.render();
