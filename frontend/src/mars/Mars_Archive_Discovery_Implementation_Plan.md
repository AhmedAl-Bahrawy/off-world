# Mars Archive Discovery --- Implementation Plan for the AI Coding Agent

## 0. Mission of This Plan

This document is the implementation specification for the existing Mars
web experience.

The goal is **not** to rebuild the project from scratch.

The goal is to evolve the current Mars platform-simulation into a
**story-driven discovery game** in which the player explores Mars,
encounters historical NASA hardware, investigates each artifact, unlocks
its story, and gradually understands:

1.  what the machine was,
2.  why NASA sent it,
3.  how it worked,
4.  what it discovered or demonstrated,
5.  why it mattered,
6.  what remains on Mars today.

The final experience should feel like one continuous adventure, not a
collection of unrelated information pages.

The Mars chapter is one part of a larger project. At the end of this
chapter, the experience must clearly communicate that the next
destination is **the Moon**.

------------------------------------------------------------------------

# 1. Product Thesis

## The core problem

The NASA challenge is not asking us merely to show historical facts.

It asks us to make school-age and casual space enthusiasts **discover
and understand the hardware and the science it made possible**.

The current implementation already has a strong foundation:

-   a playable Mars traversal,
-   three artifact families,
-   a retro/pixel visual language,
-   mission briefings,
-   collectibles,
-   checkpoints,
-   quizzes,
-   a completion state,
-   a persistent Zustand store,
-   a story data file,
-   responsive touch controls.

However, the current loop is still primarily:

> briefing → platforming → collect memories → quiz → next mission

That is fun, but it does not yet make the machines themselves the center
of the learning experience.

The new loop must become:

> arrive → discover artifact → investigate → unlock evidence →
> understand machine → interact with its story → test knowledge →
> archive the discovery → continue

The player should feel:

> "I found something."

then:

> "I understand what this thing does."

then:

> "I understand why it mattered."

------------------------------------------------------------------------


# 2. THE ACTUAL GAME DESIGN — HOW THE PLAYER PLAYS

## This section is the most important implementation specification

The AI coding agent must **not invent the gameplay**.

It must implement the interaction model described in this section.

The previous sections explain what the project should teach. This section defines **how the player physically experiences that learning**.

The experience is a game first, but the game mechanics exist to create discovery.

The player should never feel that they are walking through a website and occasionally clicking an information box.

The intended fantasy is:

> **"I am an alien explorer walking across Mars and figuring out what the strange machines left here were built to do."**

The player is not given the answer immediately.

They see clues, interact with physical parts of the environment, make small observations, recover records, and gradually construct an understanding of the machine.

---

## 2.1 The Player's Job

At every point in the Mars chapter, the player has one simple job:

> **Find the human machine, figure out what it was trying to do, and recover enough evidence to understand its story.**

The player therefore has four verbs:

1. **MOVE**
2. **INSPECT**
3. **DISCOVER**
4. **UNDERSTAND**

The platforming supports movement.

The artifact interactions support inspection.

The evidence system supports discovery.

The archive and knowledge checks support understanding.

Do not add mechanics that do not strengthen one of these four verbs.

---

# 2.2 The Moment-to-Moment Player Experience

The basic moment-to-moment loop must be:

```text
RUN
 ↓
NOTICE SOMETHING
 ↓
APPROACH
 ↓
INTERACT
 ↓
REVEAL A CLUE
 ↓
UNDERSTAND A SMALL PIECE
 ↓
LOOK FOR THE NEXT PIECE
 ↓
RECONSTRUCT THE MACHINE
 ↓
ARCHIVE IT
```

The player should spend most of their time **inside the Mars world**, not inside menus.

A useful target is:

- roughly 60–70% exploration/platforming,
- roughly 15–25% physical investigation,
- roughly 10–15% archive/knowledge interaction.

Do not interpret these as rigid analytics requirements. They are pacing guidance.

The key principle is:

> **The world should remain the primary screen.**

---

# 2.3 The Player Should Discover the Machine Before Learning Its Full Name

Do not start a mission by showing a large card saying:

> VIKING 1 — HERE IS EVERYTHING YOU NEED TO KNOW.

Instead, the player should encounter the object physically.

For example:

The player walks across the red terrain.

They see three legs partially visible through dust.

They see an antenna.

They see an old camera.

A small contextual marker appears:

```text
UNKNOWN HUMAN OBJECT
E  INSPECT
```

Only after pressing `E` does the game identify it:

```text
VIKING 1

LANDER / ORBITER

1976
```

Then:

```text
WHY WAS IT HERE?

Investigate the machine to find out.
```

This is the first important psychological beat.

The player has **found something**.

---

# 2.4 Exploration Is Not Just Walking Between Platforms

The current platforming system has gaps, platforms, checkpoints, shards, and a goal.

Keep that foundation.

However, the level should now contain three categories of space:

## A. Traversal Space

Normal platforming.

Purpose:

- movement,
- jumping,
- avoiding hazards,
- reaching the next area.

## B. Discovery Space

Small optional-looking areas containing evidence.

Purpose:

- reward curiosity,
- encourage looking around,
- hide pieces of the machine's story.

## C. Artifact Space

A larger landmark area centered around the machine.

Purpose:

- slow the player down,
- allow inspection,
- reveal the artifact,
- trigger the archive sequence.

The player should visually understand that an artifact area is different from normal terrain.

Do this through:

- silhouette,
- lighting,
- environmental framing,
- antennae,
- debris,
- old tracks,
- footprints,
- unusual geometry,
- small UI signals.

Do not rely only on a giant floating arrow.

---

# 2.5 The Player Must Have Reasons to Explore

Every mission should contain three layers of discovery.

### Layer 1 — Main Path

The player can complete the level by following the obvious route.

### Layer 2 — Evidence

The player can leave the main path to find evidence fragments.

### Layer 3 — Artifact Components

The player must inspect the important parts of the machine to fully archive it.

This creates:

```text
I can finish the level
        +
I want to understand the machine
        =
I explore more deeply
```

The player should never be punished harshly for missing an evidence fragment.

If they finish a traversal section without finding everything, the game should allow them to continue exploring the artifact archive rather than forcing a restart.

---

# 2.6 Evidence Is the Core Collectible

The existing `shards` should stop behaving like generic collectibles.

They become **evidence fragments**.

Each evidence fragment must answer a specific question.

Examples:

```text
EVIDENCE 01
"FIRST CONTACT"

Viking 1 landed successfully on July 20, 1976.
```

```text
EVIDENCE 02
"THE ARM"

A robotic arm collected Martian soil
and delivered samples to instruments inside the lander.
```

```text
EVIDENCE 03
"THE QUESTION"

Viking's biological experiments produced
results that were not sufficient to confirm life.
```

The player should never collect:

> +1 MEMORY

They should collect:

> **A PIECE OF THE STORY**

---

# 2.7 Evidence Should Be Found Through the Environment

Do not scatter evidence randomly in the air.

Attach evidence to environmental clues.

Examples:

### Viking

A small disturbed patch of soil:

> SAMPLE SITE

A nearby memory explains the robotic arm.

### Pathfinder

A strange circular imprint:

> LANDING TRACE

This reveals the airbag landing system.

### Sojourner

A tiny wheel track:

> ROVER TRACK

This leads the player toward Sojourner.

### Ingenuity

A flight path marker:

> FLIGHT RECORD

This reveals a flight from the mission archive.

