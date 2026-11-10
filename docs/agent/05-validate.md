# Validate and repair

Run from the template root:

```bash
npm run validate <content-directory>
CONTENT_DIR=<content-directory> npm run build
npm test
npm run lint
```

Fix errors by their reported code and path. Common cases:

- `E001`/`E003`: repair JSON syntax or schema shape.
- `E002`: add `course.json` or at least one lecture.
- `E102`/`E103`: repair concept and answer references.
- `E104`/`E105`: use a registered widget and valid props.
- `E106`: add the figure under `figures/`.
- `E107`: rename the lecture file to the required number-slug name.
- `E108`/`E109`: repair exercise or expected-topic references.
- `W201`: shorten new prose blocks; preserve source wording only when exact fidelity is required.

The build must produce generated JSON and a static `out/` directory. Inspect representative pages
after it succeeds. A warning is not permission to ignore an error; record intentional warnings in
the proof report.
