import { strict as test } from "assert";
import { replaceHash } from "../plugin";

test.equal(
  replaceHash("script.[hash].js", "1234"),
  "script.d404559f602eab6fd602.js"
);
test.equal(
  replaceHash("script.[hash:20].js", "1234"),
  "script.d404559f602eab6fd602.js"
);
test.equal(replaceHash("script.[hash:8].js", "1234"), "script.d404559f.js");
test.equal(replaceHash("script.js", "1234"), "script.js");
test.equal(replaceHash("script[].js", "1234"), "script[].js");
test.equal(replaceHash("script.[has:8].js", "1234"), "script.[has:8].js");