The environment itself should communicate:

> **Something happened here.**

---

# 2.8 Interaction Prompt Rules

Use the existing `E` interaction concept.

The prompt must be contextual.

Examples:

```text
E  INSPECT
```

```text
E  EXAMINE TRACKS
```

```text
E  RECOVER RECORD
```

```text
E  OPEN ARCHIVE
```

Do not show all possible controls simultaneously.

Only show the action relevant to the object currently near the player.

The prompt should appear shortly before the interaction radius, not from across the level.

---

# 2.9 The Player Does Not Read a Wall of Text

Every interaction follows three information layers.

## Layer 1 — Discovery sentence

One short sentence.

Example:

> "This arm reached into Martian soil."

## Layer 2 — Explanation

Two to four short sentences.

Example:

> "Viking's robotic arm collected soil samples and delivered them to instruments inside the lander. This allowed scientists to analyze material without moving the entire spacecraft."

## Layer 3 — Deep archive

Optional.

The player can open the reconstructed archive to see:

- historical records,
- timeline,
- images,
- technical details,
- mission context.

This means a younger player can understand the idea quickly, while a curious player can keep digging.

---

# 2.10 The Artifact Investigation Screen

When the player has discovered an artifact, do not immediately replace the entire game with a generic information page.

Open a **field investigation panel**.

The Mars world should remain visible behind it.

The panel contains:

```text
┌───────────────────────────────────────┐
│ ARCHIVE ENTRY                         │
│                                       │
│ VIKING 1                              │
│ LANDER / ORBITER                      │
│                                       │
│ WHAT IS THIS?                         │
│ [short explanation]                   │
│                                       │
│ COMPONENTS                            │
│ [Camera] [Sample Arm] [Weather]       │
│ [Biology Lab] [Power]                 │
│                                       │
│ EVIDENCE  3 / 5                       │
│                                       │
│ [OPEN RECOVERED RECORDS]              │
└───────────────────────────────────────┘
```

The player can close the panel and return to exactly where they were.

Do not navigate them to a new route unless the existing application architecture requires it.

---

# 2.11 Components Are the Main Learning Mechanic

Each major artifact must be divided into meaningful physical components.

The player learns the machine by interacting with its parts.

This is more important than simply displaying a 3D model.

## Viking 1 component interaction

The player should be able to inspect:

1. camera,
2. robotic sampling arm,
3. biology laboratory / sample processing,
4. weather instruments,
5. RTG power system.

Each component should reveal:

- what it physically did,
- why it was necessary,
- what kind of information it enabled.

## Pathfinder component interaction

Inspect:

1. parachute/entry system,
2. airbags,
3. lander,
4. deployment ramp,
5. Sojourner,
6. science instruments.

The player must understand:

> Pathfinder delivered Sojourner.

## Ingenuity component interaction

Inspect:

1. rotor blades,
2. solar panel,
3. battery/power system,
4. navigation camera,
5. landing gear,
6. flight-control system.

The player must understand:

> Every part exists because flying on Mars is difficult.

---

# 2.12 Do Not Turn Components Into a Checklist

The player should not simply click five buttons:

```text
[1]
[2]
[3]
[4]
[5]
```

Instead, components should be discovered spatially.

For example:

```text
PLAYER
  ↓
sees helicopter
  ↓
approaches rotor
  ↓
inspects rotor
  ↓
learns about thin atmosphere
  ↓
looks at solar panel
  ↓
learns about energy
  ↓
looks at navigation camera
  ↓
learns how the helicopter knows where it is
```

The physical layout creates the learning sequence.

---

# 2.13 Each Artifact Needs a "Mechanical Question"

The player should investigate each machine through one central question.

## Viking 1

> **How can a machine on Mars search for evidence about the planet and possible life?**

## Pathfinder

> **How can humans land a machine safely and then send a smaller machine out to explore?**

## Ingenuity

> **How can an aircraft fly in Mars' extremely thin atmosphere?**

Every interaction should help answer the central question.

If an interaction does not help answer it, it is optional flavor and should not consume major development time.

---

# 2.14 Artifact-Specific Gameplay

The three artifact families should NOT play identically.

They share the same archive system, but the physical interaction changes.

---

# 2.15 VIKING GAMEPLAY — "WAKE THE SLEEPER"

Viking should feel slow, mysterious, and investigative.

## Step 1 — Approach

The player crosses a quiet Martian plain.

They see the Viking silhouette.

No large title appears.

A small prompt:

```text
UNKNOWN HUMAN MACHINE

E  INSPECT
```

## Step 2 — Identify

After interaction:

```text
VIKING 1

1976

It came here to study Mars.
But what was it actually looking for?
```

The player is given a question, not a lecture.

## Step 3 — Search the site

The player moves around the lander.

They find:

- camera,
- arm,
- sample area,
- weather sensor,
- power system.

Each gives a clue.

## Step 4 — Soil investigation

The robotic arm becomes the first strong interaction.

The player activates a simple visual sequence:

```text
ARM EXTENDS
   ↓
SOIL SAMPLE
   ↓
SAMPLE MOVED
   ↓
LAB
```

Do not simulate engineering at a technically precise level.

The purpose is to make the function understandable.

## Step 5 — Biology mystery

After collecting the biology evidence, show:

```text
THE RESULT WAS NOT SIMPLE.

Some experiments produced
interesting signals.

Other measurements did not confirm life.

The question remained open.
```

The player now understands the historical significance.

## Step 6 — Power discovery

The player discovers the RTG/power evidence.

This should answer:

> How could Viking operate for years?

## Step 7 — Archive

Only after the player has investigated the key parts should the archive become fully unlocked.

The player opens the recovered records.

## Step 8 — Knowledge check

Ask a reasoning question:

> Why did Viking need a robotic arm?

Correct answer:

> To collect Martian material and deliver it to instruments inside the lander.

The question should feel like the player is proving they understood the machine.

---

# 2.16 PATHFINDER GAMEPLAY — "THE BOUNCE"

Pathfinder should feel more physical and playful.

The key mechanic is **landing and deployment**.

## Step 1 — Discover landing evidence

The player encounters unusual marks in the terrain.

The game asks:

```text
WHY ARE THERE GIANT IMPACT MARKS HERE?
```

The player investigates.

## Step 2 — Airbag revelation

The archive reveals a short animation/sequence:

```text
PARACHUTE
   ↓
AIRBAGS INFLATE
   ↓
IMPACT
   ↓
BOUNCE
   ↓
STOP
```

The player should understand that Pathfinder survived through a completely different landing strategy.

## Step 3 — Physical mini-sequence

During the platforming section, introduce a temporary bounce mechanic inspired by the landing.

The player lands on designated inflated-airbag surfaces.

The purpose is not to create a realistic simulator.

The purpose is to make the concept memorable:

> **Pathfinder literally bounced onto Mars.**

## Step 4 — Find the lander

The player reaches Pathfinder.

Inspect:

- landing structure,
- camera,
- ramp.

## Step 5 — Deploy Sojourner

This is one of the most important playable moments in the entire Mars chapter.

The player activates the deployment sequence.

The ramp opens.

Sojourner rolls down.

The camera should follow it briefly.

Then the player can move again.

The player now visually understands:

> Pathfinder was the platform that delivered Sojourner.

## Step 6 — Follow the rover

The player follows Sojourner's tracks.

This changes the scale of the world.

The rover is tiny.

The player should see how much terrain it can investigate compared with the stationary lander.

