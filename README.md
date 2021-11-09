# Smart Back

## Motivation

A lot of smartphones have smart gestures, but not all. Browser helps to deliver the same functionality on almost any device. Using smart gestures on the web can be a good idea. Also, we have possibility to customize display and behavior.

## How to use

Install SmartBack

```shell
npm i smart-back
```

Import styles

```js
import "smart-back/dist/smart-back.min.css";
```

Import SmartBack

```js
import SmartBack from "smart-back";
```

Create SmartBack instance

```js
const smartBack = new SmartBack();
```

You can destroy SmartBack

```js
smartBack.destroy();
```

## Options

```js
const options = {
  transitionDuration: 140,
  arrowTriggeringOffset: 2,
  staticActiveTranslateX: 40,
  enableArrowMirroring: true,
  callback: history.back.bind(window.history),
};
```

| Name                   | Type     | Default      | Description                                                                              |
| ---------------------- | -------- | ------------ | ---------------------------------------------------------------------------------------- |
| transitionDuration     | number   | 140          | Arrow animation speed when activated                                                     |
| arrowTriggeringOffset  | number   | 2            | Something like sensitivity. The number of pixels you need to swipe to activate the arrow |
| staticActiveTranslateX | number   | 40           | The number of pixels the arrow moves during the activation animation                     |
| enableArrowMirroring   | boolean  | true         | Mirroring left arrow                                                                     |
| callback               | function | history.back | The function to be executed after a successful swipe                                     |

## Development

When developing you can run:

```
yarn watch
```

## Testing

```sh
yarn test
or
yarn test:watch
```

## Building

```sh
yarn build
```

## Developer environment requirements

To run this project, you will need:

- Node.js >= v10.5.0, use nvm - [install instructions](https://github.com/creationix/nvm#install-script)
- Yarn >= v1.7.0 - [install instructions ("Alternatives" tab)](https://yarnpkg.com/en/docs/install#alternatives-rc)
