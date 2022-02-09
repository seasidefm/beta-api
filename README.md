## Seaside API
This is a public repository, but the service itself is
not considered "public", so if you end up using this repo, best of luck!

### What is this?
This is a unified API interface to reduce the massive
pain points I have run into regarding syncing the many
services of SeasideFM.

At the time of creation, the bot project, the current song
checker, and the heat level checker ALL have direct database
connections. At this rate EVERY new feature will explicitly
modify _only one_ section of the DB. This is unsustainable,
especially considering this is not a full time gig, and I am
only one developer!

### How to run
- Populate .env
- Database: `docker-compose up`
  - Create a database named `devdb`
- Application:
  - First: `yarn && yarn migrate dev`
  - Then:  `yarn dev`