## Step 7 — Science evidence

The player discovers:

- rock/soil analysis,
- rounded pebbles,
- weather information,
- Ares Vallis evidence.

The player learns that observations supported the idea of ancient flowing water.

## Step 8 — Archive

The Pathfinder archive becomes complete.

The Sojourner relationship should be visually obvious:

```text
PATHFINDER
   │
   └── delivered ──> SOJOURNER
```

---

# 2.17 INGENUITY GAMEPLAY — "TEACH A MACHINE TO FLY"

Ingenuity should be the most mechanically different chapter.

It introduces controlled vertical movement.

The existing `H` flight mode can be retained and upgraded.

## Step 1 — See the helicopter

The player approaches Ingenuity.

The first explanation should be:

> "This machine was built to fly."

Then:

> "But Mars has less than one percent of Earth's atmospheric density."

The player now has a problem to solve.

## Step 2 — Inspect the rotor

The player interacts with the rotor.

The game explains:

> "The blades must generate enough lift in an extremely thin atmosphere."

Keep this visual and concise.

## Step 3 — Inspect power

The player inspects the solar panel.

They learn:

> "The solar panel charges the batteries used for flight."

## Step 4 — Enter flight mode

The player presses/holds `H`.

The player gains temporary flight.

The flight should be intentionally limited.

Do not turn the whole game into free-flight.

The flight mode exists to teach:

- vertical movement,
- aerial perspective,
- navigation,
- battery limitations.

## Step 5 — Aerial scouting

The player reaches a high area that cannot be understood from the ground.

They see:

- terrain,
- possible route,
- archaeological/scientific point of interest.

This teaches why an aerial scout could help rover planners.

## Step 6 — Navigation

Introduce a simple navigation challenge.

The player must move through a short flight path using visible terrain features.

Do not make it a difficult arcade challenge.

The player should understand:

> The helicopter needs to understand where it is relative to the surface.

## Step 7 — Reveal the scale of the mission

The player discovers the original plan:

```text
EXPECTED

5 flights
```

Then the archive reveals:

```text
ACTUAL

72 flights
```

This should be a strong narrative reveal.

## Step 8 — Final flight

The player enters a short reconstruction of the final flight.

Do not make the player "win" the final flight.

The purpose is to understand the sequence:

```text
NAVIGATION CHALLENGE
        ↓
HARD LANDING
        ↓
ROTOR DAMAGE
        ↓
NO MORE FLIGHTS
```

The player then sees the archive record.

The emotional message is:

> **The flight ended. The knowledge continued.**

---

# 2.18 Failure Should Teach, Not Punish

The existing game has deaths and respawns.

Keep them.

But artifact investigation should not be reset because the player died.

For example:

If the player inspected Viking's sample arm and then falls into a gap:

- respawn at checkpoint,
- keep the discovered evidence,
- keep the component knowledge,
- continue.

Do not force the player to repeat educational content.

Platforming failure and knowledge progress should be separate.

This is critical.

---

# 2.19 The Game Should Have Two Kinds of Progress

## Physical Progress

Where the player is in the level.

Examples:

- checkpoint 1,
- artifact area,
- final platform,
- next mission.

## Knowledge Progress

What the player has discovered.

Examples:

- Viking camera understood,
- sample arm understood,
- biology result understood,
- Viking archived.

A player can fail physically while still progressing intellectually.

This makes the experience much less frustrating.

---

# 2.20 The "Aha" Moment

Every artifact needs one memorable moment.

## Viking

The player realizes:

> The machine wasn't just taking pictures. It was actually collecting and analyzing Martian soil.

## Pathfinder

The player realizes:

> The little rover came from the lander and was able to travel away from it.

## Ingenuity

The player realizes:

> This tiny helicopter actually flew on another planet where the air is incredibly thin.

These are the moments the design must protect.

Do not bury them under UI.

---

# 2.21 The Player Should See Cause and Effect

Whenever possible, use this pattern:

```text
PLAYER ACTION
      ↓
MACHINE RESPONSE
      ↓
EXPLANATION
      ↓
NEW UNDERSTANDING
```

Example:

```text
Press E on sample arm
      ↓
Arm moves toward soil
      ↓
"Collects Martian soil"
      ↓
Player understands why the arm exists
```

Another:

```text
Activate Sojourner deployment
      ↓
Ramp opens
      ↓
Rover rolls out
      ↓
Player understands lander → rover relationship
```

Another:

```text
Enter Ingenuity flight mode
      ↓
Helicopter rises
      ↓
Thin-atmosphere explanation appears
      ↓
Player understands the engineering challenge
```

This is more effective than presenting facts before the action.

---

# 2.22 Archive Interfaces Are Rewards for Understanding

The Twitter/Habbo-style interfaces should not be the first thing the player sees.

They are the **reward for discovery**.

The sequence should be:

```text
PHYSICAL DISCOVERY
      ↓
COMPONENT INVESTIGATION
      ↓
EVIDENCE
      ↓
ARCHIVE UNLOCK
      ↓
DEEPER STORY
```

This makes the archive feel earned.

---

# 2.23 Twitter-Style Archive Gameplay

The Twitter-style screen should not be a fake social-media feed that the player endlessly scrolls.

It should be a curated sequence of historical records.

The player receives a small set of posts/records.

Each record has a purpose.

Example:

```text
RECORD 01
MISSION BEGINS

Viking reaches Mars.
```

Then:

```text
RECORD 02
FIRST SURFACE WORK

The lander begins imaging and
environmental observations.
```

Then:

```text
RECORD 03
THE SAMPLE

The robotic arm collects soil.
```

Then:

```text
RECORD 04
THE QUESTION

Biological experiments produce
results that remain inconclusive.
```

The player can open individual records, but the interface should be short.

Do not create a social network.

Create a **historical evidence viewer wearing a social-media visual skin**.

---

# 2.24 Habbo-Style Archive Gameplay

The Habbo-style environment should be a small interactive museum.

The player can walk around.

Objects teach facts.

Example:

```text
[ROVER MODEL]
     ↓
Inspect
     ↓
"Sojourner was a 10.6 kg rover..."
```

Another:

```text
[AIRBAG DISPLAY]
     ↓
Interact
     ↓
"Pathfinder bounced more than 15 times..."
```

Another:

```text
[FLIGHT LOG]
     ↓
Interact
     ↓
"72 flights"
```

The room should contain a limited number of meaningful objects.

Do not create a giant empty room.

---

# 2.25 Archive Completion

When the player has enough knowledge, the artifact changes state.

Before:

```text
UNKNOWN
```

After first contact:

```text
IDENTIFIED
```

After component investigation:

```text
INVESTIGATED
```

After evidence:

```text
UNDERSTOOD
```

After knowledge check:

```text
ARCHIVED
```

This progression should be visible.

It gives the player a clear sense of accomplishment.

---

# 2.26 The Mars Archive Should Become the Player's Collection

At the end of the Mars chapter, the player should see a visual archive containing:

```text
┌────────────┐ ┌────────────┐ ┌────────────┐
│ VIKING 1   │ │ PATHFINDER │ │ INGENUITY  │
│ 1976       │ │ 1997       │ │ 2021–2024 │
│ ARCHIVED   │ │ ARCHIVED   │ │ ARCHIVED   │
└────────────┘ └────────────┘ └────────────┘
```

Clicking an archive entry should reopen its learned information.

This is important because the project is part of a larger experience.

The player should feel that they are building a collection of human exploration history.

