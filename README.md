#Follower JQuery Plugin

This plugin makes an element sticky, so it follows you when you are scrolling.

When it reaches the bottom of the top of its container, it automatically stop following.

## Demos
https://rawgit.com/aewebsolutions/follower/master/demos/follower.html

## Installation

Include JQuery js and plugin’s css and js files in your HTML code.

```html

<script src="/lib/jquery.js"></script> 
<link rel="stylesheet" href="/dist/follower.css" type="text/css" /> 
<script src="/dist/follower.js"></script> 

```

## Usage


Wait until document is ready. Then, call plugin.

```javascript

$(document).ready(function(){

   $('#your_element').follower();

});

```

Include a relative positioned parent if you want to delimit following.

```html

<div style="position: relative">

    <div id="your_element">Your sticky element</div>   

</div>

```

## Code examples

```javascript
$('#element-1').follower({
    padding : 20
});

$('#element-2').follower({
    height: '100%'
});

$('#element-3').follower({
    height: '100%',
    center : true
});

$('#element-4').follower();

$('#element-4').on('followerGetBottom', function(){
    console.log('#demo-5 has reached the bottom of container')
});
$('#element-4').on('followerGetTop', function(){
    console.log('#demo-5 has reached the top of container')
});

```

## Options

Name | Type | Default | Description
--- | --- | --- | ---
**center** | boolean | false |  Center content in the middle of a container
**height** | number\|string | null | Height of the element. It takes original value by default. Percentage values refers to screen height
**padding** | number | 0 | space between top of the screen and element
**breakpoint** | number | 0 | Set a width value for stop following. E.g., '100%', '200px', '10em'.

## Public Methods
Method | Params | Return | Description
--- | --- | --- | ---
**update** | void |  void | Updates position of follower.
**start** | void | void | Starts following
**stop** | void | void |  Stops following
**close** | callback | void | Detaches follower and stop following


## Events

Event | Params | Description
--- | --- | ---
**followerGetTop** | event | Fires when element reaches top of container.
**followerGetBottom** | event | Fires when element reaches bottom of container.
**followerReady** | event, instance | Fires when follower has been initialized.
**followerPlay** | event, instance | Fires when follower is turn on with `play` method.
**followerStop** | event, instance | Fires when follower is turn off with `stop` method.
**followerResize** | event | Fires when window is resized.
