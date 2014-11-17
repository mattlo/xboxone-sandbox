app.directive('gameButtonListener', function ($rootScope, $gamepad) {
	return {
		scope: true,
		restrict: 'A',
		link: function (scope, element, attrs) {
			scope.active = false;

			$gamepad.on('button.' + attrs.gameButtonListener + '.state', function (e, state) {
				scope.active = state;
			});

			$gamepad.on('button.' + attrs.gameButtonListener + '.down', function () {
				scope.button = arguments;
				scope.button.timestamp = new Date;
			});
		}
	}
});

app.directive('gameThumbstickListener', function ($rootScope, $gamepad) {
	return {
		scope: true,
		restrict: 'A',
		link: function (scope, element, attrs) {
			scope.active = false;

			$gamepad.on('thumbstick.' + attrs.gameThumbstickListener + '.state', function (e, state) {
				scope.active = state;
			});

			$gamepad.on('thumbstick.' + attrs.gameThumbstickListener + '.move', function (e, x, y) {
				scope.x = x;
				scope.y = y;
			});
		}
	}
});