---

# 2.27 The Player's Emotional Progression

The chapter should deliberately move through these emotions:

### Curiosity

"What is this?"

### Discovery

"Humans built this."

### Understanding

"Oh, THAT is why this part exists."

### Surprise

"They managed to do that on Mars?"

### Connection

"This machine was trying to answer a real question."

### Respect

"It worked far beyond the original expectation."

### Continuation

"What did humans leave on the Moon?"

This is the intended emotional arc.

---

# 2.28 Mission Pacing

A mission should have a rhythm.

Do not place:

```text
platforming
platforming
platforming
platforming
platforming
quiz
```

Instead:

```text
EXPLORE
 ↓
CLUE
 ↓
PLATFORM
 ↓
DISCOVERY
 ↓
PLATFORM
 ↓
COMPONENT
 ↓
EVIDENCE
 ↓
PLATFORM
 ↓
ARCHIVE
 ↓
KNOWLEDGE CHECK
```

The exact number of beats can vary, but the alternation is important.

The player should repeatedly switch between:

**movement → curiosity → action → understanding**

---

# 2.29 Do Not Over-Gamify the Science

Avoid unnecessary:

- XP systems,
- skill trees,
- weapon systems,
- combat,
- complex inventory,
- crafting,
- arbitrary currency,
- meaningless upgrades.

The player already has a strong motivation:

> **I want to know what this machine is.**

That is enough.

---

# 2.30 No Combat

The Mars chapter should not use combat as a primary mechanic.

The machines and the environment are the story.

Hazards can exist for platforming:

- gaps,
- terrain,
- dust,
- unstable areas,
- environmental obstacles.

But enemies should not distract from the historical artifacts.

---

# 2.31 No Traditional "Quest Marker Everywhere"

The game should guide through environmental storytelling.

Use:

- silhouettes,
- tracks,
- antennas,
- light,
- unusual terrain,
- sound,
- small UI prompts.

Use explicit markers only when the player genuinely needs help.

The player should feel that they found the machine rather than being told exactly where it is.

---

# 2.32 Camera and Presentation Rules

When an artifact is discovered:

1. briefly slow the camera,
2. center attention on the object,
3. reduce distracting UI,
4. play a small discovery cue,
5. show the interaction prompt,
6. let the player approach and inspect.

Do not trigger a long cinematic that takes control away from the player every time.

The player should remain the protagonist.

---

# 2.33 Sound Design as a Gameplay Tool

If the existing project supports sound later, use sound to distinguish discovery states.

Examples:

### Unknown artifact

Low electronic pulse.

### Evidence discovered

Short confirmation tone.

### Component understood

Mechanical confirmation sound.

### Archive unlocked

Distinct archive sound.

### Mars archive completed

A larger musical transition.

Do not make every collectible use the same sound.

---

# 2.34 Accessibility

The game must not depend entirely on color.

Discovery state should use:

- labels,
- icons,
- text,
- shape,
- animation.

Provide readable text and clear focus states.

The game should remain understandable without requiring extremely precise platforming.

If an interaction is essential to the educational progression, do not hide it behind an optional pixel-perfect jump.

---

# 2.35 The Exact Interaction Philosophy

The player should never ask:

> "What am I supposed to click?"

They should think:

> "What is that?"

Then:

> "What does this part do?"

Then:

> "Why did they need it?"

Then:

> "What did it discover?"

That chain is the core gameplay design.

---

# 2.36 Example: Complete 5-Minute Viking Sequence

This is the reference sequence the coding agent should use to understand the intended experience.

### 00:00–00:30

Player runs across Mars.

Small environmental clues appear.

No exposition.

### 00:30–00:50

Player sees Viking silhouette.

Prompt:

```text
UNKNOWN HUMAN MACHINE
E  INSPECT
```

### 00:50–01:10

Player identifies Viking 1.

Short explanation.

### 01:10–01:50

Player explores the lander.

Inspects camera.

Learns that the machine could see and document the surface.

### 01:50–02:30

Player finds sample-arm evidence.

Activates arm.

Sees a short soil-sampling animation.

Learns why the arm existed.

### 02:30–03:10

Player finds biology evidence.

Learns that the experiments produced interesting but inconclusive results.

### 03:10–03:40

Player discovers power system.

Learns about RTG power.

### 03:40–04:20

Archive unlocks.

Player opens reconstructed records.

The historical story becomes deeper.

### 04:20–04:50

Knowledge check.

One reasoning question.

### 04:50–05:00

Viking changes to:

```text
ARCHIVED
```

Player returns to Mars.

Next landmark becomes visible.

This is the target pacing model.

---

# 2.37 Example: Complete Pathfinder Sequence

```text
PLAYER SEES STRANGE LANDING MARKS
        ↓
INVESTIGATES
        ↓
LEARNS ABOUT AIRBAGS
        ↓
PLAYABLE BOUNCE SECTION
        ↓
DISCOVERS PATHFINDER
        ↓
INSPECTS LANDER
        ↓
ACTIVATES RAMP
        ↓
SOJOURNER DEPLOYS
        ↓
FOLLOWS ROVER TRACKS
        ↓
DISCOVERS SCIENCE EVIDENCE
        ↓
LEARNS ABOUT ANCIENT FLOWING WATER
        ↓
OPENS ARCHIVE
        ↓
KNOWLEDGE CHECK
        ↓
PATHFINDER ARCHIVED
```

---

# 2.38 Example: Complete Ingenuity Sequence

```text
PLAYER SEES SMALL HELICOPTER
        ↓
DISCOVERS ROTOR
        ↓
LEARNS WHY MARS FLIGHT IS HARD
        ↓
INSPECTS SOLAR PANEL
        ↓
LEARNS ABOUT POWER
        ↓
ENTERS FLIGHT MODE
        ↓
SHORT AERIAL SECTION
        ↓
USES TERRAIN TO NAVIGATE
        ↓
DISCOVERS ORIGINAL 5-FLIGHT PLAN
        ↓
REVEALS 72 FLIGHTS
        ↓
RECONSTRUCTS FINAL FLIGHT
        ↓
NAVIGATION CHALLENGE
        ↓
HARD LANDING
        ↓
ROTOR DAMAGE
        ↓
ARCHIVE
        ↓
KNOWLEDGE CHECK
        ↓
INGENUITY ARCHIVED
```

---

# 2.39 What the AI Agent Must NOT Do

The coding agent must not simplify the design into:

### Bad implementation

```text
walk to machine
↓
popup with 5 paragraphs
↓
click close
↓
walk to next machine
```

It must also not implement:

```text
collect 8 glowing shards
↓
quiz
↓
next level
```

without connecting those shards to the artifact.

It must not create nine unrelated mini-games.

It must not replace the existing Mars game with a static museum.

It must not make the Twitter/Habbo interfaces the main navigation.

It must not invent new game mechanics without a clear learning purpose.

It must not turn the player into a passive reader.

---

# 2.40 What the AI Agent SHOULD Build

The implementation should produce this experience:

```text
THE PLAYER MOVES
        ↓
THE PLAYER NOTICES
        ↓
THE PLAYER CHOOSES TO INVESTIGATE
        ↓
THE WORLD RESPONDS
        ↓
THE MACHINE REVEALS ITS FUNCTION
        ↓
THE PLAYER FINDS EVIDENCE
        ↓
THE PLAYER BUILDS A MENTAL MODEL
        ↓
THE ARCHIVE CONFIRMS THE STORY
        ↓
THE PLAYER PROVES UNDERSTANDING
        ↓
THE ARTIFACT BECOMES ARCHIVED
        ↓
THE PLAYER RETURNS TO THE WORLD
```

