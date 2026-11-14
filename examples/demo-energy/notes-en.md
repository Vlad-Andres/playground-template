# Energy on the Move: From Newton's Cradle to the Tesla Coil

Physics notes for ages 14–16. Three lectures. Throughout, g = 9.8 N/kg (the same as 9.8 m/s²).

The big idea of these notes: **energy is never created or destroyed — it moves.** It moves between stores (a pendulum), between objects (the balls of Newton's cradle) and between circuits (a Tesla coil). Each time, some of it spreads out into the surroundings as heat and sound.

---

## Lecture 1 — Energy Stores and the Pendulum

### 1.1 Energy stores

Energy is stored in different ways. When something happens, energy is transferred from one store to another.

| Store | Where you find it | Example |
|---|---|---|
| Kinetic | Anything that moves | A rolling football |
| Gravitational potential | Anything lifted above the ground | A ball held at the top of a slide |
| Elastic potential | Anything stretched or squashed | A stretched spring |
| Thermal | Anything warm | A cup of tea |
| Chemical | Food, fuel, batteries | A phone battery |
| Magnetic | Magnets and coils carrying current | Two magnets pushed together |
| Electrostatic | Separated electric charges | A charged balloon; a charged capacitor |

### 1.2 Two formulas

**Kinetic energy:** E_k = ½ · m · v²

- E_k = kinetic energy, in joules (J)
- m = mass, in kilograms (kg)
- v = speed, in metres per second (m/s)

**Gravitational potential energy:** E_p = m · g · h

- E_p = gravitational potential energy, in joules (J)
- m = mass, in kilograms (kg)
- g = gravitational field strength, 9.8 N/kg on Earth
- h = height above the lowest point, in metres (m)

Notice that doubling the speed gives **four times** the kinetic energy, because the speed is squared. Doubling the height only doubles the potential energy.

### 1.3 How a pendulum swings

A pendulum is a small heavy ball (the *bob*) on a string. Pull it to one side and let go. Frame by frame, this is what happens:

1. **At the release point** the bob is still and as high as it will go. All its energy is gravitational potential energy. Kinetic energy is zero.
2. **On the way down** the bob speeds up. Potential energy turns into kinetic energy.
3. **At the lowest point** the bob is moving fastest. All the energy is now kinetic. Potential energy is zero (we measure height from here).
4. **On the way up the other side** the bob slows down. Kinetic energy turns back into potential energy.
5. **At the other end** the bob stops for an instant at almost the same height it started from, then swings back.

If there were no air resistance and no friction at the pivot, the total energy would stay exactly the same forever: **E_p + E_k = constant.**

### 1.4 Worked example: speed at the bottom

A 0.20 kg bob is released 0.45 m above its lowest point. How fast is it moving at the bottom?

1. Potential energy at the start: E_p = 0.20 × 9.8 × 0.45 = **0.882 J**
2. At the bottom all of this is kinetic: ½ × 0.20 × v² = 0.882
3. v² = 0.882 ÷ 0.10 = 8.82
4. v = √8.82 ≈ **2.97 m/s**

Notice that the mass cancels out: v = √(2gh). A heavy bob and a light bob released from the same height reach the bottom at the same speed.

### 1.5 Energy at every point of the swing

For the same bob (0.20 kg, released from 0.45 m):

| Height above lowest point (m) | E_p (J) | E_k (J) | Total (J) | Speed (m/s) |
|---|---|---|---|---|
| 0.45 (release) | 0.882 | 0.000 | 0.882 | 0.00 |
| 0.30 | 0.588 | 0.294 | 0.882 | 1.71 |
| 0.225 (half way) | 0.441 | 0.441 | 0.882 | 2.10 |
| 0.10 | 0.196 | 0.686 | 0.882 | 2.62 |
| 0.00 (bottom) | 0.000 | 0.882 | 0.882 | 2.97 |

A useful way to picture this is two bars side by side, one for each store. As the bob swings, one bar shrinks exactly as much as the other grows, and the total stays the same.

### 1.6 Where does the energy go? Dissipation

A real pendulum slowly swings lower and lower. Each swing, a little energy is transferred to the thermal store of the air and the pivot, and some is carried away as sound. We say the energy is **dissipated**: it is still there, but spread out and no longer useful.

Suppose a pendulum keeps 95% of its energy on every swing. Because E_p = mgh, the highest point of each swing also drops to 95% of the one before:

| Swing number | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| Highest point (m) | 0.450 | 0.428 | 0.406 | 0.386 | 0.367 | 0.348 |

After about 14 swings the pendulum reaches only half its starting height.

### 1.7 How long does one swing take?

The **period** T is the time for one full swing, there and back. For small swings it depends only on the length L of the string:

T = 2π · √(L / g)

| Length L (m) | 0.25 | 0.50 | 1.00 | 2.00 |
|---|---|---|---|---|
| Period T (s) | 1.00 | 1.42 | 2.01 | 2.84 |

Two surprising results: the period does **not** depend on the mass of the bob, and for small swings it does **not** depend on how far you pull it back. To double the period, you need a string **four** times as long.

### 1.8 Practical: measuring the period of a pendulum

1. Tie a small heavy object to a string and hang it from a clamp so it can swing freely.
2. Measure the length from the pivot to the centre of the bob.
3. Pull the bob to one side by a small angle (less than about 10°) and let go — do not push.
4. Start a stopwatch as the bob passes the lowest point, and count 10 full swings.
5. Divide the total time by 10. Timing many swings makes your answer more accurate than timing one.
6. Repeat for at least four different lengths and plot period against length.

**Predict first:** if you swap the bob for one twice as heavy, will the period go up, go down or stay the same?

---

## Lecture 2 — Momentum and Newton's Cradle

### 2.1 Momentum

Momentum tells you how hard it is to stop a moving object.

**p = m · v**

- p = momentum, in kilogram metres per second (kg·m/s)
- m = mass, in kilograms (kg)
- v = velocity, in metres per second (m/s)

Momentum has a **direction**. We choose one direction as positive (for example, to the right) and the opposite direction as negative. A 0.10 kg ball moving at 1.0 m/s to the right has p = +0.10 kg·m/s. Moving to the left at the same speed, p = −0.10 kg·m/s.

### 2.2 Conservation of momentum

When objects collide, and no outside force acts on them, **the total momentum before the collision equals the total momentum after it.** This is always true, in every collision.

Kinetic energy is a different story. In some collisions it is kept, in others it is not:

| | Elastic collision | Inelastic collision |
|---|---|---|
| Total momentum | Conserved | Conserved |
| Total kinetic energy | Conserved | Some is transferred to heat, sound and changing shape |
| Objects after the collision | Bounce apart | May stick together or dent |
| Everyday example | Steel balls, snooker balls (almost elastic) | Two lumps of clay, a car crash |

### 2.3 Worked example: an inelastic collision

A 0.10 kg ball of clay moving at 1.0 m/s hits an identical ball of clay at rest, and they stick together.

1. Momentum before: 0.10 × 1.0 + 0.10 × 0 = 0.10 kg·m/s
2. After, the joined mass is 0.20 kg moving at speed v: 0.20 × v = 0.10, so v = **0.50 m/s**
3. Kinetic energy before: ½ × 0.10 × 1.0² = 0.050 J
4. Kinetic energy after: ½ × 0.20 × 0.50² = 0.025 J
5. Half of the kinetic energy (0.025 J) has gone into heating and squashing the clay.

### 2.4 Newton's cradle

A Newton's cradle is a row of identical steel balls, each hanging from two strings in a V shape so it can only swing in one line. The balls just touch each other when they hang still.

What you see:

- **Lift one ball and let go.** It hits the row and stops. The ball at the far end flies out, rises to almost the same height, swings back, and the process repeats. The middle balls hardly move.
- **Lift two balls together.** Two balls fly out at the other end.
- **Lift three balls of a five-ball cradle.** Three balls fly out — including the middle ball, which takes part in both groups.
- **Lift one ball on each side and release them together.** They both hit the row at the same time and both bounce back out.

The rule: **if n balls hit the row, n balls leave at the other end, at the same speed.** The push travels through the touching balls as a very fast squeeze, a little like a wave passing along a line of people.

### 2.5 Worked example: why not two balls at half speed?

Each ball has a mass of 0.10 kg. One ball is lifted 5.0 cm (0.050 m) and released.

1. Speed when it hits the row: v = √(2gh) = √(2 × 9.8 × 0.050) = √0.98 ≈ **0.99 m/s**
2. Momentum it brings: 0.10 × 0.99 = 0.099 kg·m/s
3. Kinetic energy it brings: ½ × 0.10 × 0.98 = 0.049 J

Now compare two possible outcomes:

| Outcome | Momentum after (kg·m/s) | Kinetic energy after (J) | Possible? |
|---|---|---|---|
| One ball leaves at 0.99 m/s | 0.10 × 0.99 = 0.099 | ½ × 0.10 × 0.98 = 0.049 | Yes — both conserved |
| Two balls leave at 0.495 m/s | 0.20 × 0.495 = 0.099 | ½ × 0.20 × 0.245 = 0.0245 | No — half the energy is missing |

Both outcomes conserve momentum, but only one also conserves kinetic energy. Steel balls collide almost elastically, so nature picks the outcome where both are conserved: one ball out.

### 2.6 What if the balls have different masses?

When one ball hits a single ball at rest in an elastic collision, the results depend on the masses. Here a moving ball at 1.0 m/s hits a 0.10 kg ball at rest:

| Moving ball's mass (kg) | Its speed after (m/s) | Target ball's speed after (m/s) |
|---|---|---|
| 0.05 (lighter) | −0.33 (bounces back) | 0.67 |
| 0.10 (equal) | 0.00 (stops dead) | 1.00 |
| 0.20 (heavier) | +0.33 (keeps going) | 1.33 |

Only when the masses are equal does the moving ball stop completely and hand over everything. That is why every ball in a Newton's cradle must have the same mass.

### 2.7 A real cradle runs down

In a real cradle each collision is only *almost* elastic. You hear a click every time — that sound is energy leaving. The balls also warm up very slightly and are never perfectly lined up. After some time the neat one-in, one-out pattern breaks down, and in the end all the balls swing together gently before stopping.

### 2.8 Practical: build a mini cradle

1. Lay two rulers or pencils across the gap between two stacks of books, about 10 cm apart, parallel to each other.
2. Take five identical beads or marbles with a hole (or glue a loop of thread to each).
3. Hang each ball from both rulers with a V of thread so it can only swing in one direction.
4. Adjust the threads until all balls hang at exactly the same height and just touch in a straight line.
5. Lift one ball and release it. Then try two. Record how many balls leave the other end and how many clicks you hear before the pattern breaks down.

**Predict first:** what will happen if you replace the middle ball with a ball of modelling clay?

---

## Lecture 3 — Resonance and Induction: From a Swing to the Tesla Coil

### 3.1 Natural frequency and resonance

Everything that can swing or vibrate has a **natural frequency** — the number of swings it makes per second when left on its own.

f = 1 / T

- f = frequency, in hertz (Hz)
- T = period, in seconds (s)

A playground swing with 2.0 m chains has a period of about 2.84 s, so its natural frequency is about 1 ÷ 2.84 ≈ 0.35 Hz.

**Resonance** happens when you push something at its natural frequency. Each push arrives at just the right moment and adds a little more energy, so the swings get bigger and bigger:

- Push once every 2.84 s, always as the swing starts moving away from you → the swing goes higher with every push.
- Push once every 2.0 s → some pushes help and some arrive while the swing is coming towards you and slow it down. The swing stays small.

A singer can shatter a wine glass the same way: if the note matches the glass's natural frequency, each sound wave pushes the glass a little more until it cracks.

### 3.2 Two pendulums that share their energy

Hang two identical pendulums from the same slack horizontal string. Start one swinging and hold the other still, then let go of it.

1. The first pendulum swings strongly; the second is still.
2. Tiny tugs travel along the string. Because both pendulums have the same natural frequency, the tugs make the second one swing more and more — resonance.
3. After a while the first pendulum is almost still and the second swings strongly. All the energy has moved across.
4. Then the process reverses, and the energy flows back. It keeps moving back and forth.

The weaker the link between the pendulums, the more swings it takes for the energy to move across — but it still moves completely, as long as both have the same length. If the lengths are different, only a little energy moves across.

Keep this picture in mind. A Tesla coil does exactly this, with electric circuits instead of pendulums.

### 3.3 Electromagnetic induction

Moving a magnet near a coil of wire makes a voltage across the coil. If the coil is part of a complete circuit, a current flows. This is **electromagnetic induction**. What a sensitive meter connected to the coil shows:

| What you do | What the meter shows |
|---|---|
| Push the magnet into the coil | Needle moves one way |
| Hold the magnet still inside the coil | Nothing — zero |
| Pull the magnet out | Needle moves the other way |
| Push the magnet in faster | Bigger movement |
| Use a coil with more turns | Bigger movement |
| Use a stronger magnet | Bigger movement |

The key word is **change**. A voltage is induced only while the magnetic field through the coil is changing.

### 3.4 The transformer

A transformer has two coils wound on the same iron core. An alternating current in the **primary** coil makes a magnetic field that keeps changing direction. This changing field passes through the **secondary** coil and induces an alternating voltage in it — no moving parts needed.

V_s / V_p = N_s / N_p

- V_p, V_s = voltages across the primary and secondary coils (V)
- N_p, N_s = numbers of turns on the primary and secondary coils

**Worked example (step-down).** A phone charger has 500 turns on its primary coil and 25 turns on its secondary. Mains voltage is 230 V.

V_s = 230 × 25 ÷ 500 = **11.5 V**

**Worked example (step-up).** A 12 V supply feeds a primary coil of 100 turns. The secondary has 10 000 turns.

V_s = 12 × 10 000 ÷ 100 = **1200 V**

An ideal transformer wastes no energy, so the power in equals the power out: V_p × I_p = V_s × I_s. If the phone charger draws 0.10 A from the mains, it takes in 230 × 0.10 = 23 W, so the secondary current is 23 ÷ 11.5 = **2.0 A**. Stepping the voltage up always steps the current down.

### 3.5 An electric pendulum

A capacitor connected to a coil makes an **LC circuit**, and it behaves like a pendulum:

| Pendulum | LC circuit |
|---|---|
| Bob lifted to one side | Capacitor fully charged |
| Gravitational potential energy | Energy in the capacitor's electric field |
| Bob moving fastest at the bottom | Largest current through the coil |
| Kinetic energy | Energy in the coil's magnetic field |
| Friction and air resistance | Resistance of the wires |
| Natural frequency set by the string length | Natural frequency set by the size of the capacitor and coil |

When the charged capacitor is connected to the coil, energy sloshes back and forth between the capacitor and the coil, and the current changes direction many thousands of times per second. Like a pendulum, it slowly dies away as the wires heat up.

### 3.6 The Tesla coil

A Tesla coil, invented by Nikola Tesla around 1891, puts all of these ideas together to make very high voltages and long, branching sparks.

How it works, step by step:

1. **Charging.** A transformer steps up the mains voltage to several thousand volts and charges a capacitor in the **primary circuit**.
2. **The switch.** A *spark gap* — two metal electrodes with a small air gap — acts as a switch. When the capacitor's voltage is high enough, the air in the gap suddenly conducts and a spark jumps across, closing the circuit.
3. **Ringing.** The capacitor and the primary coil (just a few turns of thick wire) now form an LC circuit. The current oscillates hundreds of thousands of times per second.
4. **Resonance.** Inside the primary sits the **secondary coil**: hundreds or thousands of turns of thin wire on a tall tube, with a metal dome or ring on top. It is tuned to the **same natural frequency** as the primary. The two coils are only loosely coupled — they share air, not an iron core — so, just like the two pendulums, energy moves across over several oscillations until almost all of it is in the secondary.
5. **Sparks.** Because the secondary has so many turns and is in resonance, the voltage at the top reaches hundreds of thousands of volts. The air near the dome breaks down and long purple sparks shoot out. Air begins to conduct at roughly 3000 V for every millimetre between two flat metal plates.
6. **Repeat.** The energy flows back and forth, some is lost in the spark gap and in the sparks, the spark gap stops conducting, and the capacitor charges again. This cycle repeats a hundred times or more every second, which is why a Tesla coil buzzes.

A Tesla coil also sends out a strong changing electric field. A fluorescent tube held near it glows without any wires connected — energy transferred through the air.

### 3.7 Transformer or Tesla coil?

| | Ordinary transformer | Tesla coil |
|---|---|---|
| Core | Iron, so the coils are tightly coupled | Air, so the coils are loosely coupled |
| Frequency | 50 Hz (mains) | Hundreds of kilohertz |
| Uses resonance? | No | Yes — both circuits are tuned to the same frequency |
| How the voltage is raised | Ratio of turns | Ratio of turns and resonance |
| Typical use | Chargers, power stations | Demonstrations, early radio experiments |

### 3.8 Safety

- **Never build or touch a Tesla coil or any circuit that uses mains electricity.** The charging transformer and capacitors can kill, and capacitors can stay charged after the power is switched off.
- High-frequency sparks can cause deep burns even when they do not seem to hurt at first.
- Tesla coils can interfere with electronics. Anyone with a pacemaker or other medical implant must stay well away.
- At school, Tesla coils are shown only by a teacher, behind a barrier, at a safe distance.
- With magnets and coils in the classroom: keep strong magnets away from phones and bank cards, and never connect a coil directly across a battery for long — it gets hot.

---

## Summary

- Energy is stored in different ways, and in every process it moves from store to store. The total stays the same, but some is always dissipated as heat and sound.
- E_k = ½mv² and E_p = mgh. A pendulum keeps swapping one for the other; its period depends only on its length.
- Momentum p = mv is conserved in every collision. Kinetic energy is conserved only in elastic collisions — which is why a Newton's cradle sends out exactly as many balls as you drop.
- Pushing at the natural frequency builds up large oscillations: resonance. Two tuned pendulums, or two tuned circuits, pass their energy back and forth.
- A changing magnetic field induces a voltage. Transformers use this with V_s / V_p = N_s / N_p; a Tesla coil adds resonance to reach hundreds of thousands of volts.
