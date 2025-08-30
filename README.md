
<img width="704" height="913" alt="image" src="https://github.com/user-attachments/assets/63e17f50-9522-4290-96bd-846c3e5d9a1e" />


# Flappy DSA Bird

A Flappy-Bird–style game built for demonstrating Data Structures & Algorithms (DSA) concepts.
This repo contains a playable, modular JavaScript game that uses simple DSA ideas (a queue for obstacle management, axis-aligned bounding box collision detection, state management for restart) and includes guidance + optional patterns (Deque, BFS pathfinding, Trie, DP) you can add to make the project more algorithmically interesting for a GitHub portfolio.

---

## Table of Contents

* [Demo / Quick start](#demo--quick-start)
* [Features](#features)
* [File structure](#file-structure)
* [How to run](#how-to-run)
* [Controls](#controls)
* [Gameplay parameters (tunable)](#gameplay-parameters-tunable)
* [DSA patterns & algorithms used (detailed)](#dsa-patterns--algorithms-used-detailed)

  * [Queue for pipes](#queue-for-pipes)
  * [Collision detection — AABB (Axis-Aligned Bounding Box)](#collision-detection---aabb-axis-aligned-bounding-box)
  * [Game loop and timings](#game-loop-and-timings)
  * [Pipe generation (random with constraints)](#pipe-generation-random-with-constraints)
  * [Scoring & state machine (restart)](#scoring--state-machine-restart)
* [Advanced DSA extensions (recommended to show off skills)](#advanced-dsa-extensions-recommended-to-show-off-skills)

  * [Deque (true O(1) front/back)](#deque-true-o1-frontback)
  * [BFS pathfinder — safe path prediction (grid graph)](#bfs-pathfinder---safe-path-prediction-grid-graph)
  * [Trie for secret input patterns / combos](#trie-for-secret-input-patterns--combos)
  * [Dynamic Programming for combo scoring](#dynamic-programming-for-combo-scoring)
  * [Priority queue / heap for scheduled events](#priority-queue--heap-for-scheduled-events)
  * [Segment tree or interval tree for range queries on obstacles](#segment-tree-or-interval-tree-for-range-queries-on-obstacles)
* [Complexity analysis](#complexity-analysis)
* [How to extend / integrate the optional modules](#how-to-extend--integrate-the-optional-modules)
* [Testing & benchmarking notes](#testing--benchmarking-notes)
* [License & credits](#license--credits)

---

## Demo / Quick start

Open `index.html` in your browser (or run a lightweight static server) and play with your `bird.png` sprite in the repo. Controls: press **Space** (or UpArrow) to flap. On Game Over press **Space** to restart.

---

## Features

* Playable Flappy-Bird clone using `bird.png`.
* Slower, smooth physics tuned for fair gameplay.
* Pipes managed by a **Queue** (DSA demonstration).
* Collision detection (AABB).
* Score tracking and on-screen display.
* Restart without reloading the page (state reset).

---

## File structure

```
flappy-dsa/
├── index.html       # HTML shell
├── styles.css       # Visual styling
├── bird.png         # Player sprite (user-supplied)
├── bird.js          # Bird class (physics + draw)
├── pipe.js          # Pipe class (single obstacle)
├── score.js         # Score class (draw + increment)
├── utils.js         # Queue class (simple array-based), helpers
└── game.js          # Main game loop, input, restart logic
```

---

## How to run

Two easy options:

1. Double-click `index.html` (works in most browsers).
2. Run a local server (recommended so `bird.png` loads reliably):

```bash
# Python 3
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

---

## Controls

* **Space** (or **ArrowUp**) → flap while playing.
* After Game Over → press **Space** to restart.

---

## Gameplay parameters (tunable)

These constants are defined in `bird.js`, `pipe.js`, and `game.js`:

* `bird.gravity` (default used in latest code: `0.25`)
* `bird.lift` (default: `-6`)
* `pipe.gap` (default: `190`) — gap height between top / bottom pipes
* `pipe.speed` (default: `1.5`) — horizontal pipe speed
* `frame spawn rate` (pipes spawn every `150` frames)

Adjust these values to make the game easier/harder.

---

## DSA patterns & algorithms used (detailed)

Below are the data structure & algorithmic pieces used in the delivered code and the reasoning behind them.

### Queue for pipes

**What:** `utils.js` exposes a `Queue` class used to hold `Pipe` instances (the obstacles).
**Why:** Pipes are generated at the back, travel left, then get removed from the front as they go offscreen — a FIFO lifecycle matches a queue. The Queue clarifies intent and groups pipe lifecycle operations in one place.

**Implementation (simplified):**

```js
class Queue {
  constructor() { this.items = []; }
  enqueue(item) { this.items.push(item); }   // O(1)
  dequeue() { return this.items.shift(); }    // O(n) in JS arrays
  front() { return this.items[0]; }
}
```

**Complexity note:** JS `Array.shift()` is O(n) because it moves elements; this is acceptable for a small number of pipes (n usually ≤ 5). For a true O(1) front removal, implement a linked list / Deque (see Extensions).

**Per-frame operations:** update each pipe (`O(n)`), where `n` is number of visible pipes.

---

### Collision detection — AABB (Axis-Aligned Bounding Box)

**What:** Detect whether the bird and a pipe overlap using rectangle intersection logic. Bird is an axis-aligned rectangle (x, y, width, height) — same for pipes.

**Algorithm:**

```
if (bird.right > pipe.left &&
    bird.left < pipe.right &&
    (bird.top < pipe.gapTop || bird.bottom > pipe.gapBottom)) {
  collision = true;
}
```

**Complexity:** O(1) per pipe check. With n pipes, O(n) per frame.

**Why AABB?** It's fast, simple, and perfect for rectangular sprites in 2D games.

---

### Game loop and timings

**What:** `requestAnimationFrame()` drives rendering; pipe spawn is controlled by a frame counter (e.g., spawn every 150 frames). Bird physics (gravity & lift) update per-frame.

**Physics updates (per frame):**

* `bird.velocity += gravity`
* `bird.y += bird.velocity`
  This is a discrete Euler integration (simple, efficient). Time-step is implied by frame rate; constants are tuned for nice feel.

---

### Pipe generation (random with constraints)

**What:** Each pipe's gap position (`top`) is chosen randomly within `[50, canvasHeight - gap - 50]` so the gap is always reachable. The gap size itself is tuned (e.g., 190 px) to make gameplay fair.

**Why:** Randomization with constrained bounds avoids impossible pipe placements and ensures fairness. This is essentially *random sampling with clamped range*.

---

### Scoring & state machine (restart)

* Scoring increments when a pipe is passed (pipe.x + pipe.width < bird.x) and is O(1) check per pipe.
* Restart uses an in-memory state reset function (`initGame()` / `resetGame()`), not `location.reload()`. This demonstrates simple state management and avoids reloading assets.

---

## Advanced DSA extensions (recommended to show off skills)

Below are algorithmic features you can add to the repo to make it more DSA-heavy for a portfolio. Each includes a short description and complexity.

---

### Deque (true O(1) front & back)

**Why add:** Demonstrates implementing a low-level DSA (linked list Deque) for true O(1) enqueue/dequeue at both ends (better than `Array.shift()`).

**Simple approach (linked list):**

```js
class DequeNode { constructor(val){ this.val=val; this.next=null; this.prev=null; } }
class Deque {
  constructor(){ this.head=null; this.tail=null; this._size=0; }
  addRear(v){ /* O(1) */ }
  removeFront(){ /* O(1) */ }
  size(){ return this._size; }
}
```

**Complexity:** O(1) add/remove front or rear.

---

### BFS pathfinder — safe path prediction (grid graph)

**Why add:** Represent upcoming space as a coarse grid and run BFS from bird's cell to cells on the right. If BFS finds a safe path, show a ghost line — demonstrates graph traversal and practical BFS usage.

**Pseudocode:**

```
function findSafePath(startCell, targetCell, grid):
  queue = [startCell]; visited = set(startCell)
  while queue:
    cell = queue.shift()
    if cell == targetCell: return path
    for neighbor in neighbors(cell):
      if neighbor not visited and isSafe(neighbor): 
         visit & push
  return null
```

**Complexity:** O(V + E) where V is grid cells considered, E edges between them. Use coarse resolution to keep V small.

---

### Trie for secret input patterns / combos

**Why add:** Record sequences of flaps (e.g., UI inputs like `UUDD`) in a Trie, detect combos in O(k) where k is pattern length, and unlock power-ups.

**Complexity:** O(k) pattern insertion / detection.

---

### Dynamic Programming for combo scoring

**Why add:** Use DP to compute best achievable combo bonuses under constraints (for example, maximize score when combo bonuses depend on streak lengths). This shows ability to think about scoring as an optimization.

**Example:** if passing `k` pipes in a row gives a special bonus that depends on k, DP can compute cumulative best scores across a run.

---

### Priority queue / heap for scheduled events

**Use case:** schedule red pipes, bonuses, or powerups sorted by `x` or time. Use binary heap to keep next event in O(1) peek and O(log n) update.

---

### Segment tree / interval tree

**Use case:** if obstacles become many and you want to efficiently query “are there any obstacles overlapping y-range \[a,b] in x-range \[X1,X2]?” segment or interval trees can do range queries faster than scanning all pipes.

---

## Complexity analysis (summary)

Let `n` be the number of visible pipes (small, typically < 6–10).

* Per-frame update:

  * Bird physics: **O(1)**
  * Pipe updates: **O(n)** (move + draw)
  * Collision checks: **O(n)** (AABB per pipe)
  * Queue `dequeue()` using `Array.shift()` is **O(n)** when it happens, but amortized cost is acceptable for small n.

* Space: **O(n)** for pipes + O(1) for bird & score.

**Notes:** Replace Array.shift() with a Deque (linked list) for guaranteed O(1) front removal if you want algorithmic purity.

---

## How to extend / integrate the optional modules

* **Add Deque:** create a new `deque.js` with a linked list implementation and replace `Queue` usages.
* **Add pathfinder:** create `pathfinder.js`, expose `findSafePath(bird, pipes, gridSize)`, and call it once every N frames to compute a safe path; render a ghost line.
* **Add Trie & DP scoring:** create `patternTrie.js` and `comboScorer.js`; hook to key events and scoring logic.
* **Add difficulty scaling:** increase `pipe.speed` and decrease `pipe.gap` as `score` increases to show algorithmic parameter adaptation.

Each feature can be added modularly — follow the pattern used by `bird.js`, `pipe.js`, `game.js`.

---

## Testing & benchmarking notes

* Play on desktop to check fluidity — the game is tuned for \~60 fps rendering; rendering is throttled by `requestAnimationFrame`.
* If the game stutters: reduce canvas draw complexity (smaller pipe width / fewer draw ops) or lower canvas size.
* For algorithmic testing (e.g., BFS), measure runtime on coarse grid and tune grid size to balance accuracy vs performance.

---

## Why this is a good DSA portfolio piece

* Combines **gameplay** and **algorithmic thinking** — you get to explain why each data structure was chosen and analyze complexity on your README.
* Easy place to add and benchmark variants (Deque vs array-queue, BFS pathfinder, DP scoring, Trie pattern detection).
* Visual demo + code + algorithm analysis = strong GitHub project for interview discussions.

---

## License & credits

This project is provided as educational/demo code. You may use and modify it for your portfolio and learning. Add a license file (MIT is recommended) if you plan to publish publicly.

--