The player should feel that **they figured it out**.

That feeling is more important than the amount of text shown.

---

# 2.41 Implementation Priority

If development time is limited, implement gameplay in this exact priority:

### Priority 1 — Artifact encounter

The player can physically find and interact with the machine.

### Priority 2 — Component inspection

The player can inspect meaningful parts.

### Priority 3 — Evidence

The player can recover meaningful evidence.

### Priority 4 — Archive

The player can open the Twitter/Habbo-style historical interface.

### Priority 5 — Knowledge check

The player confirms understanding.

### Priority 6 — Artifact completion

The machine becomes archived.

### Priority 7 — Artifact-specific mechanics

Viking sampling, Pathfinder deployment/bounce, Ingenuity flight.

Do not spend time polishing secondary UI while Priority 1–3 are incomplete.

---

# 2.42 The Core Design Test

Before approving any implementation, play the Mars chapter and ask:

> **If I removed all the text, would the player still understand what they are supposed to investigate?**

If no, improve environmental signaling.

Then ask:

> **If I removed the quiz, would the player still have learned something?**

If no, the game is relying too heavily on the quiz.

Then ask:

> **Can the player explain what each machine did without opening a separate NASA website?**

If no, the archive/discovery system is insufficient.

Then ask:

> **Did the player perform an action that caused the learning?**

If no, the experience is still too passive.

The final goal is:

> **The player should learn because they played, not because they stopped playing and read.**

# 2. Current Project Audit

The supplied project contains:

-   `mars/MarsExperience.tsx`
-   `mars/story/missions.ts`
-   `mars/state/store.ts`
-   `mars/scene/MarsScene.tsx`
-   `mars/styles/mars.css`

## Existing architecture

### `MarsExperience.tsx`

This is currently only a wrapper around `MarsScene`.

Do not remove this architecture.

### `missions.ts`

This is the current story/data layer.

It contains 9 missions:

-   3 Viking missions
-   3 Pathfinder/Sojourner missions
-   3 Ingenuity missions

Each mission currently contains:

-   title
-   zone
-   subtitle
-   briefing
-   target
-   sprite
-   quiz
-   answers
-   correct answer
-   fact

This is a good starting point, but it is too small to support deep
artifact discovery.

### `store.ts`

The Zustand store currently tracks:

-   view
-   level
-   deaths
-   collected memories
-   quiz result

This should be extended rather than replaced.

### `MarsScene.tsx`

The current scene contains:

-   a canvas-based platform game,
-   player movement,
-   jumping,
-   checkpoints,
-   collectibles,
-   mission goals,
-   quizzes,
-   respawn,
-   game over,
-   completion,
-   touch controls,
-   mission-specific colors,
-   mission-specific sprites.

Important existing controls:

-   `A / D` --- move
-   `SPACE / W` --- jump
-   `SHIFT` --- sprint
-   `E` --- interact
-   `Q` --- relay/ping nearby hidden memories
-   `H` --- flight mode in later Ingenuity missions
-   `ESC` --- pause

Do not discard these mechanics.

Instead, make them serve the discovery narrative.

### `mars.css`

The existing visual system is already distinctive:

-   dark cinematic background,
-   amber/mint mission UI,
-   monospace typography,
-   pixel-art canvas,
-   glass-like briefing panels,
-   subtle grain,
-   mission transitions,
-   responsive controls.

Preserve this visual identity.

------------------------------------------------------------------------

# 3. The Three Main Artifact Families

The Mars chapter should remain organized around exactly three primary
historical witnesses.

## Artifact 01 --- Viking 1

### Player understanding target

The player should understand that Viking 1 was not simply "an old
lander."

It was a complex Mars exploration system containing:

-   an orbiter,
-   a lander,
-   imaging systems,
-   atmospheric/weather instruments,
-   a robotic sampling arm,
-   a biological laboratory,
-   chemical analysis instruments,
-   a power system designed for long-duration surface operation.

### Core learning ideas

The player must learn:

-   Viking 1 landed in 1976.
-   It was designed to study Mars and investigate the possibility of
    life.
-   Its robotic arm collected Martian soil.
-   The biological experiments produced an important but inconclusive
    story.
-   Viking used radioisotope thermoelectric generators for surface
    power.
-   Viking returned images and environmental measurements.
-   Its observations helped characterize Mars as a cold, dry world and
    provided evidence relevant to its wetter ancient past.

### Best interactive metaphor

**"Wake the old laboratory."**

The player approaches the lander.

The machine is visually dormant.

The player activates different parts of the lander one by one:

1.  camera,
2.  weather sensors,
3.  robotic arm,
4.  sample laboratory,
5.  power system.

Each activation reveals one piece of the story.

------------------------------------------------------------------------

# 4. Artifact 02 --- Mars Pathfinder

Treat Pathfinder as the second primary artifact family.

Sojourner is a major sub-artifact inside this family, not a separate
chapter.

## Player understanding target

The player should understand that Pathfinder was important because it
demonstrated a new way to land on Mars and deploy a small rover.

The experience should make the player understand the relationship:

> Pathfinder = lander/platform

> Sojourner = rover deployed by Pathfinder

### Core learning ideas

The player must learn:

-   Pathfinder landed in Ares Vallis in 1997.
-   It used a parachute and airbags to survive landing.
-   The landing system was a major technology demonstration.
-   Sojourner was deployed from the lander.
-   Sojourner carried scientific instruments.
-   Pathfinder returned a large amount of imagery and
    environmental/scientific information.
-   Observations at Ares Vallis provided evidence consistent with
    ancient flowing water and a wetter Martian past.

### Best interactive metaphor

**"Survive the landing, then release the rover."**

The player first experiences the landing system.

Then the player discovers the lander.

Then the player activates the ramp.

Then Sojourner rolls out.

The player follows Sojourner and learns why a small rover could do
things a stationary lander could not.

------------------------------------------------------------------------

# 5. Artifact 03 --- Ingenuity Mars Helicopter

## Player understanding target

The player must understand that Ingenuity was not primarily sent as a
conventional science rover.

It began as a technology demonstration:

> Can a powered, controlled aircraft fly in the extremely thin Martian
> atmosphere?

Then the mission exceeded its original expectations and became an
operational/aerial scouting demonstration.

### Core learning ideas

The player must learn:

-   first powered, controlled flight on another planet,
-   first flight on April 19, 2021,
-   final flight on January 18, 2024,
-   72 total flights,
-   the original plan was only a small number of
    technology-demonstration flights,
-   Ingenuity became useful as an aerial scout,
-   its navigation depended on visual features on the Martian surface,
-   its final flight involved a hard landing and rotor damage,
-   the helicopter remains on Mars as a historical artifact.

### Best interactive metaphor

**"Teach a machine to fly where almost no air exists."**

The player first sees the helicopter.

Then they learn why flight is difficult on Mars.

Then they activate flight mode.

Then they explore aerial navigation.

Then they discover the final-flight archive.

The ending should feel reflective rather than tragic:

> "The mission ended. The knowledge did not."

------------------------------------------------------------------------

# 6. The New Core Gameplay Loop

Every artifact must follow the same recognizable learning pattern.

## Phase A --- Encounter

The player sees the artifact before receiving a large information dump.

