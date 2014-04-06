angular.module('stacker', [])
  .controller('game', ["$scope", "$interval", "$document", function($scope, $interval, $document) {

    var numRows = 12;
    var numCellsPerRow = 8;
    $scope.speed = 200

    $scope.grid = []
    for (var i=0; i < numRows; i++) {
      $scope.grid[i] = []
      for (var c = 0; c < numCellsPerRow; c++) {
        $scope.grid[i][c] = {active: false}
      }
    }

    $scope.activeBlock = {
      row: numRows - 1,
      cell: 0,
      length: 1,
      direction: 1 //move right
    }

    $scope.step = function() {
      if ( $scope.activeBlock.direction == 1 && $scope.activeBlock.cell + $scope.activeBlock.length >= numCellsPerRow) {
        $scope.activeBlock.direction = -1
      } else if ( $scope.activeBlock.direction == -1 && $scope.activeBlock.cell  == 0) {
        $scope.activeBlock.direction = 1
      }

      $scope.grid[$scope.activeBlock.row][$scope.activeBlock.cell].active = false

      $scope.activeBlock.cell += $scope.activeBlock.direction

      $scope.grid[$scope.activeBlock.row][$scope.activeBlock.cell].active = true
    }

    $document.on("keydown", function(event) {
      if (event.keyCode == 32) {

        if ($scope.activeBlock.row != numRows - 1 && !$scope.grid[$scope.activeBlock.row+1][$scope.activeBlock.cell].active) {
          alert("YOU LOSE!")
          $interval.cancel($scope.gameLoop)
        } else if ($scope.activeBlock.row > 0) {
          $scope.activeBlock.row--;
          decreaseSpeed()
        } else {
          alert("YOU WIN!")
          $interval.cancel($scope.gameLoop)
        }
      }
    })

    decreaseSpeed = function() {
      $scope.speed *= 0.95
      $scope.speed -= 2
    }

    $scope.$watch("speed", function(val) {
      if (!!$scope.gameLoop) {
        $interval.cancel($scope.gameLoop)
      }
      console.log($scope.speed)
      $scope.gameLoop = $interval($scope.step, parseInt($scope.speed, 10));
    })


  }])