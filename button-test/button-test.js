app.directive('gameButtonListener', function ($rootScope, $gamepad) {
	return {
		scope: true,
		restrict: 'A',
		link: function (scope, element, attrs) {
			$gamepad.on('button.' + attrs.gameButtonListener + '.down', function () {
				scope.button = arguments;
				scope.button.timestamp = new Date;
			});
		}
	}
});