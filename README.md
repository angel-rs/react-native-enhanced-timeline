![Library logo](https://i.ibb.co/98cFxzw/cover.png)

![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-native-enhanced-timeline?label=minified%20size)
![NPM](https://img.shields.io/npm/l/react-native-enhanced-timeline)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

`react-native-enhanced-timeline` is a fork of [`react-native-timeline-flatlist`](https://github.com/eugnis/react-native-timeline-flatlist) with some tweaks (functional components instead of classes & support for animations)

## 🔧 Installation

```sh
// Using yarn
yarn add react-native-enhanced-timeline --save

// Using npm
npm install react-native-enhanced-timeline --save
```

## Usage

```jsx
import { Timeline } from "react-native-enhanced-timeline";

export const App = () => {
  return (
    <Timeline
      data={[
        {
          id: 1,
          time: "09:00",
          title: "Event 1",
          description: "Event 1 Description",
        },
        {
          id: 2,
          time: "10:45",
          title: "Event 2",
          description: "Event 2 Description",
        },
        {
          id: 3,
          time: "12:00",
          title: "Event 3",
          description: "Event 3 Description",
        },
        {
          id: 4,
          time: "14:00",
          title: "Event 4",
          description: "Event 4 Description",
        },
        {
          id: 5,
          time: "16:30",
          title: "Event 5",
          description: "Event 5 Description",
        },
      ]}
    />
  )
}
```

## 📦 Peer dependencies

```
react-native-svg (only guaranteed to work with latest version)
```

## 📃 Documentation 

To be added, feel free to contribute!

## 🛣 Roadmap

- [ ] Tests
- [ ] Storybook
- [ ] Simplify codebase
- [ ] Documentation
- [ ] Examples / Recipes for ease-of-use
- [ ] Demo app

## 📝 License

[MIT](./LICENSE)