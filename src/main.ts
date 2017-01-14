// import { log } from "./components/support/log";
import * as Config from "./config/settings";

// Any code written outside the `loop()` method is executed only when the
// Screeps system reloads your script.
// Use this bootstrap wisely. You can cache some of your stuff to save CPU.
// You should extend prototypes before the game loop executes here.

// This is an example for using a config variable from `config.ts`.
if (Config.USE_PATHFINDER) {
  PathFinder.use(true);
}

// log.info("load");

/**
 * Screeps system expects this "loop" method in main.js to run the
 * application. If we have this line, we can be sure that the globals are
 * bootstrapped properly and the game loop is executed.
 * http://support.screeps.com/hc/en-us/articles/204825672-New-main-loop-architecture
 *
 * @export
 */
export function loop() {
  clearDeadCreepsMemory();

  /*
  for (let i in Game.rooms) {
    let room: Room = Game.rooms[i];
    processRoom(room);
  }
  */
}

/**
 * Clears any non-existing creep memory.
 */
function clearDeadCreepsMemory(): void {
  for (let name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
    }
  }
}
