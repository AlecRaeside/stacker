angular.module('stacker', [])
  .controller('game', ["$scope", "$interval", "$document", function($scope, $interval, $document) {

    var numRows = 12;
    var numCellsPerRow = 8;
    var LEFT = -1
    var RIGHT = 1
    var speed = 4
    var level = 0
    var row;
    var direction = 1

    $scope.initGame = function() {
      $scope.speed = speed
      $scope.score = 0
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
        length: 3,
        direction: 1 //move right
      }
      level = 0
      direction = 1
       $scope.bestscore = 0
      if (!!localStorage.bestscore) {
        $scope.bestscore = parseInt(localStorage.bestscore, 10)
      }
     }

    $scope.initGame()

    $scope.initialiseRow = function() {
      var newActiveCell = $scope.activeBlock.cell
      for (var c = $scope.activeBlock.cell; c < $scope.activeBlock.length + $scope.activeBlock.cell; c++) {
        if ($scope.activeBlock.row == numRows - 1 || $scope.grid[$scope.activeBlock.row + 1][c].active) {
          $scope.grid[$scope.activeBlock.row][c].active = true
          $scope.grid[$scope.activeBlock.row-1][c].active = true
        } else {
          newActiveCell++
          $scope.activeBlock.length--
          $scope.grid[$scope.activeBlock.row][c].active = false
        }
      }
      if ($scope.activeBlock.length > 1 && $scope.activeBlock.row == 4 || $scope.activeBlock.row == 8) {
        $scope.activeBlock.length--
      }
      $scope.activeBlock.cell = newActiveCell
      if ($scope.activeBlock.length == 0) {
        return "lose"
      }
    }


    $scope.step = function() {
      $scope.score++;

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
      if ($scope.activeBlock.row >= 0) {
        var result;
        if ($scope.activeBlock.row > 0) {
          result = $scope.initialiseRow()
        } else if ($scope.grid[$scope.activeBlock.row+1][$scope.activeBlock.cell].active) {
          result = "win"
        } else {
          result = "lose"
        }
        if (result == "win" && $scope.activeBlock.row == 0) {
          if (!localStorage.bestscore || $scope.score < $scope.bestscore) {
            localStorage.bestscore = $scope.score
          }
          alert("YOU WIN!")
          gameFinished()
        } else if (result == "lose") {
          alert("YOU LOSE!")
          gameFinished()
        } else {
          $scope.activeBlock.row--;
          decreaseSpeed()
        }
      }
    }

    var gameFinished = function() {
      $interval.cancel($scope.gameLoop)
      $scope.initGame()
    }

    $document.on("keydown", function(event) {
      if (event.keyCode == 32) {
        stopBlock();
      }
    })
    $document.on("touchstart", stopBlock)

    decreaseSpeed = function() {
      $scope.speed++
    }
    $scope.$watch("speed", function(val) {
      if (!!$scope.gameLoop) {
        $interval.cancel($scope.gameLoop)
      }
      $scope.gameLoop = $interval($scope.step, parseInt(1000/$scope.speed, 10));
    })
  }])