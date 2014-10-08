# Backbone

## Intro

Old-style apps did heavy-lifting of data in back end

New client applications pull raw data from the server and render it into the browser when and where it is needed.

The need for fast, complex, and responsive Ajax-powered web applications demands storage of logic on the client side.

## MVC

For an application to show real-time data, any change to the data in its Model should result in the View being refreshed instantly. Imagine a stock market app.

### Client-side MVC vs Single Page Apps

SPAs can also take advantage of browser features like the History API to update the address seen in the location bar when moving from one view to another. These URLs also make it possible to bookmark and share a particular application state, without the need to navigate to completely new pages.

## Quick Summary of Concepts

### Models

* validate attributes
* Persistence - save the state of a model somehwere
* announces updates to its data to any Views that are listening
* can be grouped together in a Collection

### Views

* edit Model data
* a `render` function in the View renders the contents of the **Model** using a JS templating engine
* can trigger an update when the **Model** changes
* it is not the responsibility of the **View** to deal with User Interaction (e.g. clicks). The **Controller** should handle this, which in the case of Backbone is achieved with an event handler.

### Controllers

A **Controller** is responsible for handling changes the User makes in the **edit View** for a particular item, updating its **Model** when the User has finished editing.

Backbone does not really have **Controllers** as such. Backbone’s **Views** typically contain **Controller** logic, and **Routers** are used to help manage application state.

**Controllers** facilitate **Views'** responses to different user input and are an example of the Strategy pattern.

## Backbone Facts

* Event-driven communication between **Views** and **Models**. Easy to add event-listeners to **Model Attributes**, giving developers fine-grained control over what changes in the **View**.
* Extensive eventing system. It’s trivial to add support for pub/sub in Backbone
* Prototypes are instantiated with the new keyword
* Agnostic about templating frameworks, however Underscore’s micro-templating is available by default
* Supports data bindings through manual events or a separate Key-value observing (KVO) library
* Support for RESTful interfaces out of the box, so Models can be easily tied to a backend

## Concepts in Depth

### Models

Backbone models contain data for an application as well as the logic around this data.

We can use a model to represent the concept of a Todo item including its attributes like title (Todo content) and completed (current state of the Todo).

`Initialize` is like a constructor; it runs on instantiation of a Model

	initialize: function(){
	      console.log('This model has been initialized.');
	}

`Default` values allow you to ensure that certain values are set on every Model that is instantiated

`Model.get()` allows you to retrieve a value from a Model object

`Model.set()` allows you to set the value of an attribute on a Model object. It also triggers a change event, which can be listened to.

`modelObject.toJSON()` returns all the values of the object

#### Listening to Events

You can silence change events on Models with `{silent:true}`

	var Person = new Backbone.Model();
	Person.on("change:name", function() { console.log('Name changed'); });
	Person.set({name: 'Jeremy'}, {silent: true});
	// no log entry

You can check if an attribute has changed with `Model.hasChanged(attribute)` or if *anything* has changed with `Model.hasChanged(null)`

To listen for *any* change to your Model, place an `this.on('change', function(){})` in your `initialize` function.

	initialize: function(){
	    console.log('This model has been initialized.');
	    this.on('change', function(){
	        console.log('- Values for this model have changed.');
	    });
	}

FYI - Changing more than one attribute at the same time only triggers the listener once.

To listed for changes to specific attributes, place an `this.on('change:attribute', function(){})` in your `initialize` function.

	initialize: function(){
	    console.log('This model has been initialized.');
	    this.on('change:title', function(){
	        console.log('Title value for this model has changed.');
	    });
	}

#### Validation

Backbone supports model validation through `model.validate()`, which allows checking the attribute values for a model prior to setting them. By default, validation occurs when the model is persisted using the `save()` method or when `set()` is called if `{validate:true}` is passed as an argument.

If an error is returned:

* An `invalid` event will be triggered, setting the validationError property on the model with the value which is returned by this method.
* `.save()` will not continue and the attributes of the model will not be modified on the server.

You can catch the `invalid` event in your `initialize` function (similar to above code) with 

	this.on("invalid", function(model, error){
	    console.log(error);
	});

Note: the `attributes` object passed to the `validate` function represents what the attributes would be after completing the current `set()` or `save()`.

It is not possible to change any Number, String, or Boolean attribute of the the **model attributes** within the function, but it is possible to change attributes in nested objects.

### Views

Views contain the logic behind the presentation of the model’s data to the user.

A view’s `render()` method can be bound to a model’s `change()` event, enabling the view to instantly reflect model changes without requiring a full page refresh.

In Backbone 1.1.0, if you want to access passed options in your view, you will need to save them as follows:

	initialize: function (options) {
	    this.options = options || {};
	}

#### The El Element

`el` is a DOM element that you build in the View. 

You give it its tag name with `tagName`, its id with `id`, and its class name with `className`.

Once you give it those attributes, you can fill it with content in the `render` function by using `this.$el.html()`.

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

The above code creates the DOM element below but doesn’t append it to the DOM.

`myTest.$el` will give you the actual jQuery object itself.

There are two ways to associate a DOM element with a view: a new element can be created for the view and subsequently added to the DOM **OR** a reference can be made to an element which already exists on the page.

If the element already exists on the page, you can set `el` as a CSS selector that matches the element.

	el: '#footer'

Alternatively, you can set `el` to an existing element when creating the view:
	
	var todosView = new TodosView({el: $('#footer')});

**NOTE:** When declaring a View, options, `el`, `tagName`, `id` and `className` may be defined as functions, if you want their values to be determined at runtime.

**NOTE 2:** `this.$el` is equivalent to `$(this.el)` and `this.$()` is used to find subelements with a matching identifier - e.g. `this.$('.edit')` finds elements with a class of `edit`.

If you wish to target a different element on the page, or change the element you were targeting, you can use `setElement`

#### The Render Function

`render()` is an optional function that defines the logic for rendering a template.

The `_.template` method in Underscore compiles JavaScript templates into functions which can be evaluated for rendering.

In the following template, `example-target` is used to pass the template to `_.template()`, which then compiles and stores it in the `myTemplate` variable in the View. 

	// index.html
	<script id="example-target" type="text/template">
	    <span>Name: <%= name %></span>
	</script>

	// myView.js
	myTemplate = _.template()

The render() method uses this template by passing it the toJSON() encoding of the attributes of the model associated with the view.

A common Backbone convention is to return `this` at the end of `render()`.


