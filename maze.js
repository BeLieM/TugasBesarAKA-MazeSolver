class MazeSolver {
  constructor(width = 21, height = 21) {
    this.width = width;
    this.height = height;
    this.maze = [];
    this.startPos = [1, 1];
    this.endPos = [width - 2, height - 2];
  }

  generateMaze() { 
    this.maze = Array(this.height)
      .fill()
      .map(() => Array(this.width).fill(1));

    const generatePath = (x, y) => {
      this.maze[y][x] = 0;

      const directions = [
        [2, 0],
        [0, 2],
        [-2, 0],
        [0, -2],
      ];

      for (let i = directions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [directions[i], directions[j]] = [directions[j], directions[i]];
      }

      for (const [dx, dy] of directions) {
        const newX = x + dx;
        const newY = y + dy;

        if (
          newX >= 0 &&
          newX < this.width &&
          newY >= 0 &&
          newY < this.height &&
          this.maze[newY][newX] === 1
        ) {
          this.maze[y + dy / 2][x + dx / 2] = 0;
          generatePath(newX, newY);
        }
      }
    };

    const startX =
      1 + 2 * Math.floor(Math.random() * Math.floor((this.width - 1) / 2));
    const startY =
      1 + 2 * Math.floor(Math.random() * Math.floor((this.height - 1) / 2));

    generatePath(startX, startY);
    return this.maze;
  }

  dfsIterative() {
    const visited = Array(this.height)
      .fill()
      .map(() => Array(this.width).fill(false));
    const path = [];
    const stack = [[...this.startPos]];
    const directions = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];

    while (stack.length > 0) {
      const [x, y] = stack.pop();

      if (x === this.endPos[0] && y === this.endPos[1]) {
        return path;
      }

      if (
        x < 0 ||
        x >= this.width ||
        y < 0 ||
        y >= this.height ||
        this.maze[y][x] === 1 ||
        visited[y][x]
      ) {
        continue;
      }

      visited[y][x] = true;
      path.push([x, y]);

      for (const [dx, dy] of directions) {
        stack.push([x + dx, y + dy]);
      }
    }

    return null;
  }

  dfsRecursive() {
    const visited = Array(this.height)
      .fill()
      .map(() => Array(this.width).fill(false));
    const path = [];

    const dfs = (x, y) => {
      if (
        x < 0 ||
        x >= this.width ||
        y < 0 ||
        y >= this.height ||
        this.maze[y][x] === 1 ||
        visited[y][x]
      ) {
        return false;
      }

      visited[y][x] = true;
      path.push([x, y]);

      if (x === this.endPos[0] && y === this.endPos[1]) {
        return true;
      }

      const directions = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
      ];
      for (const [dx, dy] of directions) {
        if (dfs(x + dx, y + dy)) return true;
      }

      path.pop();
      return false;
    };

    dfs(...this.startPos);
    return path.length > 0 ? path : null;
  }

  bfsIterative() {
    const visited = Array(this.height)
      .fill()
      .map(() => Array(this.width).fill(false));
    const queue = [[...this.startPos]];
    const path = [];
    const directions = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];

    while (queue.length > 0) {
      const [x, y] = queue.shift();

      if (x === this.endPos[0] && y === this.endPos[1]) {
        return path;
      }

      if (
        x < 0 ||
        x >= this.width ||
        y < 0 ||
        y >= this.height ||
        this.maze[y][x] === 1 ||
        visited[y][x]
      ) {
        continue;
      }

      visited[y][x] = true;
      path.push([x, y]);

      for (const [dx, dy] of directions) {
        queue.push([x + dx, y + dy]);
      }
    }

    return null;
  }

  bfsRecursive() {
    const visited = Array(this.height)
      .fill()
      .map(() => Array(this.width).fill(false));
    const queue = [[...this.startPos]];
    const path = [];
    const directions = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];

    const bfs = () => {
      if (queue.length === 0) return null;

      const [x, y] = queue.shift();

      if (x === this.endPos[0] && y === this.endPos[1]) {
        return path;
      }

      if (
        x < 0 ||
        x >= this.width ||
        y < 0 ||
        y >= this.height ||
        this.maze[y][x] === 1 ||
        visited[y][x]
      ) {
        return bfs();
      }

      visited[y][x] = true;
      path.push([x, y]);

      for (const [dx, dy] of directions) {
        queue.push([x + dx, y + dy]);
      }

      return bfs();
    };

    return bfs();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const mazeContainer = document.getElementById("mazeContainer");
  const generateButton = document.getElementById("generateMaze");
  const solveButton = document.getElementById("solveMaze");
  const algorithmSelector = document.getElementById("algorithmSelector");
  const pathLengthSpan = document.getElementById("pathLength");

  const mazeSolver = new MazeSolver();
  let currentMaze;

  function renderMaze(maze) {
    mazeContainer.innerHTML = "";
    mazeContainer.style.gridTemplateColumns = `repeat(${maze[0].length}, 20px)`;

    maze.forEach((row, y) => {
      row.forEach((cell, x) => {
        const cellElement = document.createElement("div");
        cellElement.classList.add("cell");
        cellElement.classList.add(cell === 1 ? "wall" : "path");

        if (x === 1 && y === 1) cellElement.classList.add("start");
        if (x === maze[0].length - 2 && y === maze.length - 2)
          cellElement.classList.add("end");

        mazeContainer.appendChild(cellElement);
      });
    });
  }

  generateButton.addEventListener("click", () => {
    currentMaze = mazeSolver.generateMaze();
    renderMaze(currentMaze);
    pathLengthSpan.textContent = "-";
  });

  solveButton.addEventListener("click", () => {
    mazeContainer.querySelectorAll(".solution").forEach((el) => {
      el.classList.remove("solution");
    });

    const algorithm = algorithmSelector.value;
    let solution;

    switch (algorithm) {
      case "dfsIterative":
        solution = mazeSolver.dfsIterative();
        break;
      case "dfsRecursive":
        solution = mazeSolver.dfsRecursive();
        break;
      case "bfsIterative":
        solution = mazeSolver.bfsIterative();
        break;
      case "bfsRecursive":
        solution = mazeSolver.bfsRecursive();
        break;
    }

    if (solution) {
      solution.forEach(([x, y]) => {
        const index = y * currentMaze[0].length + x;
        mazeContainer.children[index].classList.add("solution");
      });

      pathLengthSpan.textContent = solution.length;
    } else {
      alert("No path found!");
    }
  });

  currentMaze = mazeSolver.generateMaze();
  renderMaze(currentMaze);
});