Example:

> A strange machine is partially buried in the red dust.

A short visual cue appears:

**UNKNOWN HUMAN-MADE OBJECT**

The player approaches.

## Phase B --- First Contact

Press `E`.

The game reveals:

-   artifact name,
-   mission year,
-   artifact type,
-   one-sentence purpose.

Do not reveal everything yet.

Example:

> VIKING 1\
> Mars lander / orbiter\
> Arrived in 1976\
> Purpose: investigate Mars and search for signs of life.

## Phase C --- Investigation

The artifact becomes an interactive object.

The player can inspect 3--5 important components.

Each component gives a short explanation.

Examples for Viking:

-   camera,
-   sample arm,
-   biology laboratory,
-   weather package,
-   RTG power.

Examples for Pathfinder:

-   airbags,
-   lander,
-   ramp,
-   Sojourner,
-   science instruments.

Examples for Ingenuity:

-   rotor blades,
-   solar panel,
-   navigation camera,
-   battery,
-   landing system.

## Phase D --- Evidence

The player finds a historical "memory."

A memory should not simply say:

> "Ingenuity flew 72 times."

Instead it should present evidence.

Example:

> ORIGINAL PLAN\
> A handful of test flights.

Then later:

> ACTUAL RESULT\
> 72 flights.

This creates discovery.

## Phase E --- Archive Interface

After discovering enough evidence, unlock the external-looking archival
interface.

This is where the supplied Twitter and Habbo-style design projects are
used.

These interfaces should feel like **in-world historical artifacts**, not
external websites.

Important:

-   do not require a real social-media account,
-   do not send the player outside the game,
-   do not depend on a live third-party website,
-   reproduce the supplied designs as part of the experience,
-   keep all educational content inside the project.

## Phase F --- Knowledge Check

The player receives a short interactive question.

The question must test understanding rather than memorization.

Bad:

> What year was Viking 1 launched?

Better:

> Why did Viking need a robotic arm?

Best:

> You need to study Martian soil without moving the entire lander. Which
> part of Viking makes that possible?

The answer should connect directly to the machine the player just
explored.

## Phase G --- Archive Unlock

After successful discovery, unlock a permanent artifact card:

**ARCHIVE ENTRY UNLOCKED**

It should show:

-   artifact,
-   mission,
-   purpose,
-   key technology,
-   major discovery/demonstration,
-   current status,
-   one memorable fact.

## Phase H --- Continue

The player returns to the Mars landscape.

The world should subtly change.

The artifact is now marked as:

**UNDERSTOOD / ARCHIVED**

The player continues toward the next historical witness.

------------------------------------------------------------------------

# 7. Story Structure

The entire Mars chapter should feel like one continuous investigation.

## Opening

The player arrives on Mars as an alien explorer.

The player's civilization knows Mars exists, but does not understand the
strange human objects scattered across the planet.

The central mystery is:

> "Who came here before us, and what were these machines trying to
> learn?"

Do not make humans the enemy or create unnecessary conflict.

The emotional framing should be curiosity.

## Act 1 --- The Old Witness

The player encounters Viking 1.

Theme:

> Humanity was looking for answers about Mars and possibly life.

## Act 2 --- The Small Pioneer

The player encounters Pathfinder.

Theme:

> Humanity learned how to land differently and send a moving robot.

Sojourner becomes the memorable character/object inside this act.

## Act 3 --- The Machine That Flew

The player encounters Ingenuity.

Theme:

> Humanity did not just drive on Mars. It learned to fly there.

## Final Mars Archive

The three witnesses appear in a single visual archive.

Show:

-   Viking 1
-   Pathfinder / Sojourner
-   Ingenuity

Then summarize:

> Different machines.\
> Different decades.\
> One continuous attempt to understand Mars.

Finally:

**NEXT DESTINATION: THE MOON**

The Moon should be presented as the continuation of the same archive,
not as a disconnected new game.

------------------------------------------------------------------------

# 8. How to Use the Existing Nine Missions

Do not delete the existing nine-mission structure.

Refactor it into three chapters with three discoveries each.

## Viking chapter

### Mission 1 --- Encounter

Current idea: `CHRYSE PLANITIA`

New purpose:

-   find Viking 1,
-   identify the machine,
-   understand why it was sent.

### Mission 2 --- Investigation

Current idea: `THE SAMPLE ARM`

New purpose:

-   investigate the sample arm,
-   discover the biology experiment,
-   understand the life-search story.

### Mission 3 --- Power and Survival

Current idea: `THE LONG WINTER`

New purpose:

-   discover the RTG power system,
-   understand why long-duration power mattered,
-   complete Viking archive.

## Pathfinder chapter

### Mission 4 --- Landing

Current idea: `FIFTEEN BOUNCES`

New purpose:

-   experience the airbag landing idea,
-   understand why Pathfinder bounced,
-   unlock landing-system evidence.

### Mission 5 --- Rover Deployment

Current idea: `THE ROVER STANDS UP`

New purpose:

-   activate the ramp,
-   release Sojourner,
-   understand lander/rover cooperation.

### Mission 6 --- Science

Current idea: `WARM AND WET`

New purpose:

-   inspect evidence from Ares Vallis,
-   understand how rocks and environmental observations reveal ancient
    water,
-   complete Pathfinder archive.

## Ingenuity chapter

### Mission 7 --- First Flight

Current idea: `THE WRIGHT BROTHERS MOMENT`

New purpose:

-   explain why Mars flight is difficult,
-   activate flight mode,
-   demonstrate aerial exploration.

### Mission 8 --- 72 Flights

Current idea: `SEVENTY-TWO FLIGHTS`

New purpose:

-   show how the mission grew beyond its original plan,
-   introduce aerial scouting,
-   reveal the flight-log evidence.

### Mission 9 --- Final Flight

Current idea: `THE LAST FLIGHT`

New purpose:

-   reconstruct the final flight,
-   teach the navigation/terrain challenge,
-   reveal the damaged rotor and mission conclusion,
-   preserve the machine's legacy.

------------------------------------------------------------------------

# 9. The Archive Interfaces

## Twitter-style interface

The supplied Twitter design should become a fictionalized historical
archive interface.

The user should feel like they discovered an old communication record.

The interface should contain:

-   artifact name,
-   date,
-   short historical post,
-   image/media area,
-   replies or related records,
-   mission tags,
-   "archive recovered" indicator.

Do not turn it into a generic social-media clone.

Every post must answer one useful question about the machine.

Example progression:

### Viking

Post 1: \> We have reached Mars.

Post 2: \> The lander is collecting its first soil sample.

Post 3: \> The experiment has produced an unexpected result.

Post 4: \> The data continues to teach us about the planet.

The exact copy must be based on verified NASA material.

## Habbo-style interface

The supplied Habbo design should be treated as an interactive
museum/archive room.

The room can contain:

-   artifact sprite/model,
-   labeled components,
-   information terminals,
-   collectible evidence,
-   mission timeline,
-   interactive objects.

The player should physically walk through the information.

Do not use the interface simply as decoration.

Every clickable object should teach something.

------------------------------------------------------------------------

# 10. The Most Important UX Rule

Never make the player repeatedly leave the game to learn.

The sequence should be:

**Explore the world → discover the machine → open archive → learn →
close archive → continue exploring**

The player should always know:

1.  where they are,
2.  what they found,
3.  why it matters,
4.  what they still need to discover.

------------------------------------------------------------------------

