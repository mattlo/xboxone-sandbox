var app = angular.module('buttonTest', []);

// quick debug on XB1
window.onerror = console.log = function () {
	alert(JSON.stringify(arguments));
}

app.factory('$gamepad', function ($window, $rootScope) {

	var $gamepad,
		$scope = $rootScope.$new(),
		thumbstickSensitivity = 0.2,
		actionRecord = {
			LEFT_THUMBSTICK: false,
			RIGHT_THUMBSTICK: false
		};

	$gamepad = {
		// button constants
		action: {
			A_BUTTON: 0,
			B_BUTTON: 1,
			X_BUTTON: 2,
			Y_BUTTON: 3,
			LEFT_SHOULDER: 4,
			RIGHT_SHOULDER: 5,
			LEFT_TRIGGER: 6,
			RIGHT_TRIGGER: 7,
			VIEW_BUTTON: 8,
			MENU_BUTTON: 9,
			LEFT_THUMBSTICK_BUTTON: 10,
			RIGHT_THUMBSTICK_BUTTON: 11,
			UP_DPAD: 12,
			DOWN_DPAD: 13,
			LEFT_DPAD: 14,
			RIGHT_DPAD: 15
		},
		thumbstickAction: {
			LEFT_THUMBSTICK_X: 0,
			LEFT_THUMBSTICK_Y: 1,
			RIGHT_THUMBSTICK_X: 2,
			RIGHT_THUMBSTICK_Y: 3
		},
		instance: function () {
			return $window.navigator.getGamepads()[0]
		},
		on: function (event, callback) {
			return $scope.$on.call($scope, event, function () {
				callback.apply(null, arguments);
				$rootScope.$apply();
			});
		}
	};

	function actionRecordSwitch(namespace, key, currentlyAt) {
		if (typeof actionRecord[key] === 'undefined' || currentlyAt !== actionRecord[key]) {
			actionRecord[key] = currentlyAt;

			$scope.$broadcast(namespace + '.' + key + '.state', currentlyAt);
		}
	}

	function hasJoystickMoved(gamepadRef, x, y) {
		function distance(n) {
			return Math.abs(gamepadRef.axes[n]) > thumbstickSensitivity
		}

		return distance(x) || distance(y);
	}

	function eventLoop() {
		var button,
			joystick,
			gamepadRef = $gamepad.instance();

		if (typeof gamepadRef !== 'undefined') {
			// listen for all buttons
			for (button in $gamepad.action) {
				if (gamepadRef.buttons[$gamepad.action[button]].pressed) {
					// dispatch event
					$scope.$broadcast(
						'button.' + button + '.down', 
						gamepadRef.buttons[$gamepad.action[button]].value, 
						$gamepad.action[button]
					);

					actionRecordSwitch('button', button, true);
				} else {
					actionRecordSwitch('button', button, false);
				}
			}

			var debug = document.querySelector('#debug');
			debug.innerHTML = '';

			// listen for joystick deltas
			(function (g) {
				[
					[g.LEFT_THUMBSTICK_X, g.LEFT_THUMBSTICK_Y, 'LEFT_THUMBSTICK'],
					[g.RIGHT_THUMBSTICK_X, g.RIGHT_THUMBSTICK_Y, 'RIGHT_THUMBSTICK']
				].forEach(function(s) {
					if (hasJoystickMoved(gamepadRef, s[0], s[1])) {
						// dispatch joystick event
						$scope.$broadcast(
							'thumbstick.' + s[2] + '.move',
							gamepadRef.axes[s[0]],
							gamepadRef.axes[s[1]]
						)

						actionRecordSwitch('thumbstick', s[2], true);
					} else {
						actionRecordSwitch('thumbstick', s[2], false);
					}
				});
			}($gamepad.thumbstickAction));
		}

		// run forever!
		$window.requestAnimationFrame(eventLoop)
	}

	// run loop
	eventLoop();

	// return controller singleton
	return $gamepad;
});