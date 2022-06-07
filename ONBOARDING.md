# Onboarding

Welcome to our onboarding document.

## Design

We are currently using Framer to setup this project. Check the following [link](https://framer.com/projects/UN-Radar-on-mobile--qrJuCdhqJOZbXUjm6Yf7-czGqg) to view it.

## Software development

Our project uses modern (as of 2021) [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/).

- We aim to use React in its Functional form, by leveraging `FunctionalComponents` and hooks

- Our project is tailored for UNDP AI Labs [UNDP Radar Application](https://github.com/SDG-AI-Lab/Digital_Technologies_Radar)

- There is a library which is responsible for all Radar logic [here](https://github.com/SDG-AI-Lab/Digital_Technologies_Radar_Lib)

### Learning resources

#### Learn React

- [Full Modern React Tutorial](https://www.youtube.com/playlist?list=PL4cUxeGkcC9gZD-Tvwfod2gaISzfRiP9d) (courtesy of Yashkumar Shiroya)

#### Learn TypeScript

- [React TypeScript tutorial](https://youtu.be/Z5iWr6Srsj8) (courtesy of Yashkumar Shiroya)

#### Learn our UI framework

- [Build a Modern User Interface with Chakra UI](https://egghead.io/courses/build-a-modern-user-interface-with-chakra-ui-fac68106) - don't forget to look through their [docs](https://chakra-ui.com/docs/getting-started) as well.

## Development process

1. We delegate time for a good discovery and design phase
2. With the design agreed upon we then create tasks in the relevant project
3. You are then expected to grab your task and move it along from 'todo' to 'in progress'
4. You should alwads branch off from `develop` branch and do a new `feature/x` ((`reafctor/x`, `improvment/x`, `fix/x` are good suggestions) branch, being `x` your new feature
5. After you are finished with your development, you must issue a PR to merge your `feature/x` branch into `develop`

We follow `gitlab` [git version control best practices](https://about.gitlab.com/topics/version-control/version-control-best-practices/). It is very simple really. Always branch from `develop` , merge your `feature/x` into `develop` . Merge `develop` into `master` once a clear Milestone is met.

## Style guide

We follow current default `React` styleguide and use prettier to prettify our code base. If you are using `Studio Code` have a look at this [resource](https://www.digitalocean.com/community/tutorials/code-formatting-with-prettier-in-visual-studio-code).
We might consider forcing "prettification" of the code base in the CI if these are not followed, but the goal is to be relaxed.
