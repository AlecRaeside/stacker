angular.module('stacker', [])
  .controller('game', ["$scope", "$interval", "$document", function($scope, $interval, $document) {

    var numRows = 12;
    var numCellsPerRow = 8;
    var LEFT = -1
    var RIGHT = 1
    $scope.speed = 200

    $scope.grid = []
    for (var i=0; i <= numRows; i++) {
      $scope.grid[i] = []
      for (var c = 0; c < numCellsPerRow; c++) {
        $scope.grid[i][c] = {active: false}
      }
    }

    $scope.activeBlock = {
      row: numRows - 1,
      cell: 0,
      length: 3,
      direction: 1 //move right
    }
    var initialiseRow = function () {
      for (var c = $scope.activeBlock.cell; c < $scope.activeBlock.length + $scope.activeBlock.cell; c++) {
        $scope.grid[$scope.activeBlock.row][c].active = true
      }
    }

    var row;
    var direction = 1
    $scope.step = function() {

      if ( $scope.activeBlock.direction == 1 && ($scope.activeBlock.cell + $scope.activeBlock.length) >= numCellsPerRow) {
        direction = LEFT
      } else if ( $scope.activeBlock.direction == -1 && $scope.activeBlock.cell  == 0) {
        direction = RIGHT
      }
      $scope.activeBlock.direction = direction

      row = $scope.grid[$scope.activeBlock.row]
      if (direction == 1) {
        row[$scope.activeBlock.cell].active = false
        row[$scope.activeBlock.cell+$scope.activeBlock.length].active = true
      } else {
        row[$scope.activeBlock.cell-1].active = true
        row[$scope.activeBlock.cell + $scope.activeBlock.length - 1].active = false
      }
      $scope.activeBlock.cell += $scope.activeBlock.direction
    }


    var stopBlock = function() {
      if ($scope.activeBlock.row != numRows - 1 && !$scope.grid[$scope.activeBlock.row+1][$scope.activeBlock.cell].active) {
        alert("YOU LOSE!")
        $interval.cancel($scope.gameLoop)
      } else if ($scope.activeBlock.row > 0) {
        $scope.activeBlock.row--;
        if ($scope.activeBlock.row % Math.floor(numRows/3) == 0 && $scope.activeBlock.length > 1) {
          $scope.activeBlock.length--;
        }
        initialiseRow()
        decreaseSpeed()
      } else {
        alert("YOU WIN!")
        $interval.cancel($scope.gameLoop)
      }
    }

    $document.on("keydown", function(event) {
      if (event.keyCode == 32) {
        stopBlock();
      }
    })

    decreaseSpeed = function() {
      $scope.speed *= 0.95
      $scope.speed -= 2
    }
    initialiseRow()
    $scope.$watch("speed", function(val) {
      if (!!$scope.gameLoop) {
        $interval.cancel($scope.gameLoop)
      }
      $scope.gameLoop = $interval($scope.step, parseInt($scope.speed, 10));
    })


  }])