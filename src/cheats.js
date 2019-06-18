export let injectSquare = false;
export let injectTri = false;
export let injectCirc = false;

document.addEventListener(
  "keyup",
  e => {
    switch (e.key) {
      case "1":
        injectSquare = !injectSquare;
        if(injectSquare) {
            toggleVisibility('.sqr', true);
            injectTri = false;
            toggleVisibility('.tri', false);
            injectCirc = false;
            toggleVisibility('.circ', false);
        } else {
            toggleVisibility('.sqr', false);
        }
        break;
      case "2":
        injectTri = !injectTri;
        if(injectTri) {
            toggleVisibility('.tri', true);
            injectSquare = false;
            toggleVisibility('.sqr', false);
            injectCirc = false;
            toggleVisibility('.circ', false);
        } else {
            toggleVisibility('.tri', false);
        }
        break;
      case "3":
        injectCirc = !injectCirc;
        if(injectCirc) {
            toggleVisibility('.circ', true);
            injectSquare = false;
            toggleVisibility('.sqr', false);
            injectTri = false;
            toggleVisibility('.tri', false);
        } else {
            toggleVisibility('.circ', false);
        }
        break;
      default:
        break;
    }
  },
  false
);

function toggleVisibility(className, flag) {
  flag
    ? document
        .querySelector(className)
        .setAttribute("style", "visibility: visible")
    : document
        .querySelector(className)
        .setAttribute("style", "visibility: hidden");
}
