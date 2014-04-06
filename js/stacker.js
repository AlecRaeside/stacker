angular.module('stacker', [])
  .controller('game', ["$scope", "$interval", function($scope, $interval) {

    var numRows = 10;
    var numCellsPerRow = 8;
    var speed = 300

    $scope.grid = []
    for (var i=0; i < numRows; i++) {
      $scope.grid[i] = []
      for (var c = 0; c < numCellsPerRow; c++) {
        $scope.grid[i][c] = { id: i+","+c, active: false}
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
      } else if ( $scope.activeBlock.direction == -1 && $scope.activeBlock.cell - $scope.activeBlock.length <= 0) {
        $scope.activeBlock.direction = 1
      }
      console.log($scope.activeBlock)
      $scope.grid[$scope.activeBlock.row][$scope.activeBlock.cell].active = false

      $scope.activeBlock.cell += $scope.activeBlock.direction

      $scope.grid[$scope.activeBlock.row][$scope.activeBlock.cell].active = true
    }

    $interval($scope.step, speed);


  }])