# 11. Required Data Model Upgrade

Expand the mission data model.

The current structure is too small.

Add concepts similar to:

``` ts
type ArtifactComponent = {
  id: string;
  name: string;
  shortLabel: string;
  description: string;
  learningPoint: string;
  sprite?: string;
};

type ArchiveRecord = {
  id: string;
  type: "twitter" | "habbo" | "field-note";
  title: string;
  date?: string;
  body: string;
  image?: string;
  tags?: string[];
};

type Artifact = {
  id: string;
  name: string;
  type: string;
  era: string;
  location: string;
  purpose: string;
  legacy: string;
  status: string;
  components: ArtifactComponent[];
  archiveRecords: ArchiveRecord[];
  keyFacts: string[];
};

type Discovery = {
  id: string;
  title: string;
  artifactId: string;
  evidence: string;
  explanation: string;
};
```

The exact TypeScript shape may be adapted to the existing architecture.

Do not create unnecessary abstractions.

The important requirement is that educational content lives in data
rather than being hard-coded into the rendering logic.

------------------------------------------------------------------------

# 12. State Management Requirements

Extend the existing Zustand store.

Track at minimum:

-   discovered artifact IDs,
-   inspected component IDs,
-   unlocked archive records,
-   completed learning checks,
-   completed artifact chapters,
-   current discovery step.

Do not destroy the current mission state.

The game should be able to answer:

> Has the player actually learned/discovered this artifact?

rather than only:

> Did the player reach the end of the level?

------------------------------------------------------------------------

# 13. Interaction Requirements

Use the existing `E` key for contextual interaction.

When near a discoverable object:

-   show a small interaction prompt,
-   identify the object,
-   allow `E` to inspect it.

Example:

**VIKING 1 --- SAMPLE ARM**

`E  INSPECT`

After inspection:

**SAMPLE ARM**

> This arm collected Martian soil and delivered samples to instruments
> inside the lander.

Then provide:

**OPEN ARCHIVE**

or:

**KEEP EXPLORING**

The player should never be forced into a long reading screen
immediately.

------------------------------------------------------------------------

# 14. Learning Design Rules

Every piece of information must answer at least one of these questions:

### What is it?

Identity.

### Why was it sent?

Mission purpose.

### How did it work?

Engineering.

### What did it find or demonstrate?

Science/technology result.

### Why does it matter?

Legacy.

If a piece of text answers none of these, remove it.

------------------------------------------------------------------------

# 15. Keep Text Short on the Main Screen

School-age users should not be confronted with a wall of technical text.

Use layers.

## Layer 1 --- One sentence

Example:

> Viking 1 used a robotic arm to collect Martian soil.

## Layer 2 --- Short explanation

2--4 sentences.

## Layer 3 --- Archive

Detailed timeline, posts, diagrams, or technical information.

This gives casual users an easy path while still allowing curious users
to go deeper.

------------------------------------------------------------------------

# 16. Artifact UI Concept

When an artifact is discovered, use a consistent panel.

## Header

`ARCHIVE ENTRY`

## Identity

`VIKING 1`

`LANDER + ORBITER`

## Purpose

One sentence.

## Components

Small interactive component list.

## Evidence

Collected memories.

## Archive

Twitter/Habbo-style historical interface.

## Knowledge Check

One question.

## Status

`DISCOVERED`

or

`ARCHIVED`

This consistency is important because the Mars chapter should feel like
one coherent system.

------------------------------------------------------------------------

# 17. Collectibles Must Become Meaningful

The existing eight `shards` currently function mostly as collectibles.

Convert them into **evidence fragments**.

Instead of generic memories, each collectible should represent something
meaningful:

### Viking evidence

-   first landing image,
-   soil sample,
-   weather reading,
-   biology experiment,
-   RTG/power clue,
-   mission timeline.

### Pathfinder evidence

-   airbag landing,
-   Ares Vallis terrain,
-   Sojourner deployment,
-   rock/soil analysis,
-   weather observations,
-   mission data.

### Ingenuity evidence

-   first flight,
-   thin atmosphere,
-   navigation camera,
-   aerial scouting,
-   72-flight record,
-   final-flight evidence.

The player should understand why each fragment exists.

------------------------------------------------------------------------

# 18. Do Not Make the Quiz the Main Teacher

The quiz should confirm learning.

It should not be the only moment where the player sees the important
fact.

Bad flow:

> play → quiz → answer reveals fact

Better flow:

> explore → inspect → read evidence → understand → quiz confirms it

------------------------------------------------------------------------

# 19. Accuracy Rules

Use NASA material as the source of truth for factual content.

Do not invent:

-   mission events,
-   dates,
-   discoveries,
-   instrument capabilities,
-   quotes,
-   social-media posts presented as real,
-   fictional NASA communications presented as historical fact.

If a UI element is fictionalized, make its framing clear.

For example:

> Reconstructed Archive

or

> Mission Record

The supplied NASA information should be verified against official NASA
material before final content is locked.

Important verified details for implementation:

-   Ingenuity's first powered, controlled flight was April 19, 2021.
-   Its final flight was January 18, 2024.
-   It completed 72 flights.
-   NASA announced the end of the mission on January 25, 2024.
-   The final flight involved rotor damage following a hard landing.
-   Viking 1 landed July 20, 1976.
-   Viking 1 used a robotic sampling arm and a biological laboratory.
-   Viking 1's lander used two SNAP-19 RTGs.
-   Pathfinder used a parachute and airbags for landing.
-   Sojourner was deployed from Pathfinder.
-   Pathfinder's observations provided evidence relevant to ancient
    flowing water at Ares Vallis.

Do not use an old simplified Ingenuity value if a newer official NASA
source gives a more accurate mission record.

------------------------------------------------------------------------

# 20. Important Ingenuity Content Correction

The existing mission text says:

> "One broken rotor blade ended the real mission."

This is directionally understandable but too simplified.

The final-flight story should be presented carefully.

The final flight encountered a navigation/landing problem over
relatively featureless terrain. The helicopter experienced a hard
landing and sustained rotor damage, after which it could no longer fly.

The UI should communicate:

> **Navigation challenge → hard landing → rotor damage → end of flight
> operations**

Do not portray it as a random crash.

This is much more educational because it connects the ending to how the
vehicle navigated on Mars.

------------------------------------------------------------------------

# 21. Visual Direction

Preserve the existing visual identity.

Do not replace the pixel-art Mars world with a generic modern dashboard.

The visual language should combine:

-   pixel-art exploration,
-   retro computer archive,
-   NASA mission documentation,
-   alien discovery,
-   cinematic Mars atmosphere.

## Three visual zones

### Viking

Mood:

-   old,
-   mysterious,
-   archival,
-   scientific.

### Pathfinder

Mood:

-   adventurous,
-   mechanical,
-   playful,
-   pioneering.

### Ingenuity

Mood:

-   futuristic,
-   airy,
-   experimental,
-   technological.

The colors already distinguish these zones. Preserve that approach.

------------------------------------------------------------------------

# 22. Avoid Repetitive Information Screens

Do not create nine identical popups.

Instead, vary the interaction slightly:

-   Viking: inspect components.
-   Pathfinder: activate landing system and deploy rover.
-   Ingenuity: flight/navigation interaction.

The underlying archive UI can remain consistent while the physical
interaction changes.

------------------------------------------------------------------------

# 23. The Alien Character's Role

The player is not just a platform-game character.

The alien is an investigator.

