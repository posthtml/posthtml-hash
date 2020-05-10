# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

<!--
## [1.0.0](https://github.com/metonym/posthtml-hash/releases/tag/v1.0.0) - 2020-05-09

- Replace `jest` with Node.js native `assert` (removes ~250k sub-dependencies) -->

## [0.3.0](https://github.com/metonym/posthtml-hash/releases/tag/v0.3.0) - 2020-05-04

- Support omitting CSS/JS files to hash in `options`

## [0.2.3](https://github.com/metonym/posthtml-hash/releases/tag/v0.2.3) - 2019-12-27

- Fix bug by omitting an error if the file does not exist (e.g. external URL)
  ([#22](https://github.com/posthtml/posthtml-hash/issues/22))

## [0.2.2](https://github.com/metonym/posthtml-hash/releases/tag/v0.2.2) - 2019-10-17

- Upgrade posthtml version from 0.11.16 to 0.12.0

- Upgrade hasha from 5.0.0 to 5.1.0

- Upgrade development dependencies (@types/jest, husky, prett-quick)

## [0.2.1](https://github.com/metonym/posthtml-hash/releases/tag/v0.2.1) - 2019-09-21

- Upgrade posthtml version from 0.11.15 to 0.11.16

- Refactor typings

## [0.2.0](https://github.com/metonym/posthtml-hash/releases/tag/v0.2.0) - 2019-08-26

- Rename existing hashed file instead writing to a new file

## [0.1.0](https://github.com/metonym/posthtml-hash/releases/tag/v0.1.0) - 2019-08-25

- Initial release
