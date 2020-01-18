# cert-helper

Install and trust certificates automatically. Very useful in the use of agent software scenarios.

## Usage

### install certificate

Install certification as root certificate

```js
const { certInstaller } = require("cert-helper");
certInstaller(path.resolve("./certs/root.crt"), err => {
  if (err) {
    //install error
  } else {
    //install success
  }
});
```

### verify certificate

Check certificate is installed

```js
const { certVerify } = require("cert-helper");
certVerify(
  {
    certDir: path.resolve("./certs/root.crt"),
    certName: "certificate name"
  },

  err => {
    if (err) {
      console.info("Check cert failed!");
    } else {
      console.info("Check cert success!");
    }
  }
);
```
