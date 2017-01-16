# screeps-starter

> Hive AI [TypeScript](http://www.typescriptlang.org/) based [Screeps](https://screeps.com/) AI code.
>> A detailed description of the hive below.

## Getting Started

### Requirements

* [Node.js](https://nodejs.org/en/) (v4.0.0+)
* Gulp 4.0+ - `sudo npm install -g gulpjs/gulp.git#4.0`

### Installing npm modules

Then run the following the command to install the required npm packages and TypeScript type definitions.

```bash
$ npm install
```

### Running the compiler

```bash
# To compile your TypeScript files on the fly
$ npm start

# To deploy the code to Screeps
$ npm run deploy
```

You can also use `deploy-prod` instead of `deploy` for a bundled version of the project, which has better performance but is harder to debug.

`deploy-local` will copy files into a local folder to be picked up by steam client and used with the official or a private server.

## The Hive

### Civilization
- [ ] manager.goals
- [ ] manager.population
- [ ] manager.construction
- [ ] manager.workforce
- [ ] manager.combat
- [ ] manager.market

### Goals
- [ ] attack.room
- [ ] build.defenses
- [ ] defend.room
- [ ] dismantle.room
- [ ] mine.resources
- [ ] scout.room
- [ ] suppress.keepers
- [ ] transport.resources
- [ ] upgrade.controller

### Tasks
- [ ] attack.id
- [ ] attack.target
- [ ] upgrade
- [ ] dismantle
- [ ] dropoff
- [ ] follow
- [ ] harvest.energy
- [ ] harvest.mineral
- [ ] harvest.power
- [ ] heal
- [ ] move.find
- [ ] move.pos
- [ ] move.room
- [ ] move.xy
- [ ] pickup
- [ ] suppress.lair
- [ ] wait

### Building
- [ ] farm - defines the template and rules for placment [60]
- [ ] lab.military - keeps a moblie lab moving with the front lines to boost creeps that have been renewed after a death march
- [ ] lab.refineries - defines the template and rules for placment
- [ ] mine.energy - defines the template and rules for placment
- [ ] mine.mineral - defines the template and rules for placment
- [ ] mine.power - defines the template and rules for placment
- [ ] port - defines the template and rules for placment [1]
- [ ] road - uses route data to build roads on popular routes
- [ ] wall - uses node data to build ramparts and walls at hud nodes (muiple inputs and outputs)
- [ ] tower - defines the template and rules for placement [6]

### Combat
- [ ] squad - a small collection of units to accomplish a specific goal
- [ ] army - a collection of squads to conquer a room
- [ ] campaign - a army's attempt at capturing a room used for historical review and planning of new offences
- [ ] defcon - model a room's hostile activity to defencive preparance
- [ ] estimate - model an opponents combat strength
- [ ] efficiency - model unit, squad, and army efficiency used for tweets to body parts, model which boosts to apply, range vs mele raito, and death march
- [ ] simulation - model the outcome of an engagement between armies

### Economy
- [ ] efficiency - model energy, mineral, power efficiency in harvest
- [ ] energy - manages supply and demand for energy
- [ ] mineral - manages supply and demand for minerals
- [ ] power - find power sources, creates goals to harvest
- [ ] trade - creates deals on the market based on economics
- [ ] economics - analysis opponents markets to gauge supply and demand trends combined our economy

### Epochs
- [ ] levels - handles room progression moving from up the levels with transition steps {0 to 14} [ref](https://github.com/kasami/mastermind/blob/master/src/enums/roomlevel.ts)
- [ ] prediction - handles the prediction of opponents epochs

### Opponents
- [ ] diplomacy.combat - track past interactions with opponents to prediction future ones
- [ ] diplomacy.market - track market activity to gauge opponents supply and demand trends for economic modeling and planing trading

### Map
- [ ] map.nodes - create node maps for use in setup up nests, planning defences, marshalling troops, finding choke points, planning ambushes
- [ ] map.influence - for death, danager, buildings.
- [ ] map.terrain - move calculations based on body parts and tearin weighting to determine fatigue
- [ ] map.routes - tracks popular routes for road building

### Utilities
- [ ] analysis.cpu - allow for the tracking and reporting of cpu usage used for efficiency analysis
- [ ] report.console - report the state of the hive as a summary to the console
- [ ] log.console - screps logging framwork (Find One or Build One)