The character should behave as if they are discovering evidence left by
an earlier civilization.

This gives the project a strong narrative hook without inventing
fictional history about NASA.

The fictional layer is:

> alien discovers human artifacts.

The factual layer is:

> everything the alien learns about those artifacts comes from NASA
> mission history.

This separation is essential.

------------------------------------------------------------------------

# 24. Suggested Narrative Voice

Keep the writing concise, curious, and slightly mysterious.

Good:

> Something is buried here.

> It was built by humans.

> It arrived more than 50 years ago.

> Why would they send a machine this far?

Then reveal the answer through interaction.

Avoid:

> "Viking 1 was an orbiter/lander mission launched in 1975 with multiple
> instruments..."

That belongs in the archive layer.

------------------------------------------------------------------------

# 25. Implementation Strategy

## Step 1 --- Inspect before editing

The coding agent must inspect the existing project structure and
preserve it.

Do not recreate the project.

Do not replace the existing Mars scene with a new framework.

Do not introduce a second state-management system.

## Step 2 --- Extend the story data

Upgrade `missions.ts` into a richer content structure.

Keep the existing nine mission IDs/order so progression remains stable.

## Step 3 --- Extend Zustand

Add discovery state.

Keep existing mission/death/collection state.

## Step 4 --- Add artifact discovery UI

Build reusable components inside the Mars scene or nearby components
folder.

Possible components:

-   `ArtifactDiscoveryPanel`
-   `ArtifactComponentList`
-   `ArchiveViewer`
-   `KnowledgeCheck`
-   `ArtifactStatus`
-   `EvidenceCard`

Only create files when they improve maintainability.

## Step 5 --- Add contextual world interactions

Create artifact interaction zones in the existing canvas world.

Do not make every collectible a generic floating object.

## Step 6 --- Connect the archive interfaces

Use the supplied Twitter and Habbo-style design/source projects.

Do not redesign those interfaces from scratch unless required for
integration.

The agent should inspect those projects and reproduce the intended
visual language accurately.

## Step 7 --- Connect completion state

When all three artifact families are archived:

show the Mars archive.

Then show:

**NEXT DESTINATION --- THE MOON**

## Step 8 --- Test the entire flow

Test:

-   desktop,
-   mobile/touch,
-   keyboard,
-   restart,
-   death/respawn,
-   archive open/close,
-   mission transitions,
-   saved discovery state,
-   completion,
-   reduced motion,
-   missing image assets.

------------------------------------------------------------------------

# 26. File-by-File Instructions

## `mars/story/missions.ts`

Transform from a simple quiz list into the content source for:

-   artifact identity,
-   component descriptions,
-   evidence,
-   archive records,
-   questions,
-   facts,
-   completion state.

Keep mission order.

## `mars/state/store.ts`

Add:

-   discovered artifacts,
-   inspected components,
-   unlocked archive records,
-   completed checks.

Provide small actions:

-   `discoverArtifact`
-   `inspectComponent`
-   `unlockArchive`
-   `completeCheck`
-   `completeArtifact`

Use immutable state updates.

## `mars/scene/MarsScene.tsx`

Add:

-   artifact interaction detection,
-   discovery prompts,
-   archive opening,
-   component inspection,
-   evidence collection,
-   knowledge-check flow,
-   artifact completion.

Do not rewrite the movement engine unless necessary.

## `mars/styles/mars.css`

Add styles for:

-   discovery prompt,
-   artifact panel,
-   component list,
-   archive viewer,
-   evidence cards,
-   status badges,
-   knowledge check,
-   completion screen.

Keep the existing palette and typography.

## `mars/MarsExperience.tsx`

Keep the wrapper unless the existing application requires routing or
props changes.

------------------------------------------------------------------------

# 27. Completion Criteria

The implementation is complete only if all of the following are true.

## Narrative

-   The player understands why the alien is exploring Mars.
-   Viking, Pathfinder/Sojourner, and Ingenuity feel like one story.
-   The Moon is clearly established as the next chapter.

## Learning

For every primary artifact, the player can discover:

-   what it is,
-   why it was sent,
-   how an important part worked,
-   what it found/demonstrated,
-   why it mattered.

## Interaction

-   The player actively investigates artifacts.
-   The player does not only walk to a quiz.
-   Evidence fragments have meaning.
-   Archive interfaces are integrated into the game.

## Technical

-   Existing movement remains functional.
-   Existing mission progression remains functional.
-   Touch controls remain functional.
-   No broken state transitions.
-   No console errors.
-   No dead buttons.
-   No infinite overlays.
-   Restarting a mission resets only the appropriate mission state.
-   Completing the Mars chapter produces a clear transition to the Moon.

## Visual

-   New UI belongs to the existing Mars visual system.
-   No generic dashboard styling.
-   No inconsistent typography.
-   No unexplained UI elements.
-   No large text walls on the main exploration screen.

------------------------------------------------------------------------

# 28. Quality Bar for the AI Agent

Before considering the task finished, ask:

### Question 1

Could a player describe what Viking 1 actually did after playing its
chapter?

If not, improve the discovery sequence.

### Question 2

Could a player explain why Pathfinder had airbags?

If not, improve the landing interaction.

### Question 3

Could a player explain why Ingenuity was difficult to fly on Mars?

If not, improve the flight/navigation explanation.

### Question 4

Could the player explain the difference between Pathfinder and
Sojourner?

If not, improve the relationship between lander and rover.

### Question 5

Does the player feel like they discovered something?

If not, reduce exposition and increase interactive investigation.

### Question 6

Does the ending make the player curious about the Moon?

If not, strengthen the final transition.

------------------------------------------------------------------------

# 29. Final Experience Flow

The ideal complete Mars chapter is:

``` text
ALIEN ARRIVAL
      ↓
MARS LANDSCAPE
      ↓
UNKNOWN HUMAN ARTIFACT
      ↓
FIRST CONTACT
      ↓
VIKING 1
      ↓
INSPECT COMPONENTS
      ↓
RECOVER EVIDENCE
      ↓
ARCHIVE / TWITTER-STYLE RECORD
      ↓
KNOWLEDGE CHECK
      ↓
VIKING ARCHIVED
      ↓
PATHFINDER LANDING SYSTEM
      ↓
AIRBAG DISCOVERY
      ↓
PATHFINDER LANDER
      ↓
SOJOURNER DEPLOYMENT
      ↓
SCIENCE EVIDENCE
      ↓
PATHFINDER ARCHIVED
      ↓
INGENUITY
      ↓
WHY FLIGHT IS HARD ON MARS
      ↓
FIRST FLIGHT
      ↓
72-FLIGHT STORY
      ↓
FINAL FLIGHT / NAVIGATION EVIDENCE
      ↓
INGENUITY ARCHIVED
      ↓
MARS ARCHIVE
      ↓
"THREE MACHINES. ONE PLANET. DECADES OF DISCOVERY."
      ↓
NEXT DESTINATION: THE MOON
```

------------------------------------------------------------------------

# 30. Non-Negotiable Principle

The project should never become:

> **a platformer with NASA facts attached to it.**

It should become:

> **an exploration game in which the platforming is the way the player
> physically discovers the history of the machines.**

The machines are the protagonists.

The landscape is the archive.

The collectibles are evidence.

The Twitter/Habbo-style interfaces are recovered records.

The quizzes are confirmation.

The alien is the investigator.

And the Mars chapter is the first part of a much larger journey through
the history of human exploration.
