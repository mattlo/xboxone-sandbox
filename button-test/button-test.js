var app = angular.module('buttonTest', []);

// quick debug on XB1
window.onerror = console.log = function () {
	alert(JSON.stringify(arguments));
}

app.run(function ($gamepad, $rootScope) {
	$rootScope.details = "abc";

	$gamepad.on('button.A_BUTTON.down', function (e, button) {
		$rootScope.details = new Date
	});
});

app.factory('$gamepad', function ($window, $rootScope) {

	var $gamepad,
		$scope = $rootScope.$new();

	$gamepad = {
		// button constants
		action: {
			A_BUTTON: 0,
			B_BUTTON: 1,
			X_BUTTON: 2,
			Y_BUTTON: 3,
			LEFT_SHOULDER: 4,
			RIGHT_SHOULDER: 5,
			UP_DPAD: 12,
			DOWN_DPAD: 13,
			LEFT_DPAD: 14,
			RIGHT_DPAD: 15,
			VIEW_BUTTON: 8,
			MENU_BUTTON: 9
		},
		instance: function () {
			return $window.navigator.getGamepads()[0]
		},
		on: function (event, callback) {
			return $scope.$on.call($scope, event, function (arguments) {
				callback.apply(this, arguments);
				$rootScope.$apply();
			});
		}
	};

	function eventLoop() {
		var button,
			gamepadRef = $gamepad.instance();

		if (typeof gamepadRef !== 'undefined') {
			// listen for all buttons
			for (button in $gamepad.action) {
				if (gamepadRef.buttons[$gamepad.action[button]].pressed) {
					// dispatch event
					$scope.$broadcast(
						'button.' + button + '.down', 
						gamepadRef.buttons[button], 
						$gamepad.action[button]
						);
				}
			}
		}

		// run forever!
		$window.requestAnimationFrame(eventLoop)
	}

	// run loop
	eventLoop();

	// return controller singleton
	return $gamepad;
});
